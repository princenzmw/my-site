import { BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/site/spotlight-card";
import type { Publication } from "@/lib/portfolio";

/**
 * Publication card aligned with the ProjectCard design system: left-accented header
 * with venue metadata, plain summary prose, and verified DOI links.
 */
export function PublicationCard({
  publication,
  style,
}: {
  publication: Publication;
  style?: React.CSSProperties;
}) {
  return (
    <SpotlightCard>
      <article
        id={`publication-${publication.id}`}
        style={style}
        className="reveal-view flex h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm"
      >
        <div className="border-b border-l-4 border-l-emerald-600 bg-gradient-to-br from-emerald-600/15 via-primary/5 to-cyan-500/10 px-6 py-5">
          <p className="inline-flex items-center gap-2 font-mono text-xs font-medium text-primary">
            <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>{publication.venue}</span>
          </p>
          <h3 className="mt-2 text-lg font-bold tracking-tight leading-snug">
            {publication.title}
          </h3>
        </div>

        <div className="flex flex-1 flex-col gap-5 p-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {publication.summary}
          </p>

          <div className="mt-auto flex flex-wrap gap-2.5 pt-1">
            {publication.links.map((link, idx) => (
              <Button
                key={link.href}
                asChild
                variant={idx === 0 ? "default" : "outline"}
                className="min-h-11"
              >
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-pla={`pub-${publication.id}-${idx}`}
                >
                  <ExternalLink className="h-4 w-4" aria-hidden />
                  {link.label}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </article>
    </SpotlightCard>
  );
}
