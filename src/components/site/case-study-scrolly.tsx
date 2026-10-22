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

  const isCredio = project.id === "credio";

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

          {/* Credio Technical Architecture HUD */}
          {isCredio ? (
            <div className="rounded-xl border bg-card p-4 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-2.5">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Pipeline Architecture
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  <Activity className="h-3 w-3 text-primary" aria-hidden="true" />
                  scikit-learn
                </span>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                {/* Stage 1 */}
                <div
                  className={`rounded-lg border p-2.5 transition-all ${
                    activeSection === "problem"
                      ? "border-primary/50 bg-primary/5 text-foreground shadow-xs"
                      : "border-border/60 bg-muted/20 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Database className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      1. Ingestion & Clean
                    </span>
                    <span className="text-[10px]">150K rows</span>
                  </div>
                  <p className="mt-1 text-[10px] leading-tight">
                    20% missing income & special status codes handled leak-free in ColumnTransformer
                  </p>
                </div>

                {/* Stage 2 */}
                <div
                  className={`rounded-lg border p-2.5 transition-all ${
                    activeSection === "approach"
                      ? "border-primary/50 bg-primary/5 text-foreground shadow-xs"
                      : "border-border/60 bg-muted/20 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      2. Model Benchmark
                    </span>
                    <span className="text-[10px]">0.823 → 0.869</span>
                  </div>
                  <p className="mt-1 text-[10px] leading-tight">
                    Logistic baseline vs. Gradient Boosting champion evaluated on held-out test set
                  </p>
                </div>

                {/* Stage 3 */}
                <div
                  className={`rounded-lg border p-2.5 transition-all ${
                    activeSection === "results"
                      ? "border-primary/50 bg-primary/5 text-foreground shadow-xs"
                      : "border-border/60 bg-muted/20 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Sliders className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      3. Risk Calibration
                    </span>
                    <span className="text-[10px]">1.1% → 39%</span>
                  </div>
                  <p className="mt-1 text-[10px] leading-tight">
                    Calibrated probability bands with dollar-threshold tuning; SMOTE rejected
                  </p>
                </div>

                {/* Stage 4 */}
                <div
                  className={`rounded-lg border p-2.5 transition-all ${
                    activeSection === "stack"
                      ? "border-primary/50 bg-primary/5 text-foreground shadow-xs"
                      : "border-border/60 bg-muted/20 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      4. Production & CI
                    </span>
                    <span className="text-[10px]">19 tests pass</span>
                  </div>
                  <p className="mt-1 text-[10px] leading-tight">
                    Live Streamlit application, synthetic pytest test suite, GitHub Actions CI
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Non-Credio Project Summary Card */
            <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Verified Deliverables
              </p>
              <ul className="space-y-1.5 text-xs text-muted-foreground font-mono">
                {project.metrics.map((m) => (
                  <li key={m} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden="true" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t">
                <Button asChild size="sm" variant="outline" className="w-full text-xs">
                  <a href={project.code} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                    Inspect Repository
                  </a>
                </Button>
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
              Problem: Real risk vs. leaderboard metrics
            </h2>
            <p className="text-base leading-relaxed text-foreground/90 sm:text-lg">
              {project.problem}
            </p>

            {isCredio && (
              <div className="rounded-xl border bg-card/60 p-4 sm:p-5 shadow-xs">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary" aria-hidden="true" />
                  The Real-World Constraint
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Credit risk is an asymmetric-cost domain: approving an applicant who defaults costs up to 5× more than the revenue gained from a successful repayment. Scoring well on balanced synthetic benchmarks does not protect capital; loan officers need calibrated default probabilities P(default | x) they can set hard underwriting thresholds against.
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

            {isCredio && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border bg-muted/20 p-4">
                  <p className="font-mono text-xs font-bold text-muted-foreground uppercase">Logistic Baseline</p>
                  <p className="mt-1 text-2xl font-bold font-mono text-primary">0.823</p>
                  <p className="text-xs text-muted-foreground">Validation ROC-AUC without resampling</p>
                </div>
                <div className="rounded-lg border bg-muted/20 p-4">
                  <p className="font-mono text-xs font-bold text-muted-foreground uppercase">Gradient Boosting</p>
                  <p className="mt-1 text-2xl font-bold font-mono text-primary">0.869</p>
                  <p className="text-xs text-muted-foreground">Held-out test ROC-AUC champion</p>
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

            {isCredio && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-2">
                  <Sliders className="h-4 w-4" aria-hidden="true" />
                  Engineering Decision: Why SMOTE was Rejected
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  During experimentation, synthetic minority oversampling (SMOTE) and naive class weighting artificially inflated training default rates from 6.7% to 50%. While this shifted raw classification boundaries, it broke probability calibration, making model scores uninterpretable as actual default odds. The final architecture relies on raw class priors combined with post-hoc probability calibration and cost-sensitive threshold tuning.
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
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Technology Stack
            </h2>

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
