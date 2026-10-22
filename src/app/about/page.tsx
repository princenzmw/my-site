import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageShell } from "@/components/site/page-shell";
import { SectionHeading } from "@/components/site/section-heading";
import { ABOUT, COURSEWORK, SITE, SKILLS } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who Prince Nzamuwe is: a Nairobi-based data science student who ships tested, documented projects. Training at Andela's ATLP, Ida Technology, and ALX.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <PageShell>
      {/* ============================== STORY ============================= */}
      <section className="relative overflow-hidden border-b" aria-labelledby="about-heading">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div aria-hidden className="bg-glow absolute inset-0" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">{ABOUT.kicker}</p>
            <h1 id="about-heading" className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
              About Prince Nzamuwe
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{ABOUT.title}</p>

            <div className="mt-10 max-w-prose space-y-5 text-base leading-relaxed">
              {ABOUT.paragraphs.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>

            <div className="mt-10 rounded-xl border bg-card p-5">
              <p className="flex items-start gap-3 text-sm leading-relaxed">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                {ABOUT.currently}
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline" className="border-emerald-600/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                <span className="pulse-dot relative mr-1.5 inline-flex h-2 w-2 rounded-full bg-emerald-500 text-emerald-500" aria-hidden />
                Open to internships
              </Badge>
              <Badge variant="outline" className="border-blue-600/40 bg-blue-500/10 text-blue-700 dark:text-blue-400">
                Freelance welcome
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                {SITE.location}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== SKILLS ============================ */}
      <section id="skills" className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            kicker="Skills"
            title="Evidence over percentages"
            description="No “Python 95%” bars. Every group links to the project that proves it: if I list it, you can watch me use it."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {SKILLS.map((group, i) => (
              <div
                key={group.area}
                style={{ animationDelay: `${i * 80}ms` }}
                className="reveal-view lift flex flex-col rounded-xl border bg-card p-6 shadow-sm hover:shadow-md hover:shadow-primary/5"
              >
                <h3 className="font-semibold tracking-tight">{group.area}</h3>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {group.tools.map((t) => (
                    <li key={t}>
                      <Badge variant="secondary" className="font-normal">
                        {t}
                      </Badge>
                    </li>
                  ))}
                </ul>
                <a
                  href={group.proof.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 border-t pt-4 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Proof: {group.proof.label}
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">↗</span>
                </a>
              </div>
            ))}
          </div>

          {/* USIU coursework ticker */}
          <div
            className="marquee marquee-mask reveal-view mt-10 overflow-hidden rounded-xl border bg-card/60 py-3.5"
            aria-label="Relevant coursework at USIU-Africa"
          >
            <div className="marquee-track flex w-max items-center gap-3 px-3">
              {[...COURSEWORK, ...COURSEWORK].map((c, i) => (
                <span
                  key={`${c}-${i}`}
                  aria-hidden={i >= COURSEWORK.length}
                  className="flex items-center gap-3 whitespace-nowrap font-mono text-sm text-muted-foreground"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/60" aria-hidden />
                  {c}
                  <span aria-hidden className="text-border">·</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
