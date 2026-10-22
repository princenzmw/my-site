/**
 * tests/portfolio.test.ts — data integrity for the site's single source of truth.
 * If any of these fail, the site is making a claim the data can't back.
 */
import { describe, expect, it } from "vitest";
import {
  SITE,
  NAV,
  HERO,
  STATS,
  PROJECTS,
  ABOUT,
  SKILLS,
  COURSEWORK,
  EDUCATION,
  CERTIFICATIONS,
  EXPERIENCE,
  CONSULTING,
  CONTACT,
  FOOTER,
} from "../src/lib/portfolio";

const OLD_EMAIL = /princenzma@gmail\.com/i;
const FINGERPRINT = /vly|TechCorp|DataFlow|github\.com\/example|happy-otter|blissful-ocelot/i;

describe("SITE identity", () => {
  it("uses the current email and consistent phone formats", () => {
    expect(SITE.email).toBe("prince@nzamuwe.com");
    expect(OLD_EMAIL.test(JSON.stringify(SITE))).toBe(false);
    expect(SITE.phoneHref).toBe("tel:+254757723708");
    expect(SITE.whatsapp).toBe("https://wa.me/254757723708");
    expect(SITE.phoneDisplay).toBe("+254 757 723 708");
  });

  it("points at the production domain and owned GitHub", () => {
    expect(SITE.url).toBe("https://nzamuwe.com");
    expect(SITE.github).toBe("https://github.com/princenzmw");
    expect(SITE.jobTitle.length).toBeGreaterThan(3);
  });

  it("exposes real routes, not hash links, and every route is a prerendered page", () => {
    expect(NAV.map((n) => n.href)).toEqual(["/about", "/projects", "/experience", "/contact"]);
    for (const n of NAV) expect(n.href.startsWith("/#")).toBe(false);
    // Every nav route plus the home page has a matching case study or page file.
    expect(PROJECTS.map((p) => `/projects/${p.id}`).sort()).toEqual([
      "/projects/airbnb",
      "/projects/credio",
      "/projects/dukapulse",
      "/projects/finaccess",
    ]);
  });

  it("keeps a human voice: no em-dashes anywhere in shipped copy", () => {
    const copy = JSON.stringify({
      SITE, NAV, HERO, STATS, PROJECTS, ABOUT, SKILLS, COURSEWORK,
      EDUCATION, CERTIFICATIONS, EXPERIENCE, CONSULTING, CONTACT, FOOTER,
    });
    expect(copy).not.toContain("\u2014");
    // And none of the filler the owner flagged as machine-sounding.
    expect(copy).not.toMatch(/seamless|cutting-edge|world-class|passionate/i);
  });
});

describe("PROJECTS — every card makes only supportable claims", () => {
  it("has four fully-populated projects", () => {
    expect(PROJECTS).toHaveLength(4);
    for (const p of PROJECTS) {
      expect(p.id.length).toBeGreaterThan(2);
      expect(p.name.length).toBeGreaterThan(5);
      expect(p.tagline.length).toBeGreaterThan(10);
      expect(p.problem.length).toBeGreaterThan(40);
      expect(p.approach.length).toBeGreaterThan(40);
      expect(p.results.length).toBeGreaterThan(0);
      expect(p.metrics.length).toBeGreaterThanOrEqual(3);
      expect(p.stack.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("links only to owned repositories", () => {
    for (const p of PROJECTS) {
      expect(p.code.startsWith("https://github.com/princenzmw")).toBe(true);
    }
    expect(PROJECTS.find((p) => p.id === "credio")?.code).toBe(
      "https://github.com/princenzmw/credit-risk-scorecard",
    );
    expect(PROJECTS.find((p) => p.id === "finaccess")?.code).toBe(
      "https://github.com/princenzmw/finaccess-kenya-dashboard",
    );
    expect(PROJECTS.find((p) => p.id === "airbnb")?.code).toBe(
      "https://github.com/princenzmw/AirBnB_clone_v4",
    );
  });

  it("never shows a demo or fake numbers for in-development work", () => {
    const wip = PROJECTS.filter((p) => p.status === "in-development");
    expect(wip).toHaveLength(1);
    expect(wip[0].id).toBe("dukapulse");
    expect(wip[0].demo).toBeUndefined();
    // No invented performance figures: WIP metrics must be qualitative only.
    expect(wip[0].metrics.every((m) => !/[0-9]+\.[0-9]+/.test(m))).toBe(true);
    expect(wip[0].results.join(" ")).toMatch(/no invented figures|completion/i);
  });

  it("keeps the two live flagship demos honest and linked", () => {
    const credio = PROJECTS.find((p) => p.id === "credio");
    expect(credio?.status).toBe("live");
    expect(credio?.demo).toBe("https://credio.streamlit.app/");
    expect(credio?.results.join(" ")).toContain("0.869");
    expect(credio?.results.join(" ")).toContain("0.407");
    expect(credio?.results.join(" ")).toContain("19 unit tests");
    const fin = PROJECTS.find((p) => p.id === "finaccess");
    expect(fin?.status).toBe("live");
    expect(fin?.results.join(" ")).toContain("84.8%");
  });

  it("contains no unresolved brackets in shipped claim fields", () => {
    for (const p of PROJECTS) {
      const claimText = [p.problem, p.approach, ...p.results, ...p.metrics].join(" ");
      expect(claimText).not.toContain("[BRACKET");
    }
  });

  it("carries no template fingerprints anywhere in content data", () => {
    expect(FINGERPRINT.test(JSON.stringify({ SITE, HERO, ABOUT, PROJECTS, SKILLS, STATS }))).toBe(false);
  });
});

describe("STATS — the proof band", () => {
  it("has four figures, each traceable to a repository", () => {
    expect(STATS).toHaveLength(4);
    for (const s of STATS) {
      expect(s.href.startsWith("https://github.com/princenzmw/")).toBe(true);
      expect(s.label.length).toBeGreaterThan(10);
    }
    expect(STATS.find((s) => s.value === 0.869)?.decimals).toBe(3);
  });
});

describe("Background sections", () => {
  it("tell the honest timeline with real employers only", () => {
    const orgs = EXPERIENCE.map((e) => `${e.title} ${e.org}`).join(" ");
    expect(orgs).toContain("Andela Technical Leadership Program");
    expect(orgs).toContain("Ida Technology");
    expect(FINGERPRINT.test(orgs)).toBe(false);
    // The old inflated "Senior Data Scientist 2022–present" claim stays gone.
    expect(orgs).not.toMatch(/senior/i);
  });

  it("lists education and certifications without placeholders", () => {
    expect(EDUCATION.some((e) => e.title.includes("BSc Data Science & Analytics"))).toBe(true);
    expect(EDUCATION.join).toBeTruthy();
    expect(CERTIFICATIONS.length).toBeGreaterThanOrEqual(3);
    for (const c of CERTIFICATIONS) {
      expect(c.name.length).toBeGreaterThan(5);
      expect(c.issuer.length).toBeGreaterThan(2);
    }
  });

  it("keeps every skill group backed by a proof link", () => {
    expect(SKILLS.length).toBe(3);
    for (const g of SKILLS) {
      expect(g.tools.length).toBeGreaterThanOrEqual(6);
      expect(g.proof.href.startsWith("https://")).toBe(true);
      expect(g.proof.label.length).toBeGreaterThan(5);
    }
  });
});
