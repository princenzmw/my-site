import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "out");

function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath));
    } else if (file.endsWith(".html")) {
      results.push(fullPath);
    }
  }
  return results;
}

if (!fs.existsSync(OUT_DIR)) {
  console.log("No out/ directory found; skipping script optimization");
  process.exit(0);
}

const htmlFiles = getHtmlFiles(OUT_DIR);
console.log(`Found ${htmlFiles.length} HTML files to optimize...`);

let optimizedCount = 0;
for (const file of htmlFiles) {
  let html = fs.readFileSync(file, "utf8");
  const headEnd = html.indexOf("</head>");
  if (headEnd === -1) continue;

  const headContent = html.slice(0, headEnd);
  let newHead = headContent;

  // 1. Inline critical CSS to eliminate 100% of stylesheet network round-trip & contention
  const cssMatch = headContent.match(/<link rel="stylesheet" href="(\/_next\/static\/chunks\/[^"]+\.css)" data-precedence="next"\/?>/);
  if (cssMatch) {
    const cssRelPath = cssMatch[1];
    const cssFullPath = path.join(OUT_DIR, cssRelPath);
    if (fs.existsSync(cssFullPath)) {
      let cssContent = fs.readFileSync(cssFullPath, "utf8");
      // Fix relative paths: when inlined into HTML at any depth (/ or /projects/credio),
      // relative paths like ../media/ must resolve to absolute /_next/static/media/
      cssContent = cssContent.replace(/url\(\.\.\/media\//g, "url(/_next/static/media/");
      newHead = newHead.replace(
        cssMatch[0],
        `<style data-precedence="next">${cssContent}</style>`
      );
    }
  }

  // 2. Extract client chunks from <head> and inject via low-priority ordered loader at end of <body>
  const scriptsMatch = headContent.match(/<script src="\/_next\/static\/chunks\/[^"]+" async=""><\/script>/g);
  if (scriptsMatch && scriptsMatch.length > 0) {
    for (const s of scriptsMatch) {
      newHead = newHead.replace(s, "");
    }

    const scriptUrls = scriptsMatch
      .map((s) => {
        const m = s.match(/src="([^"]+)"/);
        return m ? m[1] : null;
      })
      .filter(Boolean);

    const loaderScript = `<script id="__next_deferred_loader">
(function(){
  var urls = ${JSON.stringify(scriptUrls)};
  for(var i=0; i<urls.length; i++){
    var s = document.createElement("script");
    s.src = urls[i];
    s.async = false;
    s.fetchPriority = "low";
    document.body.appendChild(s);
  }
})();
</script>`;

    html = newHead + html.slice(headEnd);
    html = html.replace("</body>", `${loaderScript}</body>`);
  } else {
    html = newHead + html.slice(headEnd);
  }

  fs.writeFileSync(file, html, "utf8");
  optimizedCount++;
}

console.log(`Successfully optimized CSS inlining & script loading across ${optimizedCount} prerendered pages!`);
