import { spawn } from "node:child_process";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const TARGET_URL = "https://nzamuwe.com/";

async function testRun(blockScripts) {
  const chrome = spawn(CHROME_PATH, [
    "--headless=new",
    "--remote-debugging-port=9235",
    "--no-sandbox",
    "--disable-gpu",
    "--user-data-dir=" + `C:\\Users\\Prince\\AppData\\Local\\Temp\\chrome-causal-${Date.now()}`
  ]);

  await new Promise(r => setTimeout(r, 1500));

  const versionResp = await fetch("http://127.0.0.1:9235/json/version");
  const versionData = await versionResp.json();
  const ws = new WebSocket(versionData.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (method, params = {}) => new Promise((resolve) => {
    const curId = id++;
    const handler = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === curId) {
        ws.removeEventListener("message", handler);
        resolve(data.result);
      }
    };
    ws.addEventListener("message", handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });

  const sendSession = (method, params = {}) => new Promise((resolve) => {
    const curId = id++;
    const handler = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.id === curId) {
        ws.removeEventListener("message", handler);
        resolve(data.result);
      }
    };
    ws.addEventListener("message", handler);
    ws.send(JSON.stringify({ id: curId, sessionId, method, params }));
  });

  const requests = new Map();
  ws.addEventListener("message", (msg) => {
    const evt = JSON.parse(msg.data);
    if (!evt.method) return;
    if (evt.method === "Network.requestWillBeSent") {
      requests.set(evt.params.requestId, {
        url: evt.params.request.url,
        startTime: evt.params.timestamp,
        type: evt.params.type
      });
    } else if (evt.method === "Network.responseReceived") {
      const req = requests.get(evt.params.requestId);
      if (req) {
        req.responseReceivedTime = evt.params.timestamp;
        req.status = evt.params.response.status;
        req.mimeType = evt.params.response.mimeType;
      }
    } else if (evt.method === "Network.loadingFinished") {
      const req = requests.get(evt.params.requestId);
      if (req) {
        req.loadingFinishedTime = evt.params.timestamp;
        req.encodedDataLength = evt.params.encodedDataLength;
      }
    }
  });

  await sendSession("Network.enable");
  await sendSession("Network.setCacheDisabled", { cacheDisabled: true });
  await sendSession("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150, // 150ms RTT
    downloadThroughput: (1.638 * 1024 * 1024) / 8, // 1.638 Mbps
    uploadThroughput: (750 * 1024) / 8
  });
  await sendSession("Emulation.setCPUThrottlingRate", { rate: 4 });
  await sendSession("Page.enable");

  if (blockScripts) {
    await sendSession("Network.setBlockedURLs", { urls: ["*.js*"] });
  }

  const navStart = performance.now();
  await sendSession("Page.navigate", { url: TARGET_URL });

  await new Promise(r => setTimeout(r, 6000));

  const timings = await sendSession("Runtime.evaluate", {
    expression: `(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      const fcp = paint.find(p => p.name === 'first-contentful-paint')?.startTime;
      return {
        ttfb: nav ? nav.responseStart : null,
        domInteractive: nav ? nav.domInteractive : null,
        fcp: fcp || null
      };
    })()`,
    returnByValue: true
  });

  chrome.kill();

  let cssReq = null;
  for (const [id, r] of requests.entries()) {
    if (r.url.endsWith(".css") || r.url.includes(".css")) {
      cssReq = r;
      break;
    }
  }

  return {
    blockScripts,
    timings: timings.result.value,
    cssReq: cssReq ? {
      url: cssReq.url,
      transferBytes: cssReq.encodedDataLength,
      // relative to nav start
      startDelta: cssReq.startTime,
      responseDelta: cssReq.responseReceivedTime,
      finishDelta: cssReq.loadingFinishedTime
    } : null,
    totalRequests: requests.size
  };
}

async function main() {
  console.log("=== RUN 1: Normal (All requests allowed, cold cache) ===");
  const normal = await testRun(false);
  console.log("Normal Run Result:", JSON.stringify(normal, null, 2));

  console.log("\n=== RUN 2: Script Requests Blocked (Zero JS stream contention) ===");
  const blocked = await testRun(true);
  console.log("Blocked Scripts Result:", JSON.stringify(blocked, null, 2));
}

main().catch(console.error);
