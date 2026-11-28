/**
 * nzamuwe.com: single source of truth for all site content.
 *
 * Every claim below traces to Prince's resume, a public repository,
 * or a live demo.
 *
 * Shipped copy is written in a direct human voice: no em dashes, en dashes, or filler words.
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
  credio: "https://credio.nzamuwe.com/",
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
  kicker: "Nairobi, Kenya · Open to internships & part-time roles",
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
  accentSolid: string;
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
    demo: "https://credio.nzamuwe.com/",
    accent: "from-blue-600/20 via-primary/10 to-cyan-400/15",
    accentSolid: "border-l-blue-600",
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
    accent: "from-emerald-600/20 via-primary/10 to-teal-400/15",
    accentSolid: "border-l-emerald-600",
  },
  {
    id: "dukapulse",
    name: "DukaPulse: Stock & Sales App for Small Shops",
    tagline: "Inventory that can't oversell, forecasts that earn their keep",
    role: "Solo: full-stack · MLH Builders Week (Nov 2026)",
    status: "live",
    problem:
      "Small-shop owners track stock on paper and reorder on guesswork. DukaPulse is a full-stack retail POS and telemetry system with role-based access control, race-proof inventory checkouts, and demand forecasts that earn their compute by beating moving baselines.",
    approach:
      "FastAPI, TimescaleDB, and PostgreSQL on the backend with a kiosk POS and Streamlit analytics dashboard. Sales decrement atomically at the engine level with CHECK (current_stock >= 0) to eliminate oversell races, while restock uses SELECT FOR UPDATE row locks. Time-series events write to a 7-day chunk hypertable with continuous aggregates refreshing at 30-minute and 1-hour cadences on Timescale Cloud. Catalog search runs 384-dimensional FastEmbed ONNX embeddings with Swahili vernacular expansion.",
    results: [
      "30 tests (25 unit + 5 real-engine integration) · 10,000 concurrent checkout attempts · 0 oversells · 60 days of history",
      "Concurrency verified in CI: 16 threads racing 10,000 checkouts against 1 unit yield exactly 1 success, 9,999 × 409 InsufficientStockError, and zero oversells (tests/test_integration_engine.py#L160-L226)",
      "Forecasting tournament: Seasonal-Naive won 14/14 products (1.012% to 5.433% baseline MAPE vs 2.533% to 16.58% Holt Linear); ships the baseline by design (docs/receipts/forecast_mape.json)",
      "Semantic retrieval: ONNX all-MiniLM-L6-v2 matches vernacular queries (unga ya ugali 0.8611, sabuni ya kuoga 0.6119, mafuta ya kupika 0.7743) and out-of-map English terms (soap 0.5005, rice 0.5541, tea 0.4965)",
      "Auth0 RS256 token verification with RBAC staff margin redaction and restock 403; dev mode uses an isolated mock-token signer gated by DEV_MODE_MOCK_AUTH (secure by default, demo only)",
    ],
    stack: ["FastAPI", "TimescaleDB", "PostgreSQL", "pgvector", "Docker", "Streamlit", "Auth0", "pytest"],
    metrics: [
      "30 tests (25 unit + 5 real-engine integration)",
      "10,000 concurrent checkout attempts",
      "0 oversells",
      "60 days of history",
    ],
    code: "https://github.com/princenzmw/DukaPulse",
    codeLabel: "View the code",
    demo: "https://dukapulse-kiosk.onrender.com/kiosk",
    demoNote: "Built for MLH Global Hack Week: Builders Week (November 2026). Live Kiosk POS: https://dukapulse-kiosk.onrender.com/kiosk · Analytics Dashboard: https://dukapulse.streamlit.app.",
    accent: "from-amber-500/20 via-primary/10 to-orange-400/15",
    accentSolid: "border-l-amber-500",
  },
  {
    id: "mzigo-chakula",
    name: "Mzigo Chakula: Kenya Food Price Inflation BI",
    tagline: "20 years of county-level staple prices modeled in a 4-table star schema",
    role: "Lead Analyst & BI Architect: ETL, star schema, DAX, PBIR",
    status: "live",
    problem:
      "National food inflation headlines hide wide county-level gaps. A household in Turkana faces a different price path than one in Nairobi or Mombasa. Planners need market-level visibility into which counties, staples, and seasons carry the heaviest food-price burden.",
    approach:
      "Built a Git-trackable Power BI project (PBIP/TMDL) and Python validation pipeline on the World Bank Real Time Food Prices (RTFP) dataset for Kenya: 55,692 market records across 233 physical markets, 27 counties, and 238 consecutive months (January 2007 to October 2026). Modeled a 4-table star schema (dim_markets, dim_date, dim_commodity, fact_prices) with single-direction 1:* relationships, 4 Power Query M scripts, 15 DAX measures, and a 4-page PBIR report with 46 visuals.",
    results: [
      "55,692 market price observations cleaned and modeled across 233 markets in 27 Kenyan counties (2007 to 2026)",
      "4-table star schema in TMDL with 15 validated DAX measures, including a market-month deduplicated food price index and EDATE(-12) year-over-year inflation",
      "4-page PBIR report (46 visuals) covering Executive Pulse, County & Commodity, Trends & Diagnostics, and Decisions & Action",
      "Automated Python pytest suite validating ETL transforms, DAX calculations, and report deliverables",
    ],
    stack: ["Power BI (PBIP/TMDL)", "DAX", "Power Query (M)", "Python", "pandas", "pytest"],
    metrics: ["55,692 rows", "233 markets · 27 counties", "15 DAX measures", "46 PBIR visuals"],
    code: "https://github.com/princenzmw/mzigo-chakula",
    accent: "from-violet-600/20 via-primary/10 to-fuchsia-400/15",
    accentSolid: "border-l-violet-600",
  },
];

export type PublicationLink = {
  label: string;
  href: string;
};

export type Publication = {
  id: string;
  title: string;
  venue: string;
  summary: string;
  links: PublicationLink[];
};

export const PUBLICATIONS: Publication[] = [
  {
    id: "nairobi-single-motherhood-sampling-bias",
    title:
      "Beyond Korogocho and Viwandani: Sampling Bias and External Validity in Research on Single Motherhood in Nairobi, Kenya",
    venue: "Working Paper (SocArXiv) | Under Review at Demographic Research | November 2026",
    summary:
      "Audited 10 empirical studies, 2008-2022 KDHS analyses, and 2019 KNBS census counts to test how far findings from Nairobi's two NUHDSS informal settlements (<2% of the city's 4.40M residents) generalize to single mothers across Nairobi's formal and mixed-income estates (~40% of the city). Documents structural drivers of informal-settlement sampling bias, including Kenya's unmapped 11-sub-county vs. 17-constituency boundary split, and proposes a cross-stratum analytical framework and multi-channel non-HDSS recruitment standards.",
    links: [
      {
        label: "Preprint (SocArXiv)",
        href: "https://doi.org/10.31235/osf.io/y96u8",
      },
      {
        label: "Replication Data & Python Code (Zenodo)",
        href: "https://doi.org/10.5281/zenodo.24564828",
      },
      {
        label: "Companion Study Protocol (Zenodo)",
        href: "https://doi.org/10.5281/zenodo.24393200",
      },
    ],
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
    "Now: third year of the BSc in Data Science & Analytics at United States International University-Africa (USIU-Africa), Nairobi, expected 2028. Open to data, ML, and backend engineering internships and part-time roles, remote or in Nairobi.",
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
    proof: { label: "DukaPulse POS · VoltStream & grid-ops-search", href: "https://github.com/princenzmw/DukaPulse" },
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
    period: "Sep 2024 to Sep 2028 (expected) · 3rd year",
    points: [
      "Mastercard Foundation Scholar: full academic scholarship awarded for leadership and academic excellence.",
      "Coursework across modeling, ML, data engineering, and optimization, applied directly in the projects above.",
    ],
  },
  {
    title: "ALX Software Engineering Programme",
    org: "Remote (concurrent)",
    period: "Jun 2023 to May 2024 · Foundations Phase (9 months)",
    points: ["Project repositories public on GitHub."],
  },
] as const;

export const CERTIFICATIONS = [
  {
    name: "Certificate of Competence in Software Development (Industrial-Based Training)",
    issuer: "Rwanda TVET Board & Ida Technology",
    href: "https://www.linkedin.com/in/princenzmw/details/certifications/",
  },
  {
    name: "Introduction to Back-End Development",
    issuer: "Meta (Coursera)",
    href: "https://www.coursera.org/account/accomplishments/verify/Q8VBEPM7UWZV",
  },
  {
    name: "JavaScript Algorithms and Data Structures",
    issuer: "freeCodeCamp",
    href: "https://freecodecamp.org/certification/princenzmw/javascript-algorithms-and-data-structures-v8",
  },
  {
    name: "Artificial Intelligence Fundamentals",
    issuer: "IBM SkillsBuild",
    href: "https://www.credly.com/badges/0dab507a-1b76-4d5f-9244-26d6da1ca4e3",
  },
] as const;

/** The honest timeline, fully sourced from the résumé. */
export const EXPERIENCE = [
  {
    title: "Apprentice · Andela Technical Leadership Program (ATLP)",
    org: "Kigali, Rwanda (remote, concurrent)",
    period: "Jan 2024 to Sep 2024",
    points: [
      "Shipped 5 merged PRs and completed 18 peer code reviews (9 backend, 9 frontend) in a 9-person Agile squad, delivering 5 Swagger-documented REST endpoints (password reset, admin role management) and 2 React admin pages.",
      "Authored 22 Jest unit tests for profile and permission controllers and designed normalized PostgreSQL tables for products, users, and orders.",
    ],
  },
  {
    title: "Software Development Trainee · Ida Technology (Industrial-Based Training)",
    org: "Kigali, Rwanda (on-site, concurrent)",
    period: "Dec 2023 to Jun 2024",
    points: [
      "Completed a 6-month Rwanda Ministry of Education and RTB certified program spanning 6 competence modules across Python frameworks, HTML/CSS/JavaScript, React, Next.js, Node.js, and DevOps.",
      "Built Django user auth and online flight booking modules (7 templates), 4 responsive Figma-to-HTML/CSS/Django interfaces, and Django REST Framework endpoints with JWT authentication.",
    ],
  },
  {
    title: "Participant · MLH Global Hack Week: Builders Week",
    org: "Major League Hacking, online",
    period: "Nov 2026",
    points: [
      "Built and shipped DukaPulse: full-stack retail POS with race-proof inventory checkouts, TimescaleDB hypertables, and backtested demand forecasting.",
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
  text: "Open to data, ML, and backend internships or part-time engineering roles (remote or Nairobi), plus select analytics dashboard engagements.",
} as const;

export const CONTACT = {
  heading: "Let's build something real",
  text: "Hiring for a data, ML, or backend internship or part-time engineering role? Email is fastest, and I reply within a day.",
} as const;

export const FOOTER = {
  referencesLine: "References & background checks welcome.",
  privacyLine:
    "Privacy: this site uses Plausible Analytics, which is cookie-free, stores no personal data, and does no cross-site tracking.",
  copyright: `© ${new Date().getFullYear()} Prince Nzamuwe. All rights reserved.`,
} as const;
