import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Hammer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/site/page-shell";
import dynamic from "next/dynamic";

const CaseStudyScrolly = dynamic(
  () => import("@/components/site/case-study-scrolly").then((m) => m.CaseStudyScrolly),
  {
    loading: () => (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 min-h-[1200px]" aria-hidden="true" />
    ),
  }
);
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

      {/* ============================== WRITE-UP SCROLLYTELLING ============================== */}
      <section className="py-14 sm:py-20 border-b">
        <CaseStudyScrolly project={project} inDev={inDev} nextProject={next} />
      </section>
    </PageShell>
  );
}
