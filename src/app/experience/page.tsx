import type { Metadata } from "next";
import { Award, GraduationCap, MapPin } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";
import { SectionHeading } from "@/components/site/section-heading";
import { CERTIFICATIONS, EDUCATION, EXPERIENCE } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "The honest timeline: Andela's ATLP, Ida Technology, MLH API Week, and independent projects in Nairobi, plus education and certifications.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return (
    <PageShell>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            kicker="Experience"
            title="The honest timeline"
            description="Training that shipped real features in Agile teams on real codebases, then independent projects that prove it stuck."
            level="h1"
          />

          <ol className="reveal-view relative mx-auto mt-12 max-w-3xl space-y-10 border-l-2 border-primary/25 pl-6 sm:pl-8">
            {EXPERIENCE.map((e) => (
              <li key={e.title} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[33px] top-1.5 h-3.5 w-3.5 rounded-full border-[3px] border-primary bg-background sm:-left-[41px]"
                />
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold tracking-tight">{e.title}</h3>
                  <p className="font-mono text-sm text-muted-foreground">{e.period}</p>
                </div>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  {e.org}
                </p>
                <ul className="mt-2.5 space-y-1.5">
                  {e.points.map((pt) => (
                    <li key={pt.slice(0, 32)} className="flex items-start gap-2 text-sm leading-relaxed">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          {/* Education + certifications */}
          <div className="reveal-view mx-auto mt-14 grid max-w-3xl gap-6 md:grid-cols-2">
            <div className="rounded-xl border bg-card p-6">
              <h2 className="flex items-center gap-2 font-semibold tracking-tight">
                <GraduationCap className="h-5 w-5 text-primary" aria-hidden />
                Education
              </h2>
              <ul className="mt-4 space-y-4">
                {EDUCATION.map((ed) => (
                  <li key={ed.title}>
                    <p className="font-medium leading-snug">{ed.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{ed.org}</p>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">{ed.period}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border bg-card p-6">
              <h2 className="flex items-center gap-2 font-semibold tracking-tight">
                <Award className="h-5 w-5 text-primary" aria-hidden />
                Certifications
              </h2>
              <ul className="mt-4 space-y-3">
                {CERTIFICATIONS.map((c) => (
                  <li key={c.name} className="flex items-start justify-between gap-3 text-sm">
                    <span className="font-medium leading-snug">{c.name}</span>
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">{c.issuer}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
