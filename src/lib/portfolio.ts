/**
 * nzamuwe.com — single source of truth for all site content.
 *
 * Every claim below traces to Prince's résumé (Oct 2026 draft), a public
 * repository, or a live demo. The only open item is FinAccess's Power BI
 * live-view URL, tracked in README-DEPLOY.md.
 *
 * Audit issue IDs in comments map to nzamuwe.com_Score_Elevation_Blueprint.pdf.
 * Shipped copy is written in a plain human voice: no em-dashes, no hype words.
 */

export const SITE = {
  name: "Prince Nzamuwe",
  brand: "Prince Nzamuwe",
  role: "Data Science · Machine Learning · Backend",
  /** Single source for the JSON-LD jobTitle — keeps structured data and page copy in lockstep. */
  jobTitle: "Data Scientist & Machine Learning Engineer",
  location: "Nairobi, Kenya",
  email: "prince@nzamuwe.com",
  phoneDisplay: "+254 757 723 708",
  phoneHref: "tel:+254757723708",
  whatsapp: "https://wa.me/254757723708",
  github: "https://github.com/princenzmw",
  linkedin: "https://www.linkedin.com/in/princenzmw/",
  credio: "https://credio.streamlit.app/",
  url: "https://nzamuwe.com",
  ogImage: "/og-image.png",
  resume: "/resume.pdf",
} as const;

/** Real routes, not hash links: each nav item is a prerendered page. */
export const NAV = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Contact", href: "/contact" },
] as const;

export const HERO = {
  kicker: "Nairobi, Kenya · Open to internships & freelance",
  // Role + proof in one screen, no generic tagline.
  // The accent word rotates (client enhancement); words[0] ships statically.
  headline: {
    plain: "Data scientist who ships",
    rotate: [
      "credit-risk models",
      "analytics dashboards",
      "backend APIs",
      "data apps end-to-end",
    ],
    plainAfter: "on real data, not toy datasets.",
  },
  subheadline:
    "Third-year BSc Data Science & Analytics student at USIU-Africa (expected 2028), trained through ALX and Andela's ATLP. I build the whole stack: PostgreSQL schemas, Python machine learning, FastAPI services, React front ends. Tested, documented, deployed.",
  primaryCta: { label: "View projects", href: "/projects" },
  secondaryCta: { label: "Download résumé (PDF)", href: "/resume.pdf" },
  tertiaryCta: { label: "Hiring? Email me", href: "mailto:prince@nzamuwe.com" },
} as const;

/** Count-up targets. Every number is reproducible from the linked repository. */
export const STATS = [
  { value: 150000, decimals: 0, suffix: "", label: "borrowers modeled in Credio", href: "https://github.com/princenzmw/credit-risk-scorecard" },
  { value: 0.869, decimals: 3, suffix: "", label: "ROC-AUC on a held-out test set", href: "https://github.com/princenzmw/credit-risk-scorecard" },
  { value: 28.1, decimals: 1, suffix: "M", label: "Kenyan adults represented in FinAccess", href: "https://github.com/princenzmw/finaccess-kenya-dashboard" },
  { value: 84.8, decimals: 1, suffix: "%", label: "formal financial access, matching the published topline", href: "https://github.com/princenzmw/finaccess-kenya-dashboard" },
] as const;

export type Project = {
  id: string;
  name: string;
  tagline: string;
  role: string;
  status: "live" | "in-development";
  problem: string;
  approach: string;
  results: string[];
  stack: string[];
  metrics: string[];
  code: string;
  codeLabel?: string;
  demo?: string;
  demoNote?: string;
  accent: string;
  featured?: boolean;
};

/** Real repositories replace any placeholder links. Each project has a detail page at /projects/<id>. */
export const PROJECTS: Project[] = [
  {
    id: "credio",
    name: "Credio: Credit-Risk Scorecard",
    tagline: "Probability of default turned into decision-ready risk bands, live in the browser",
    role: "Solo: data, modeling, app, CI",
    status: "live",
    featured: true,
    problem:
      "Lenders don't need a leaderboard score. They need calibrated probabilities they can price. Predict the chance a borrower goes 90+ days past due within two years, then turn that probability into defensible risk bands.",
    approach:
      "Leak-free pipeline on 150,000 real borrower records, with special codes and 20% missing income handled inside the scikit-learn pipeline. I built a logistic scorecard baseline (0.823 ROC-AUC on validation) and a gradient-boosting model, then picked between them on a held-out test set, not on the leaderboard.",
    results: [
      "ROC-AUC 0.869 · PR-AUC 0.407 · KS 0.584 · Brier 0.0486",
      "Calibrated risk bands: observed default runs from 1.1% (safest band) to 39.0% (riskiest), with a cost-based approval threshold",
      "Tested class weights and SMOTE, then rejected both because they distorted predicted probabilities",
      "Streamlit app with per-applicant explanations, 19 unit tests, and GitHub Actions CI",
    ],
    stack: ["Python", "scikit-learn", "pandas", "Streamlit", "pytest", "GitHub Actions"],
    metrics: ["0.869 ROC-AUC", "0.407 PR-AUC", "150K borrowers", "19 tests"],
    code: "https://github.com/princenzmw/credit-risk-scorecard",
    demo: "https://credio.streamlit.app/",
    accent: "from-blue-600/10 via-primary/5 to-cyan-400/10",
  },
  {
    id: "finaccess",
    name: "FinAccess Kenya: Financial Inclusion Dashboard",
    tagline: "A 290 MB government survey made explorable at county level",
    role: "Solo: data engineering, analysis, BI",
    status: "live",
    problem:
      "Kenya's FinAccess 2024 survey (CBK · KNBS · FSD Kenya) ships as a 290 MB workbook that almost nobody can explore. I made household financial inclusion explorable at county level, with survey weights handled correctly.",
    approach:
      "A streaming prep script turned the 290 MB workbook into an 8 MB CSV: 19,750 adult records × 63 columns, weight variables included, reconciled against the published topline. On top of it sits a five-page Power BI model with DAX measures.",
    results: [
      "Weighted results reconcile with the published topline: 84.8% formal access, 9.9% excluded",
      "County formal access ranges from 48.5% to 94.0%, a 45-point gap across Kenya",
      "Among adults without an ID, 63% are excluded from formal finance. With an ID, that figure is 5%",
    ],
    stack: ["Power BI (DAX)", "Python", "pandas"],
    metrics: ["28.1M weighted", "290 MB → 8 MB", "5 pages", "84.8% matched"],
    code: "https://github.com/princenzmw/finaccess-kenya-dashboard",
    accent: "from-emerald-600/10 via-primary/5 to-teal-400/10",
  },
  {
    id: "dukapulse",
    name: "DukaPulse: Stock & Sales App for Small Shops",
    tagline: "Inventory that can't oversell, forecasts that earn their keep",
    role: "Solo: full-stack, API to frontend",
    status: "in-development",
    problem:
      "Small-shop owners track stock on paper and reorder on guesswork. This is a full-stack system with roles, oversell-proof sales, and demand forecasts that are honestly benchmarked.",
    approach:
      "FastAPI and PostgreSQL on the backend, React and TypeScript on the frontend, Docker for packaging. JWT authentication with owner and staff roles. Sales are transactionally blocked from overselling stock, and every product gets a 4-week demand forecast backtested against a seasonal-naive baseline.",
    results: [
      "Core shipped: JWT auth with owner/staff roles and the oversell-proof sales flow",
      "Playwright end-to-end tests on top of a pytest backend suite, running on GitHub Actions CI",
      "Forecast accuracy and test-coverage numbers publish here on completion. No invented figures.",
    ],
    stack: ["FastAPI", "PostgreSQL", "React", "TypeScript", "Docker", "Playwright"],
    metrics: ["JWT + roles", "Oversell-proof", "4-wk forecasts", "E2E tested"],
    code: "https://github.com/princenzmw",
    codeLabel: "Follow the build",
    demoNote: "In active development. The repository and a live app land here with v1.0.",
    accent: "from-amber-500/10 via-primary/5 to-orange-400/10",
  },
  {
    id: "airbnb",
    name: "AirBnB Clone v4",
    tagline: "Full-stack engineering across four public iterations",
    role: "Solo: software engineering",
    status: "live",
    problem:
      "Carry a data product beyond the notebook: a four-iteration build covering a CLI console, an ORM persistence layer, a RESTful API, and a dynamic web frontend.",
    approach:
      "Iterative architecture: file storage, then a SQLAlchemy ORM, then a Flask REST API with a Jinja2 frontend. One consistent codebase, unit tests at every step, and every iteration publicly committed.",
    results: ["Four iterations, each publicly committed. Evidence of sustained engineering practice."],
    stack: ["Python", "SQLAlchemy", "Flask", "MySQL", "Docker"],
    metrics: ["4 iterations", "REST API", "ORM", "Tested"],
    code: "https://github.com/princenzmw/AirBnB_clone_v4",
    accent: "from-violet-600/10 via-primary/5 to-fuchsia-400/10",
  },
];

export const ABOUT = {
  kicker: "About",
  // Lede under the h1 on /about — sets the evidence contract in one line.
  title: "Everything below links to the code that proves it.",
  paragraphs: [
    "I got into data science through a question about money: who gets credit, and why? That question became Credio, a credit-risk scorecard trained on 150,000 real borrower records. Building it taught me why calibrated probabilities matter more than a leaderboard metric, and why a model you can't explain shouldn't ship.",
    "I trained deliberately. Nine months in the Andela Technical Leadership Program, shipping features of a full-stack e-commerce app in a 9-person Agile team, including the PostgreSQL schema behind it. Django and React work at Ida Technology. The ALX Software Engineering Foundations phase before that. The pattern in all of it: build end to end, test as you go, and let other people rerun your work.",
    "The parts of data work I care about are the unglamorous ones: correct survey weights, calibrated probabilities, honest baselines, and code other people can rerun without having to ask you questions. My GitHub (github.com/princenzmw) is the receipts column for everything on this site.",
  ],
  currently:
    "Now: third year of the BSc in Data Science & Analytics at United States International University-Africa (USIU-Africa), Nairobi, expected 2028. Open to data, ML, and software internships, remote or in Nairobi, and to freelance dashboards and data apps.",
} as const;

/** Evidence-linked groups, no percentage bars. */
export const SKILLS = [
  {
    area: "Data & Machine Learning",
    tools: ["Python", "pandas", "scikit-learn", "SQL", "PostgreSQL", "MySQL", "Power BI (DAX)", "R", "MATLAB"],
    proof: { label: "Credio scorecard · FinAccess pipeline", href: "https://github.com/princenzmw/credit-risk-scorecard" },
  },
  {
    area: "Web & Software",
    tools: ["FastAPI", "Django", "Flask", "TypeScript", "JavaScript", "React", "REST APIs", "JWT auth", "Streamlit"],
    proof: { label: "DukaPulse build · AirBnB Clone v4", href: "https://github.com/princenzmw" },
  },
  {
    area: "Tools & Practice",
    tools: ["Git/GitHub", "GitHub Actions (CI)", "Docker", "pytest", "Playwright", "Agile teamwork", "Code review", "Figma-to-code"],
    proof: { label: "CI badges on every repo", href: "https://github.com/princenzmw" },
  },
] as const;

/** USIU coursework — runs in the marquee ticker under Skills on /about. */
export const COURSEWORK = [
  "Statistical Modeling",
  "Machine Learning",
  "Statistical Inference",
  "Data Warehousing & Mining",
  "Optimization",
  "Statistical Computing",
  "Data Structures & Algorithms",
  "Database Systems",
] as const;

export const EDUCATION = [
  {
    title: "BSc Data Science & Analytics",
    org: "United States International University-Africa (USIU-Africa), Nairobi",
    period: "2024–2028 (expected) · 3rd year",
    points: ["Coursework across modeling, ML, data engineering, and optimization, applied directly in the projects above."],
  },
  {
    title: "ALX Software Engineering Programme",
    org: "Online, full-stack training",
    period: "Foundations Phase (9 months), completed",
    points: ["Project repositories public on GitHub."],
  },
] as const;

export const CERTIFICATIONS = [
  { name: "Back-End Developer Certificate", issuer: "Meta" },
  { name: "JavaScript Algorithms and Data Structures", issuer: "freeCodeCamp" },
  { name: "Artificial Intelligence Fundamentals", issuer: "IBM SkillsBuild" },
] as const;

/** The honest timeline, fully sourced from the résumé. */
export const EXPERIENCE = [
  {
    title: "Apprentice · Andela Technical Leadership Program (ATLP)",
    org: "Rwanda",
    period: "Jan 2024 to Sep 2024",
    points: [
      "Shipped features of a full-stack e-commerce app (TypeScript, React, PostgreSQL) in a 9-person Agile team, with code reviews.",
      "Designed the normalized PostgreSQL schema for products, users, and orders.",
    ],
  },
  {
    title: "Trainee · Ida Technology (NEET program)",
    org: "Rwanda",
    period: "Dec 2023 to Jun 2024",
    points: [
      "Built Django and React web apps with JWT authentication.",
      "Converted Figma designs into responsive React components.",
    ],
  },
  {
    title: "Participant · MLH Global Hack Week, API Week",
    org: "Major League Hacking, online",
    period: "Nov 2025",
    points: [
      "A week of building with APIs: daily mini-projects, workshops, and rapid prototyping alongside other hackers.",
    ],
  },
  {
    title: "Independent data science projects",
    org: "Nairobi",
    period: "2024 to present",
    points: [
      "Credio, the FinAccess dashboard, and DukaPulse, alongside the USIU-Africa degree. Full commit history on GitHub.",
    ],
  },
] as const;

/** Recruiters first, consulting secondary. */
export const CONSULTING = {
  text: "I also take a small number of freelance engagements: data analysis, dashboards, and web apps. Businesses (not recruiters): email me and let's talk.",
} as const;

export const CONTACT = {
  heading: "Let's build something real",
  text: "Hiring for a data, ML, or software internship? Need a dashboard or data app built? Email is fastest, and I reply within a day.",
} as const;

export const FOOTER = {
  referencesLine: "References & background checks welcome.",
  privacyLine:
    "Privacy: this site uses Plausible Analytics, which is cookie-free, stores no personal data, and does no cross-site tracking.",
  copyright: `© ${new Date().getFullYear()} Prince Nzamuwe. All rights reserved.`,
} as const;
