import fs from "node:fs";

const lh = JSON.parse(fs.readFileSync("C:/Users/Prince/.gemini/antigravity/brain/e30ce844-a10d-4916-9793-b544026301c2/scratch/lh-test-dt.json", "utf8"));
const tasks = lh.audits["diagnostics"]?.details?.items?.[0] || {};
console.log("Diagnostics:", tasks);

const mainThreadWork = lh.audits["mainthread-work-breakdown"]?.details?.items || [];
console.log("\nMain Thread Work Breakdown:");
mainThreadWork.forEach(w => console.log(`  - ${w.groupLabel || w.group}: ${w.duration?.toFixed(0)} ms`));

const longTasks = lh.audits["long-tasks"]?.details?.items || [];
console.log("\nLong Tasks:");
longTasks.forEach(t => console.log(`  - start: ${t.startTime?.toFixed(0)} ms | duration: ${t.duration?.toFixed(0)} ms | url: ${t.url || 'internal'}`));
