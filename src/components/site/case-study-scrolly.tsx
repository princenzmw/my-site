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
  icon: LucideIcon;
}

interface ProjectArchitecture {
  frameworkBadge: string;
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
    stages: {
      problem: {
        title: "1. Ingestion & Clean",
        badge: "150K rows",
        detail: "20% missing income & special status codes handled leak-free in ColumnTransformer",
        icon: Database,
      },
      approach: {
        title: "2. Model Benchmark",
        badge: "0.823 → 0.869",
        detail: "Logistic baseline vs. Gradient Boosting champion evaluated on held-out test set",
        icon: Cpu,
      },
      results: {
        title: "3. Risk Calibration",
        badge: "1.1% → 39%",
        detail: "Calibrated probability bands with dollar-threshold tuning; SMOTE rejected",
        icon: Sliders,
      },
      stack: {
        title: "4. Production & CI",
        badge: "19 tests pass",
        detail: "Live Streamlit application, synthetic pytest test suite, GitHub Actions CI",
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
    stages: {
      problem: {
        title: "1. Workbook Pipeline",
        badge: "290 MB → 8 MB",
        detail: "Streaming Python script compacts unwieldy government workbook into lean relational CSV",
        icon: Database,
      },
      approach: {
        title: "2. Survey Calibration",
        badge: "19,750 adults",
        detail: "Complex multi-stage stratified survey weights preserved across 63 clean demographic columns",
        icon: Cpu,
      },
      results: {
        title: "3. Topline Reconcile",
        badge: "84.8% matched",
        detail: "Weighted aggregates exactly reproduce official KNBS / CBK published financial inclusion benchmarks",
        icon: Sliders,
      },
      stack: {
        title: "4. County Star Schema",
        badge: "47 counties",
        detail: "Five-page Power BI dashboard with optimized DAX measures exposing 45-point regional gaps",
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
    stages: {
      problem: {
        title: "1. Multi-Tenant Schema",
        badge: "PostgreSQL",
        detail: "Strict relational schema separating multi-tenant shop inventories, user roles, and ledger receipts",
        icon: Database,
      },
      approach: {
        title: "2. Concurrency Lock",
        badge: "ACID Safe",
        detail: "Row-level transactional locking on inventory decrements guarantees zero overselling under race conditions",
        icon: Cpu,
      },
      results: {
        title: "3. Demand Forecasting",
        badge: "4-Week Window",
        detail: "Automated replenishment recommendations benchmarked against seasonal-naive moving baseline",
        icon: Sliders,
      },
      stack: {
        title: "4. Full-Stack CI",
        badge: "Playwright + Pytest",
        detail: "Headless browser integration workflows and backend unit tests automated on GitHub Actions",
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
    stages: {
      problem: {
        title: "1. CLI & File Storage",
        badge: "Phase 1: cmd",
        detail: "Custom REPL interpreter with polymorphic JSON serialization for managing model lifecycles",
        icon: Database,
      },
      approach: {
        title: "2. Relational ORM",
        badge: "Phase 2: SQLAlchemy",
        detail: "Stepwise migration from flat-file storage to MySQL with declarative entity relationships",
        icon: Cpu,
      },
      results: {
        title: "3. RESTful Services",
        badge: "Phase 3: Flask",
        detail: "Modular API blueprints with CRUD endpoints, status code contracts, and CORS headers",
        icon: Sliders,
      },
      stack: {
        title: "4. Containerized Web",
        badge: "Phase 4: Docker",
        detail: "Jinja2 dynamic frontend templates and Nginx reverse proxy packaged for production deployments",
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

  // Track active section via IntersectionObserver
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
        rootMargin: "-20% 0px -60% 0px",
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

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="grid gap-12 lg:grid-cols-[340px_1fr] lg:gap-16 items-start">
        {/* ==================== LEFT COLUMN: STICKY HUD ==================== */}
        <aside className="hidden lg:block lg:sticky lg:top-24 space-y-6">
          {/* Chapter Stepper */}
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Case Study Navigation
            </p>
            <nav className="mt-3 space-y-1" aria-label="Case study sections">
              {SECTIONS.map((s) => {
                const isActive = activeSection === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => scrollTo(s.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-[background-color,color] ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-[10px] opacity-70">{s.number}</span>
                      <span>{s.label}</span>
                    </span>
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Technical Architecture HUD */}
          {arch && (
            <div className="rounded-xl border bg-card p-4 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-2.5">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Pipeline Architecture
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  <Activity className="h-3 w-3 text-primary" aria-hidden="true" />
                  {arch.frameworkBadge}
                </span>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                {SECTIONS.map((s) => {
                  const stage = arch.stages[s.id];
                  if (!stage) return null;
                  const Icon = stage.icon;
                  const isCurrent = activeSection === s.id;
                  return (
                    <div
                      key={s.id}
                      className={`rounded-lg border p-2.5 transition-all ${
                        isCurrent
                          ? "border-primary/50 bg-primary/5 text-foreground shadow-xs"
                          : "border-border/60 bg-muted/20 text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-semibold">
                        <span className="flex items-center gap-1.5">
                          <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                          {stage.title}
                        </span>
                        <span className="text-[10px]">{stage.badge}</span>
                      </div>
                      <p className="mt-1 text-[10px] leading-tight">{stage.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Independent Verification Trust Badge */}
          <div className="rounded-xl border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              Verified Repository
            </div>
            <p className="mt-1 text-[11px] leading-relaxed">
              Every metric and architecture claim is reproducible from public code and CI artifacts.
            </p>
          </div>
        </aside>

        {/* ==================== RIGHT COLUMN: SCROLLYTELLING NARRATIVE ==================== */}
        <div className="space-y-16">
          {/* 01: Problem */}
          <div id="problem" className="scroll-mt-24 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-md bg-muted px-2.5 py-1 font-mono text-xs font-semibold text-primary">
              <span>01</span>
              <span>/</span>
              <span>THE CHALLENGE</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Problem: Real constraints vs. synthetic baselines
            </h2>
            <p className="text-base leading-relaxed text-foreground/90 sm:text-lg">
              {project.problem}
            </p>

            {arch?.realWorldConstraint && (
              <div className="rounded-xl border bg-card/60 p-4 sm:p-5 shadow-xs">
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
          <div id="approach" className="scroll-mt-24 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-md bg-muted px-2.5 py-1 font-mono text-xs font-semibold text-primary">
              <span>02</span>
              <span>/</span>
              <span>ENGINEERING METHODOLOGY</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Approach: Leak-free pipelines and model benchmarks
            </h2>
            <p className="text-base leading-relaxed text-foreground/90 sm:text-lg">
              {project.approach}
            </p>

            {arch?.benchmarkComparison && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border bg-muted/20 p-4">
                  <p className="font-mono text-xs font-bold text-muted-foreground uppercase">
                    {arch.benchmarkComparison.labelA}
                  </p>
                  <p className="mt-1 text-2xl font-bold font-mono text-primary">
                    {arch.benchmarkComparison.valueA}
                  </p>
                  <p className="text-xs text-muted-foreground">{arch.benchmarkComparison.subA}</p>
                </div>
                <div className="rounded-lg border bg-muted/20 p-4">
                  <p className="font-mono text-xs font-bold text-muted-foreground uppercase">
                    {arch.benchmarkComparison.labelB}
                  </p>
                  <p className="mt-1 text-2xl font-bold font-mono text-primary">
                    {arch.benchmarkComparison.valueB}
                  </p>
                  <p className="text-xs text-muted-foreground">{arch.benchmarkComparison.subB}</p>
                </div>
              </div>
            )}
          </div>

          {/* 03: Results */}
          <div id="results" className="scroll-mt-24 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-md bg-muted px-2.5 py-1 font-mono text-xs font-semibold text-primary">
              <span>03</span>
              <span>/</span>
              <span>MEASURABLE OUTCOMES</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {inDev ? "Built so far" : "Results: Calibrated probabilities with receipts"}
            </h2>

            <ul className="space-y-3" aria-label={`Key results for ${project.name}`}>
              {project.results.map((r) => (
                <li
                  key={r.slice(0, 32)}
                  className="flex items-start gap-3 rounded-lg border bg-card/60 p-3.5 sm:p-4 text-base leading-relaxed"
                >
                  <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>

            {arch?.engineeringDecision && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5">
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
          <div id="stack" className="scroll-mt-24 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-md bg-muted px-2.5 py-1 font-mono text-xs font-semibold text-primary">
              <span>04</span>
              <span>/</span>
              <span>SYSTEM ARCHITECTURE & STACK</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Technology Stack</h2>

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
