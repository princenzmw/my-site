import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, Github, Hammer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/site/page-shell";
import { SectionHeading } from "@/components/site/section-heading";
import { PROJECTS } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Four builds with receipts: Credio (ROC-AUC 0.869), the FinAccess Kenya dashboard, DukaPulse (in development), and an AirBnB clone across four public iterations.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <PageShell>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            kicker="Projects"
            title="Every build, one page"
            description="Each row links to a full case study: the problem, the approach, the measured results, and the repository to verify all of it."
            level="h1"
          />

          <ul className="reveal-view mx-auto mt-12 max-w-3xl space-y-4">
            {PROJECTS.map((p) => {
              const inDev = p.status === "in-development";
              return (
                <li key={p.id}>
                  <Link
                    href={`/projects/${p.id}`}
                    data-pla={`index-case-study-${p.id}`}
                    className="lift group flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md hover:shadow-primary/5 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold tracking-tight">{p.name}</h2>
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
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{p.tagline}</p>
                      <ul className="mt-2.5 flex flex-wrap gap-1.5" aria-label={`Key metrics for ${p.name}`}>
                        {p.metrics.map((m) => (
                          <li
                            key={m}
                            className="rounded-md border bg-background/60 px-2 py-0.5 font-mono text-[11px] font-medium text-foreground/80"
                          >
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-2 self-start text-sm font-semibold text-primary sm:self-center">
                      Case study
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="reveal-view mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground">
            Prefer going straight to the code? The repositories are public:{" "}
            <a
              href="https://github.com/princenzmw"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
            >
              <Github className="h-3.5 w-3.5" aria-hidden />
              github.com/princenzmw
            </a>{" "}
            <span aria-hidden>(opens in a new tab)</span>
          </p>
          <div className="mt-6 text-center">
            <Button asChild variant="outline" className="min-h-11">
              <a href="https://credio.streamlit.app/" target="_blank" rel="noopener noreferrer" data-pla="index-demo-credio">
                <ExternalLink className="h-4 w-4" aria-hidden />
                Try Credio live
              </a>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
