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
console.log(`Found ${htmlFiles.length} HTML files to optimize script loading...`);

let optimizedCount = 0;
for (const file of htmlFiles) {
  let html = fs.readFileSync(file, "utf8");
  const headEnd = html.indexOf("</head>");
  if (headEnd === -1) continue;

  const headContent = html.slice(0, headEnd);
  const scriptsMatch = headContent.match(/<script src="\/_next\/static\/chunks\/[^"]+" async=""><\/script>/g);

  if (scriptsMatch && scriptsMatch.length > 0) {
    let newHead = headContent;
    for (const s of scriptsMatch) {
      newHead = newHead.replace(s, "");
    }

    const modifiedScripts = scriptsMatch
      .map((s) => s.replace('async=""', 'defer="" fetchpriority="low"'))
      .join("");

    html = newHead + html.slice(headEnd);
    html = html.replace("</body>", `${modifiedScripts}</body>`);

    fs.writeFileSync(file, html, "utf8");
    optimizedCount++;
  }
}

console.log(`Successfully optimized script loading across ${optimizedCount} prerendered pages!`);
