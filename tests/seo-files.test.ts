/**
 * tests/seo-files.test.ts — discoverability files can never regress silently.
 * Guards robots.txt, sitemap.xml, security headers, and the meta description budget.
 */
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const read = (rel: string): string => readFileSync(fileURLToPath(new URL(rel, import.meta.url)), "utf8");

describe("robots.txt", () => {
  const robots = read("../public/robots.txt");
  it("declares the absolute production sitemap", () => {
    expect(robots).toContain("Sitemap: https://nzamuwe.com/sitemap.xml");
  });
  it("allows crawlers and blocks nothing unintended", () => {
    expect(robots).toMatch(/User-agent: \*\s*\nAllow: \//);
    expect(robots).not.toMatch(/Disallow: \/$/m);
    const disallows = [...robots.matchAll(/Disallow: (\S+)/g)].map((m) => m[1]);
    for (const d of disallows) expect(d.startsWith("/auth")).toBe(true); // only the intentional block
  });
});

describe("sitemap.xml", () => {
  const sitemap = read("../public/sitemap.xml");
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  it("lists only absolute production URLs", () => {
    expect(locs.length).toBeGreaterThanOrEqual(2);
    for (const l of locs) expect(l.startsWith("https://nzamuwe.com/")).toBe(true);
  });
  it("includes the homepage and the résumé", () => {
    expect(locs).toContain("https://nzamuwe.com/");
    expect(locs).toContain("https://nzamuwe.com/resume.pdf");
  });
  it("lists every prerendered route and every case study", () => {
    const routes = [
      "", "about", "projects", "projects/credio", "projects/finaccess",
      "projects/dukapulse", "projects/airbnb", "experience", "contact", "resume.pdf",
    ];
    for (const r of routes) expect(locs).toContain(`https://nzamuwe.com/${r}`);
  });
});

describe("public/_headers", () => {
  const headers = read("../public/_headers");
  it("ships security headers", () => {
    expect(headers).toContain("Strict-Transport-Security");
    expect(headers).toContain("X-Content-Type-Options: nosniff");
    expect(headers).toContain("Content-Security-Policy");
  });
  it("never introduces an indexing block", () => {
    expect(headers).not.toContain("X-Robots-Tag");
    expect(headers.toLowerCase()).not.toContain("noindex");
  });
});

describe("layout metadata budget", () => {
  const layout = read("../src/app/layout.tsx");
  const description = layout.match(/description:\s*\n?\s*"([^"]+)"/)?.[1] ?? "";
  it("keeps the meta description within 70–160 characters", () => {
    expect(description.length).toBeGreaterThanOrEqual(70);
    expect(description.length).toBeLessThanOrEqual(160);
  });
  it("keeps the title within 15–65 characters", () => {
    const title = layout.match(/default:\s*"([^"]+)"/)?.[1] ?? "";
    expect(title.length).toBeGreaterThanOrEqual(15);
    expect(title.length).toBeLessThanOrEqual(65);
  });
});
