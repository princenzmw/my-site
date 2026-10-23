import { spawn } from "node:child_process";
import fs from "node:fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const ROUTES = [
  {
    name: "Home",
    key: "home",
    url: "https://nzamuwe.com/",
    anchors: ["projects", "contact"],
  },
  {
    name: "Credio",
    key: "credio",
    url: "https://nzamuwe.com/projects/credio",
    anchors: ["problem", "approach", "results", "stack"],
  },
  {
    name: "FinAccess",
    key: "finaccess",
    url: "https://nzamuwe.com/projects/finaccess",
    anchors: ["problem", "approach", "results", "stack"],
  },
  {
    name: "DukaPulse",
    key: "dukapulse",
    url: "https://nzamuwe.com/projects/dukapulse",
    anchors: ["problem", "approach", "results", "stack"],
  },
  {
    name: "AirBnB",
    key: "airbnb",
    url: "https://nzamuwe.com/projects/airbnb",
    anchors: ["problem", "approach", "results", "stack"],
  },
];

async function measureRouteCls(route) {
  console.log(`\n======================================================`);
  console.log(`SWEEPING ROUTE: ${route.name} (${route.url})`);
  console.log(`======================================================`);

  const port = 9250 + Math.floor(Math.random() * 40);
  const tempDir = `C:\\Users\\Prince\\AppData\\Local\\Temp\\chrome-sweep-5r-${Date.now()}`;
  const chrome = spawn(CHROME_PATH, [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    "--no-sandbox",
    "--disable-gpu",
    `--user-data-dir=${tempDir}`,
  ]);

  await new Promise((r) => setTimeout(r, 1600));

  const versionResp = await fetch(`http://127.0.0.1:${port}/json/version`);
  const versionData = await versionResp.json();
  const ws = new WebSocket(versionData.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));

  let id = 1;
  const send = (method, params = {}) =>
    new Promise((resolve) => {
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

  const sendSession = (method, params = {}) =>
    new Promise((resolve) => {
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

  await sendSession("Network.enable");
  await sendSession("Network.setCacheDisabled", { cacheDisabled: true });
  await sendSession("Emulation.setCPUThrottlingRate", { rate: 4 });
  await sendSession("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true,
  });

  await sendSession("Page.enable");

  // Track LayoutShift events with granular node & rect metadata
  await sendSession("Page.addScriptToEvaluateOnNewDocument", {
    source: `
      window.__shifts = [];
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            const sources = (entry.sources || []).map(s => {
              let nodeDesc = null;
              if (s.node) {
                const tag = s.node.nodeName ? s.node.nodeName.toLowerCase() : '';
                const idStr = s.node.id ? '#' + s.node.id : '';
                const clsStr = s.node.className && typeof s.node.className === 'string' ? '.' + s.node.className.split(' ').filter(Boolean).slice(0, 3).join('.') : '';
                const text = s.node.textContent ? s.node.textContent.slice(0, 50).trim() : '';
                nodeDesc = {
                  selector: tag + idStr + clsStr,
                  tag: tag,
                  id: s.node.id || null,
                  className: typeof s.node.className === 'string' ? s.node.className : null,
                  textSnippet: text
                };
              }
              return {
                node: nodeDesc,
                currentRect: s.currentRect ? { x: s.currentRect.x, y: s.currentRect.y, w: s.currentRect.width, h: s.currentRect.height } : null,
                previousRect: s.previousRect ? { x: s.previousRect.x, y: s.previousRect.y, w: s.previousRect.width, h: s.previousRect.height } : null
              };
            });
            window.__shifts.push({
              value: entry.value,
              startTime: Math.round(entry.startTime),
              phase: window.__currentPhase || 'initial-load',
              sources: sources
            });
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    `,
  });

  await sendSession("Page.navigate", { url: route.url });
  await new Promise((r) => setTimeout(r, 4000));

  // Full scroll sweep to footer in 250px increments
  await sendSession("Runtime.evaluate", {
    expression: "window.__currentPhase = 'scroll-sweep'",
  });

  const maxScroll = await sendSession("Runtime.evaluate", {
    expression: "document.documentElement.scrollHeight - window.innerHeight",
    returnByValue: true,
  });
  const totalDistance = Math.max(0, maxScroll.result.value || 3000);
  const stepSize = 250;
  let scrollSteps = 0;

  for (let pos = 0; pos <= totalDistance; pos += stepSize) {
    await sendSession("Runtime.evaluate", {
      expression: `window.scrollTo({ top: ${pos}, behavior: 'instant' })`,
    });
    scrollSteps++;
    await new Promise((r) => setTimeout(r, 60));
  }

  // Scroll back to top
  await sendSession("Runtime.evaluate", {
    expression: "window.scrollTo({ top: 0, behavior: 'instant' })",
  });
  scrollSteps++;
  await new Promise((r) => setTimeout(r, 200));

  // Test anchor jumps
  let anchorJumps = 0;
  for (const anchor of route.anchors) {
    await sendSession("Runtime.evaluate", {
      expression: `window.__currentPhase = 'anchor-#${anchor}'`,
    });
    await sendSession("Runtime.evaluate", {
      expression: `(() => {
        const el = document.getElementById('${anchor}');
        if (el) el.scrollIntoView();
      })()`,
    });
    anchorJumps++;
    await new Promise((r) => setTimeout(r, 250));
  }

  // Settle window
  await sendSession("Runtime.evaluate", {
    expression: "window.__currentPhase = 'settle'",
  });
  await new Promise((r) => setTimeout(r, 500));

  const totalInteractions = scrollSteps + anchorJumps;

  const shiftData = await sendSession("Runtime.evaluate", {
    expression: `(() => {
      const totalCls = window.__shifts.reduce((acc, s) => acc + s.value, 0);
      return {
        totalShifts: window.__shifts.length,
        totalCls: totalCls,
        shifts: window.__shifts
      };
    })()`,
    returnByValue: true,
  });

  chrome.kill();

  const res = shiftData.result.value;
  console.log(`Route ${route.name}: Total Distance ${totalDistance}px, Steps: ${scrollSteps}, Anchors: ${anchorJumps}, N=${totalInteractions}`);
  console.log(`Total Shifts: ${res.totalShifts}, Accumulated CLS: ${res.totalCls.toFixed(5)}`);

  return {
    url: route.url,
    totalDistancePx: totalDistance,
    stepSizePx: stepSize,
    scrollStepsCount: scrollSteps,
    anchorJumpsCount: anchorJumps,
    anchorsTested: route.anchors,
    totalInteractions: totalInteractions,
    totalShifts: res.totalShifts,
    totalCls: res.totalCls,
    shifts: res.shifts,
    status: res.totalCls === 0 ? "PASS" : "FAIL",
  };
}

async function main() {
  const resultData = {};
  for (const r of ROUTES) {
    resultData[r.key] = await measureRouteCls(r);
  }

  resultData.verifiedAt = new Date().toISOString();

  fs.writeFileSync("evidence/scroll-sweep-cls.json", JSON.stringify(resultData, null, 2));
  console.log("\n======================================================");
  console.log("Wrote full 5-route verification to evidence/scroll-sweep-cls.json");
  console.log("======================================================");
  for (const r of ROUTES) {
    const data = resultData[r.key];
    console.log(`  ${r.name.padEnd(12)}: CLS ${data.totalCls.toFixed(5)} (Shifts: ${data.totalShifts}, N=${data.totalInteractions}) [${data.status}]`);
  }
}

main().catch(console.error);
