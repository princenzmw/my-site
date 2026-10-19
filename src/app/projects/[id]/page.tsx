import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  Github,
  Hammer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/site/page-shell";
import { PROJECTS, SITE } from "@/lib/portfolio";

/** Static export: the four case studies are generated at build time, nothing else. */
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ id: p.id }));
}
export const dynamicParams = false;

type Params = { params: Promise<{ id: string }> };

/** Page-level descriptions stay inside the 70–160 character budget. */
const DESCRIPTIONS: Record<string, string> = {
  credio:
    "Credio: a credit-risk scorecard on 150,000 real borrower records. ROC-AUC 0.869, calibrated risk bands, a Streamlit app, 19 unit tests, and CI.",
  finaccess:
    "FinAccess Kenya: a 290 MB government survey made explorable at county level in Power BI, survey weights handled, published topline matched.",
  dukapulse:
    "DukaPulse: stock and sales app for small shops. FastAPI, PostgreSQL, React, JWT roles, oversell-proof sales, backtested forecasts. In development.",
  airbnb:
    "AirBnB Clone v4: four public iterations from CLI console to SQLAlchemy ORM to Flask REST API to web frontend. Python, MySQL, Docker.",
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const p = PROJECTS.find((x) => x.id === id);
  if (!p) return {};
  return {
    title: p.name,
    description: DESCRIPTIONS[p.id] ?? p.tagline,
    alternates: { canonical: `/projects/${p.id}` },
    openGraph: {
      title: `${p.name} | ${SITE.name}`,
      description: p.tagline,
      url: `/projects/${p.id}`,
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { id } = await params;
  const index = PROJECTS.findIndex((x) => x.id === id);
  if (index === -1) notFound();
  const project = PROJECTS[index];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const inDev = project.status === "in-development";

  return (
    <PageShell>
      {/* ============================ HEADER PANEL ============================ */}
      <section className="relative overflow-hidden border-b" aria-labelledby="project-heading">
        <div aria-hidden className={`bg-gradient-to-br ${project.accent} absolute inset-0`} />
        <div className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-16">
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All projects
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <p className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {project.role}
            </p>
            {inDev ? (
              <Badge variant="outline" className="border-amber-600/40 bg-amber-500/10 text-amber-700 dark:text-amber-400">
                <Hammer className="mr-1 h-3 w-3" aria-hidden />
                In development
              </Badge>
            ) : (
              <Badge variant="outline" className="border-emerald-600/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                Live
              </Badge>
            )}
          </div>

          <h1 id="project-heading" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {project.name}
          </h1>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">{project.tagline}</p>

          <ul className="mt-6 flex flex-wrap gap-1.5" aria-label={`Key metrics for ${project.name}`}>
            {project.metrics.map((m) => (
              <li
                key={m}
                className="rounded-md border bg-background/60 px-2.5 py-1 font-mono text-xs font-medium text-foreground/80"
              >
                {m}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <Button asChild variant={inDev ? "outline" : "default"} className="min-h-11">
              <a href={project.code} target="_blank" rel="noopener noreferrer" data-pla={`detail-code-${project.id}`}>
                <Github className="h-4 w-4" aria-hidden />
                {project.codeLabel ?? "View the code"}
              </a>
            </Button>
            {project.demo && (
              <Button asChild variant="outline" className="min-h-11">
                <a href={project.demo} target="_blank" rel="noopener noreferrer" data-pla={`detail-demo-${project.id}`}>
                  <ExternalLink className="h-4 w-4" aria-hidden />
                  Live demo
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* ============================== WRITE-UP ============================== */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-10 px-4 sm:px-6">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Problem</h2>
            <p className="mt-2 text-base leading-relaxed">{project.problem}</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Approach</h2>
            <p className="mt-2 text-base leading-relaxed">{project.approach}</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {inDev ? "Built so far" : "Results"}
            </h2>
            <ul className="mt-3 space-y-2.5">
              {project.results.map((r) => (
                <li key={r.slice(0, 32)} className="flex items-start gap-2.5 text-base leading-relaxed">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {project.demoNote && (
            <p className="rounded-md border border-dashed border-border bg-muted/50 px-3.5 py-2.5 text-sm text-muted-foreground">
              {project.demoNote}
            </p>
          )}

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Stack</h2>
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`Technologies used in ${project.name}`}>
              {project.stack.map((s) => (
                <li key={s}>
                  <Badge variant="secondary" className="font-normal">
                    {s}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Working on something similar, or want this build verified? Ask me anything.
            </p>
            <Button asChild className="shine min-h-11 shrink-0">
              <Link href="/contact" data-pla={`detail-contact-${project.id}`}>
                Get in touch
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-between border-t pt-6 text-sm">
            <span className="text-muted-foreground">Next case study</span>
            <Link
              href={`/projects/${next.id}`}
              data-pla={`detail-next-${project.id}`}
              className="inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline"
            >
              {next.name}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
