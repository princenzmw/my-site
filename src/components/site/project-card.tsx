import Link from "next/link";
import { ArrowRight, Check, ExternalLink, Github, Hammer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/site/spotlight-card";
import type { Project } from "@/lib/portfolio";

/**
 * Project card with an honest visual: typographic metric chips built from the
 * project's own numbers — no stock photography anywhere. "In development"
 * projects are labeled as such instead of showing invented metrics.
 */
export function ProjectCard({
  project,
  style,
}: {
  project: Project;
  style?: React.CSSProperties;
}) {
  const inDev = project.status === "in-development";

  return (
    <SpotlightCard>
      <article
        id={`project-${project.id}`}
        style={style}
        className="reveal-view flex h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm"
      >
        {/* Header panel */}
        <div className={`bg-gradient-to-br ${project.accent} border-b px-6 py-5`}>
          <div className="flex items-start justify-between gap-3">
            <p className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {project.role}
            </p>
            {inDev ? (
              <Badge
                variant="outline"
                className="shrink-0 border-amber-600/40 bg-amber-500/10 text-amber-700 dark:text-amber-400"
              >
                <Hammer className="mr-1 h-3 w-3" aria-hidden />
                In development
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="shrink-0 border-emerald-600/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              >
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
                Live
              </Badge>
            )}
          </div>
          <h3 className="mt-1.5 text-lg font-bold tracking-tight">{project.name}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{project.tagline}</p>

          {/* metric chips */}
          <ul className="mt-3.5 flex flex-wrap gap-1.5" aria-label={`Key metrics for ${project.name}`}>
            {project.metrics.map((m) => (
              <li
                key={m}
                className="rounded-md border bg-background/60 px-2 py-0.5 font-mono text-[11px] font-medium text-foreground/80"
              >
                {m}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Problem
            </h4>
            <p className="mt-1 text-sm leading-relaxed">{project.problem}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Approach
            </h4>
            <p className="mt-1 text-sm leading-relaxed">{project.approach}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {inDev ? "Built so far" : "Results"}
            </h4>
            <ul className="mt-1.5 space-y-1.5">
              {project.results.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm leading-relaxed">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          {project.demoNote && (
            <p className="rounded-md border border-dashed border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              {project.demoNote}
            </p>
          )}

          <div className="mt-auto space-y-4 pt-1">
            <div>
              <h4 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Stack
              </h4>
              <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={`Technologies used in ${project.name}`}>
                {project.stack.map((s) => (
                  <li key={s}>
                    <Badge variant="secondary" className="font-normal">
                      {s}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Button asChild variant={inDev ? "outline" : "default"} className="min-h-11">
                <a href={project.code} target="_blank" rel="noopener noreferrer" data-pla={`code-${project.id}`}>
                  <Github className="h-4 w-4" aria-hidden />
                  {project.codeLabel ?? "Code"}
                </a>
              </Button>
              {project.demo && (
                <Button asChild variant="outline" className="min-h-11">
                  <a href={project.demo} target="_blank" rel="noopener noreferrer" data-pla={`demo-${project.id}`}>
                    <ExternalLink className="h-4 w-4" aria-hidden />
                    Live demo
                  </a>
                </Button>
              )}
              {/* Case study: the full write-up lives on the project's own page */}
              <Link
                href={`/projects/${project.id}`}
                data-pla={`case-study-${project.id}`}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Case study
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </SpotlightCard>
  );
}
