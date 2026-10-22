"use client";

import * as React from "react";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  ExternalLink,
  Github,
  Layers,
  ShieldCheck,
  Terminal,
  Activity,
  Cpu,
  Database,
  Sliders,
  CheckCircle2,
  GitBranch,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/lib/portfolio";

const SECTIONS = [
  { id: "problem", number: "01", label: "Problem" },
  { id: "approach", number: "02", label: "Approach" },
  { id: "results", number: "03", label: "Results" },
  { id: "stack", number: "04", label: "Stack & CI" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

interface PipelineStage {
  title: string;
  badge: string;
  detail: string;
  telemetry: string;
  icon: LucideIcon;
}

interface ProjectArchitecture {
  frameworkBadge: string;
  systemTitle: string;
  stages: Record<SectionId, PipelineStage>;
  realWorldConstraint?: {
    title: string;
    description: string;
  };
  benchmarkComparison?: {
    labelA: string;
    valueA: string;
    subA: string;
    labelB: string;
    valueB: string;
    subB: string;
  };
  engineeringDecision?: {
    title: string;
    description: string;
  };
}

const ARCHITECTURES: Record<string, ProjectArchitecture> = {
  credio: {
    frameworkBadge: "scikit-learn",
    systemTitle: "Credit Risk Scoring Pipeline",
    stages: {
      problem: {
        title: "1. Ingestion & Clean",
        badge: "150K rows",
        detail: "20% missing income & special status codes handled leak-free in ColumnTransformer",
        telemetry: "Feature Matrix: 150,000 × 12 · 0 Data Leakage",
        icon: Database,
      },
      approach: {
        title: "2. Model Benchmark",
        badge: "0.823 → 0.869",
        detail: "Logistic baseline vs. Gradient Boosting champion evaluated on held-out test set",
        telemetry: "Stratified 80/20 Test Set · Champion ROC-AUC: 0.869",
        icon: Cpu,
      },
      results: {
        title: "3. Risk Calibration",
        badge: "1.1% → 39%",
        detail: "Calibrated probability bands with dollar-threshold tuning; SMOTE rejected",
        telemetry: "Cost Ratio: 5:1 · False Negatives Penalized",
        icon: Sliders,
      },
      stack: {
        title: "4. Production & CI",
        badge: "19 tests pass",
        detail: "Live Streamlit application, synthetic pytest test suite, GitHub Actions CI",
        telemetry: "CI: 19 Tests Passing · Streamlit Docker Container",
        icon: Layers,
      },
    },
    realWorldConstraint: {
      title: "The Real-World Constraint",
      description:
        "Credit risk is an asymmetric-cost domain: approving an applicant who defaults costs up to 5x more than the revenue gained from a successful repayment. Scoring well on balanced synthetic benchmarks does not protect capital; loan officers need calibrated default probabilities P(default | x) they can set hard underwriting thresholds against.",
    },
    benchmarkComparison: {
      labelA: "Logistic Baseline",
      valueA: "0.823",
      subA: "Validation ROC-AUC without resampling",
      labelB: "Gradient Boosting",
      valueB: "0.869",
      subB: "Held-out test ROC-AUC champion",
    },
    engineeringDecision: {
      title: "Engineering Decision: Why SMOTE was Rejected",
      description:
        "During experimentation, synthetic minority oversampling (SMOTE) and naive class weighting artificially inflated training default rates from 6.7% to 50%. While this shifted raw classification boundaries, it broke probability calibration, making model scores uninterpretable as actual default odds. The final architecture relies on raw class priors combined with post-hoc probability calibration and cost-sensitive threshold tuning.",
    },
  },
  finaccess: {
    frameworkBadge: "Power BI + pandas",
    systemTitle: "Financial Inclusion Analytics",
    stages: {
      problem: {
        title: "1. Workbook Pipeline",
        badge: "290 MB → 8 MB",
        detail: "Streaming Python script compacts unwieldy government workbook into lean relational CSV",
        telemetry: "Ingestion: 290 MB multi-sheet → 8 MB streaming CSV",
        icon: Database,
      },
      approach: {
        title: "2. Survey Calibration",
        badge: "19,750 adults",
        detail: "Complex multi-stage stratified survey weights preserved across 63 clean demographic columns",
        telemetry: "Strata: 19,750 adults · 47 counties · expansion weights",
        icon: Cpu,
      },
      results: {
        title: "3. Topline Reconcile",
        badge: "84.8% matched",
        detail: "Weighted aggregates exactly reproduce official KNBS / CBK published financial inclusion benchmarks",
        telemetry: "Parity: 84.8% formal inclusion · 0.0% variance",
        icon: Sliders,
      },
      stack: {
        title: "4. County Star Schema",
        badge: "47 counties",
        detail: "Five-page Power BI dashboard with optimized DAX measures exposing 45-point regional gaps",
        telemetry: "DAX Engine: Star schema · 5-page analytical report",
        icon: Layers,
      },
    },
    realWorldConstraint: {
      title: "The Survey Weight Constraint",
      description:
        "National survey datasets cannot be aggregated with naive SQL averages. Each respondent carries an inverse probability sampling weight reflecting household cluster sampling. Ignoring or mishandling these weights distorts rural representation and invalidates county-level policy comparisons.",
    },
    benchmarkComparison: {
      labelA: "Raw Workbook",
      valueA: "290 MB",
      subA: "Multi-sheet uncompressed spreadsheet",
      labelB: "Streaming CSV",
      valueB: "8 MB",
      subB: "Clean 19,750 × 63 schema ready for BI",
    },
    engineeringDecision: {
      title: "Engineering Decision: Reconciling Published Toplines",
      description:
        "Before building visual reports, every aggregate measure was audited against the published 2024 FinAccess report. The model matched the national 84.8% formal inclusion and 9.9% exclusion figures to the decimal point, verifying that sampling strata expansion factors remained intact throughout the transformation pipeline.",
    },
  },
  dukapulse: {
    frameworkBadge: "FastAPI + Postgres",
    systemTitle: "Retail Inventory & Forecasting",
    stages: {
      problem: {
        title: "1. Multi-Tenant Schema",
        badge: "PostgreSQL",
        detail: "Strict relational schema separating multi-tenant shop inventories, user roles, and ledger receipts",
        telemetry: "Schema: PostgreSQL multi-tenant relational isolation",
        icon: Database,
      },
      approach: {
        title: "2. Concurrency Lock",
        badge: "ACID Safe",
        detail: "Row-level transactional locking on inventory decrements guarantees zero overselling under race conditions",
        telemetry: "Concurrency: SELECT FOR UPDATE pessimistic row locks",
        icon: Cpu,
      },
      results: {
        title: "3. Demand Forecasting",
        badge: "4-Week Window",
        detail: "Automated replenishment recommendations benchmarked against seasonal-naive moving baseline",
        telemetry: "Backtest: 4-week window vs seasonal-naive benchmark",
        icon: Sliders,
      },
      stack: {
        title: "4. Full-Stack CI",
        badge: "Playwright + Pytest",
        detail: "Headless browser integration workflows and backend unit tests automated on GitHub Actions",
        telemetry: "Test Matrix: Playwright headless E2E + pytest unit",
        icon: Layers,
      },
    },
    realWorldConstraint: {
      title: "The Over-Selling Hazard",
      description:
        "In small retail shops, physical stock is finite and margins are razor-thin. Concurrency race conditions where two clerks sell the final carton simultaneously create customer friction and phantom inventory. The backend must enforce transactional row locks at the database layer, not merely in application memory.",
    },
    benchmarkComparison: {
      labelA: "App-Memory Check",
      valueA: "Race Prone",
      subA: "Susceptible to concurrent debit hazards",
      labelB: "Pessimistic Row Lock",
      valueB: "ACID Proof",
      subB: "Guaranteed atomic stock balance enforcement",
    },
    engineeringDecision: {
      title: "Engineering Decision: Honest Forecasting Baselines",
      description:
        "Rather than applying complex machine learning models that overfit on sparse small-shop transactions, DukaPulse benchmarks demand models directly against a seasonal-naive moving baseline. A model only earns its compute budget if it proves lower mean absolute percentage error than repeating last cycle's demand.",
    },
  },
  airbnb: {
    frameworkBadge: "Python + MySQL",
    systemTitle: "System Architecture Evolution",
    stages: {
      problem: {
        title: "1. CLI & File Storage",
        badge: "Phase 1: cmd",
        detail: "Custom REPL interpreter with polymorphic JSON serialization for managing model lifecycles",
        telemetry: "Serialization: Polymorphic BaseModel with JSON engine",
        icon: Database,
      },
      approach: {
        title: "2. Relational ORM",
        badge: "Phase 2: SQLAlchemy",
        detail: "Stepwise migration from flat-file storage to MySQL with declarative entity relationships",
        telemetry: "Persistence: SQLAlchemy declarative ORM + MySQL 8.0",
        icon: Cpu,
      },
      results: {
        title: "3. RESTful Services",
        badge: "Phase 3: Flask",
        detail: "Modular API blueprints with CRUD endpoints, status code contracts, and CORS headers",
        telemetry: "Interface: Flask RESTful blueprints + CORS headers",
        icon: Sliders,
      },
      stack: {
        title: "4. Containerized Web",
        badge: "Phase 4: Docker",
        detail: "Jinja2 dynamic frontend templates and Nginx reverse proxy packaged for production deployments",
        telemetry: "Deployment: Docker multi-container + Nginx proxy",
        icon: Layers,
      },
    },
    realWorldConstraint: {
      title: "The Architectural Evolution",
      description:
        "Software systems rarely start at microservices or distributed architectures. True engineering capability is demonstrated by evolving an application from a pure terminal utility into a persistent database-backed service and finally a containerized public web product without breaking core domain abstractions.",
    },
    benchmarkComparison: {
      labelA: "JSON Flat-File",
      valueA: "v1.0 CLI",
      subA: "File-based serialization engine",
      labelB: "SQLAlchemy ORM",
      valueB: "v2.0-v4.0",
      subB: "Declarative relational database persistence",
    },
    engineeringDecision: {
      title: "Engineering Decision: BaseModel Polymorphism",
      description:
        "By isolating ID generation, timestamp tracking, and dictionary serialization in an abstract BaseModel class, every subsequent entity (User, Place, City, Review) inherited consistent storage semantics regardless of whether the active persistence engine was the filesystem or an ACID relational database.",
    },
  },
};

interface CaseStudyScrollyProps {
  project: Project;
  inDev: boolean;
  nextProject: { id: string; name: string };
}

export function CaseStudyScrolly({ project, inDev, nextProject }: CaseStudyScrollyProps) {
  const [activeSection, setActiveSection] = React.useState<SectionId>("problem");

  // Track active section via IntersectionObserver with strict rootMargin
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId);
          }
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: 0,
      }
    );

    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const arch = ARCHITECTURES[project.id];
  const activeIndex = Math.max(0, SECTIONS.findIndex((s) => s.id === activeSection));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* ==================== MOBILE STEPPER STRIP (<1024px) ==================== */}
      <nav
        aria-label="Case study chapters"
        className="sticky top-16 z-30 -mx-4 sm:-mx-6 mb-8 border-b bg-background/95 backdrop-blur px-4 sm:px-6 py-2.5 lg:hidden"
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          {SECTIONS.map((s, i) => {
            const isActive = activeSection === s.id;
            const isPassed = activeIndex > i;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollTo(s.id)}
                aria-current={isActive ? "step" : undefined}
                className={`min-h-[44px] flex-1 flex items-center justify-center gap-1.5 rounded-lg px-2 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : isPassed
                    ? "bg-muted/80 text-foreground"
                    : "bg-muted/30 text-muted-foreground hover:bg-muted/60"
                }`}
              >
                <span className="font-mono text-[10px] opacity-75">{s.number}</span>
                <span className="truncate">{s.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ==================== DESKTOP BLUEPRINT GRID (>=1024px) ==================== */}
      <div className="grid gap-12 lg:grid-cols-[380px_1fr] xl:grid-cols-[400px_1fr] lg:gap-14 items-start">
        {/* ==================== LEFT COLUMN: 100DVH PINNED BLUEPRINT ==================== */}
        <aside className="hidden lg:block lg:sticky lg:top-20 lg:h-[calc(100dvh-6rem)] scrolly-blueprint-stage">
          <div className="flex h-full flex-col justify-between overflow-y-auto pr-2 space-y-4">
            {/* Header: System Architecture Blueprint */}
            <div className="rounded-xl border bg-card/90 p-4 shadow-xs backdrop-blur-sm">
              <div className="flex items-center justify-between border-b pb-2.5">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                    Architectural Blueprint
                  </p>
                  <h2 className="mt-0.5 text-sm font-bold text-foreground">
                    {arch ? arch.systemTitle : `${project.name} Architecture`}
                  </h2>
                </div>
                {arch && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground border">
                    <Activity className="h-3 w-3 text-primary" aria-hidden="true" />
                    {arch.frameworkBadge}
                  </span>
                )}
              </div>

              {/* The Pipeline Schematic Canvas */}
              {arch && (
                <div className="relative mt-3.5 pt-1">
                  {/* SVG Bezier Connection Bus */}
                  <svg
                    className="pointer-events-none absolute left-3 top-3 h-[calc(100%-24px)] w-8"
                    viewBox="0 0 32 300"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id="blueprint-line-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="oklch(0.72 0.15 210)" stopOpacity="1" />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.9" />
                      </linearGradient>
                      <filter id="blueprint-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="var(--primary)" floodOpacity="0.5" />
                      </filter>
                    </defs>

                    {/* Inactive bezier background tracks */}
                    <path
                      d="M 12 36 C 28 62, 28 88, 12 114"
                      fill="none"
                      stroke="var(--border)"
                      strokeWidth="2"
                      strokeDasharray="3 3"
                      opacity="0.5"
                    />
                    <path
                      d="M 12 114 C -4 140, -4 166, 12 192"
                      fill="none"
                      stroke="var(--border)"
                      strokeWidth="2"
                      strokeDasharray="3 3"
                      opacity="0.5"
                    />
                    <path
                      d="M 12 192 C 28 218, 28 244, 12 270"
                      fill="none"
                      stroke="var(--border)"
                      strokeWidth="2"
                      strokeDasharray="3 3"
                      opacity="0.5"
                    />

                    {/* Active illuminated bezier segments */}
                    {activeIndex >= 1 && (
                      <path
                        d="M 12 36 C 28 62, 28 88, 12 114"
                        fill="none"
                        stroke="url(#blueprint-line-grad)"
                        strokeWidth="2.5"
                        filter="url(#blueprint-glow)"
                        className="blueprint-pulse"
                        strokeDasharray="16 4"
                      />
                    )}
                    {activeIndex >= 2 && (
                      <path
                        d="M 12 114 C -4 140, -4 166, 12 192"
                        fill="none"
                        stroke="url(#blueprint-line-grad)"
                        strokeWidth="2.5"
                        filter="url(#blueprint-glow)"
                        className="blueprint-pulse"
                        strokeDasharray="16 4"
                      />
                    )}
                    {activeIndex >= 3 && (
                      <path
                        d="M 12 192 C 28 218, 28 244, 12 270"
                        fill="none"
                        stroke="url(#blueprint-line-grad)"
                        strokeWidth="2.5"
                        filter="url(#blueprint-glow)"
                        className="blueprint-pulse"
                        strokeDasharray="16 4"
                      />
                    )}

                    {/* Circuit Node Terminals */}
                    {[36, 114, 192, 270].map((cy, i) => {
                      const isNodeActive = activeIndex === i;
                      const isPassed = activeIndex > i;
                      return (
                        <g key={i}>
                          <circle
                            cx="12"
                            cy={cy}
                            r={isNodeActive ? "5.5" : "4"}
                            fill={isNodeActive || isPassed ? "var(--primary)" : "var(--muted)"}
                            stroke={isNodeActive ? "var(--foreground)" : "var(--border)"}
                            strokeWidth="2"
                            filter={isNodeActive ? "url(#blueprint-glow)" : undefined}
                          />
                          {isNodeActive && (
                            <circle
                              cx="12"
                              cy={cy}
                              r="8"
                              fill="none"
                              stroke="var(--primary)"
                              strokeWidth="1.5"
                              className="blueprint-signal-dot"
                            />
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* Pipeline Stage Cards Stacked Alongside SVG Bus */}
                  <div className="ml-9 space-y-2.5 font-mono text-xs">
                    {SECTIONS.map((s, i) => {
                      const stage = arch.stages[s.id];
                      if (!stage) return null;
                      const Icon = stage.icon;
                      const isCurrent = activeSection === s.id;
                      const isPassed = activeIndex > i;

                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => scrollTo(s.id)}
                          aria-current={isCurrent ? "step" : undefined}
                          className={`w-full text-left rounded-lg border p-2.5 transition-all ${
                            isCurrent
                              ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary/40 shadow-xs"
                              : isPassed
                              ? "border-border/80 bg-muted/30 text-foreground/90 hover:bg-muted/50"
                              : "border-border/40 bg-muted/10 text-muted-foreground opacity-60 hover:opacity-90"
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="flex items-center gap-1.5">
                              {isPassed ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                              ) : (
                                <Icon className={`h-3.5 w-3.5 ${isCurrent ? "text-primary" : "text-muted-foreground"}`} aria-hidden="true" />
                              )}
                              <span>{stage.title}</span>
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${isCurrent ? "bg-primary text-primary-foreground font-bold" : "bg-muted text-muted-foreground"}`}>
                              {stage.badge}
                            </span>
                          </div>
                          <p className="mt-1 text-[10px] leading-tight text-muted-foreground font-sans line-clamp-2">
                            {stage.detail}
                          </p>
                          {isCurrent && (
                            <div className="mt-1.5 pt-1.5 border-t border-primary/20 flex items-center justify-between text-[9px] text-primary">
                              <span className="truncate">{stage.telemetry}</span>
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary animate-pulse" aria-hidden="true" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Independent Verification Trust Badge */}
            <div className="rounded-xl border bg-muted/20 p-3.5 text-xs text-muted-foreground space-y-2">
              <div className="flex items-center gap-2 font-medium text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>Independent Verification</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Every metric and architecture claim in this study is backed by public source code, automated test suites, and CI workflows.
              </p>
              <div className="pt-1 flex items-center gap-2">
                <Button asChild variant="outline" size="sm" className="h-7 text-[11px] w-full">
                  <a href={project.code} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-1 h-3 w-3" aria-hidden="true" />
                    Inspect GitHub Repo
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* ==================== RIGHT COLUMN: SCROLLYTELLING NARRATIVE ==================== */}
        <div className="space-y-16">
          {/* 01: Problem */}
          <div id="problem" className="scroll-mt-24 space-y-5 rounded-2xl border bg-card/40 p-6 sm:p-8 backdrop-blur shadow-xs">
            <div className="inline-flex items-center gap-2 rounded-md bg-muted px-2.5 py-1 font-mono text-xs font-semibold text-primary">
              <span>01</span>
              <span>/</span>
              <span>THE CHALLENGE</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Problem: Real constraints vs. synthetic baselines
            </h2>
            <p className="text-base leading-relaxed text-foreground/90 sm:text-lg">
              {project.problem}
            </p>

            {arch?.realWorldConstraint && (
              <div className="rounded-xl border bg-card/80 p-4 sm:p-5 shadow-xs">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary" aria-hidden="true" />
                  {arch.realWorldConstraint.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {arch.realWorldConstraint.description}
                </p>
              </div>
            )}
          </div>

          {/* 02: Approach */}
          <div id="approach" className="scroll-mt-24 space-y-5 rounded-2xl border bg-card/40 p-6 sm:p-8 backdrop-blur shadow-xs">
            <div className="inline-flex items-center gap-2 rounded-md bg-muted px-2.5 py-1 font-mono text-xs font-semibold text-primary">
              <span>02</span>
              <span>/</span>
              <span>ENGINEERING METHODOLOGY</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Approach: Leak-free pipelines and model benchmarks
            </h2>
            <p className="text-base leading-relaxed text-foreground/90 sm:text-lg">
              {project.approach}
            </p>

            {arch?.benchmarkComparison && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="font-mono text-xs font-bold text-muted-foreground uppercase">
                    {arch.benchmarkComparison.labelA}
                  </p>
                  <p className="mt-1 text-2xl font-bold font-mono text-primary">
                    {arch.benchmarkComparison.valueA}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{arch.benchmarkComparison.subA}</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="font-mono text-xs font-bold text-muted-foreground uppercase">
                    {arch.benchmarkComparison.labelB}
                  </p>
                  <p className="mt-1 text-2xl font-bold font-mono text-primary">
                    {arch.benchmarkComparison.valueB}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{arch.benchmarkComparison.subB}</p>
                </div>
              </div>
            )}
          </div>

          {/* 03: Results */}
          <div id="results" className="scroll-mt-24 space-y-5 rounded-2xl border bg-card/40 p-6 sm:p-8 backdrop-blur shadow-xs">
            <div className="inline-flex items-center gap-2 rounded-md bg-muted px-2.5 py-1 font-mono text-xs font-semibold text-primary">
              <span>03</span>
              <span>/</span>
              <span>MEASURABLE OUTCOMES</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {inDev ? "Built so far" : "Results: Calibrated probabilities with receipts"}
            </h2>

            <ul className="space-y-3" aria-label={`Key results for ${project.name}`}>
              {project.results.map((r) => (
                <li
                  key={r.slice(0, 32)}
                  className="flex items-start gap-3 rounded-lg border bg-card/80 p-3.5 sm:p-4 text-base leading-relaxed"
                >
                  <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>

            {arch?.engineeringDecision && (
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-2">
                  <Sliders className="h-4 w-4" aria-hidden="true" />
                  {arch.engineeringDecision.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {arch.engineeringDecision.description}
                </p>
              </div>
            )}

            {project.demoNote && (
              <p className="rounded-md border border-dashed border-border bg-muted/50 px-3.5 py-2.5 text-sm text-muted-foreground">
                {project.demoNote}
              </p>
            )}
          </div>

          {/* 04: Stack & Verification */}
          <div id="stack" className="scroll-mt-24 space-y-5 rounded-2xl border bg-card/40 p-6 sm:p-8 backdrop-blur shadow-xs">
            <div className="inline-flex items-center gap-2 rounded-md bg-muted px-2.5 py-1 font-mono text-xs font-semibold text-primary">
              <span>04</span>
              <span>/</span>
              <span>SYSTEM ARCHITECTURE & STACK</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Technology Stack</h2>

            <ul className="flex flex-wrap gap-2" aria-label={`Technologies used in ${project.name}`}>
              {project.stack.map((s) => (
                <li key={s}>
                  <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                    {s}
                  </Badge>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-xl border bg-card p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">Verify the implementation</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Inspect the source code, tests, and CI configuration on GitHub.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <Button asChild variant="outline" size="sm">
                    <a href={project.code} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-1.5 h-4 w-4" aria-hidden="true" />
                      View Repository
                    </a>
                  </Button>
                  {project.demo && (
                    <Button asChild size="sm">
                      <a href={project.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1.5 h-4 w-4" aria-hidden="true" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Conversion Footer Banner */}
          <div className="flex flex-col gap-3 rounded-xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between shadow-xs">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Working on something similar, or want this build verified? Ask me anything.
            </p>
            <Button asChild className="shine min-h-11 shrink-0">
              <Link href="/contact" data-pla={`detail-contact-${project.id}`}>
                Get in touch
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          {/* Next Case Study Navigation */}
          <div className="flex items-center justify-between border-t pt-6 text-sm">
            <span className="text-muted-foreground">Next case study</span>
            <Link
              href={`/projects/${nextProject.id}`}
              data-pla={`detail-next-${project.id}`}
              className="inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline"
            >
              {nextProject.name}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
