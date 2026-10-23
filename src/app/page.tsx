import Link from "next/link";
import {
  ArrowRight,
  Download,
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/site/page-shell";
import { SectionHeading } from "@/components/site/section-heading";
import { ProjectCard } from "@/components/site/project-card";
import { RoleRotator } from "@/components/site/role-rotator";
import { CountUp } from "@/components/site/count-up";
import { CopyEmail } from "@/components/site/copy-email";
import { RocPanel } from "@/components/site/roc-panel";
import { HeroRocBg } from "@/components/site/hero-roc-bg";
import { HERO, PROJECTS, SITE, STATS } from "@/lib/portfolio";

const CHANNELS = [
  { icon: Linkedin, label: "LinkedIn", value: "in/princenzmw", href: SITE.linkedin },
  { icon: Github, label: "GitHub", value: "github.com/princenzmw", href: SITE.github },
  { icon: MessageCircle, label: "WhatsApp", value: SITE.phoneDisplay, href: SITE.whatsapp },
  { icon: Phone, label: "Phone", value: SITE.phoneDisplay, href: SITE.phoneHref },
];

export default function Home() {
  return (
    <PageShell>
      {/* ============================== HERO ============================== */}
      <section className="relative overflow-hidden border-b" aria-labelledby="hero-heading">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div aria-hidden className="bg-glow absolute inset-0" />
        <HeroRocBg />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="pulse-dot relative inline-flex h-2 w-2 rounded-full bg-emerald-500 text-emerald-500" aria-hidden />
              {HERO.kicker}
            </p>
            <h1
              id="hero-heading"
              className="mt-5 text-[clamp(2rem,4.5vw+0.5rem,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.025em]"
            >
              {HERO.headline.plain}{" "}
              <RoleRotator words={HERO.headline.rotate} />{" "}
              {HERO.headline.plainAfter}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {HERO.subheadline}
            </p>

            {/* Recruiter-first CTAs — booking/pricing is NOT the first action */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="shine min-h-11">
                <Link href={HERO.primaryCta.href}>
                  {HERO.primaryCta.label}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="min-h-11">
                <a href={HERO.secondaryCta.href} download data-pla="resume-download">
                  <Download className="h-4 w-4" aria-hidden />
                  {HERO.secondaryCta.label}
                </a>
              </Button>
              <a
                href={HERO.tertiaryCta.href}
                data-pla="email-hero"
                className="inline-flex min-h-11 items-center gap-2 px-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                <Mail className="h-4 w-4" aria-hidden />
                {HERO.tertiaryCta.label}: prince@nzamuwe.com
              </a>
            </div>

            <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              Every metric on this page links to the repository it came from. Clone it. Rerun it. Check me.
            </p>
          </div>

          {/* Signature moment: Credio's ROC curve, drawn */}
          <div className="flex justify-center lg:justify-end">
            <RocPanel />
          </div>
        </div>
      </section>

      {/* =========================== STAT BAND ============================ */}
      <section aria-label="Key results from the repositories" className="border-b bg-muted/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ animationDelay: `${i * 80}ms` }}
              className="group reveal-view rounded-lg p-2 text-center transition-colors hover:bg-background"
            >
              <p className="font-mono text-2xl font-bold text-primary sm:text-3xl">
                <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {s.label}
                <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5" aria-hidden>
                  ↗
                </span>
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* ============================ PROJECTS ============================ */}
      <section id="projects" className="cv-auto py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            kicker="Featured work"
            title="Projects with receipts"
            description="Public repositories you can clone, rerun, and critique, plus one built in the open right now. Every project has a case-study page."
            size="large"
          />
          {/* Alternating 2/1-column rhythm, same as the reviewed design */}
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {PROJECTS.map((project, i) => (
              <div key={project.id} className={i % 2 === 0 ? "lg:col-span-2" : ""}>
                <ProjectCard project={project} style={{ animationDelay: `${i * 80}ms` }} />
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg" className="min-h-11">
              <Link href="/projects">
                Browse all projects
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ============================= CONTACT ============================ */}
      <section id="contact" className="cv-auto border-t bg-muted/40 py-20 sm:py-28">
        <div className="reveal-view mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Contact</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Fastest ways to reach me</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            Hiring for a data, ML, or software internship? Need a dashboard or data app built? I reply within a day.
          </p>

          <div className="mt-8 flex justify-center">
            <CopyEmail email={SITE.email} />
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CHANNELS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="lift flex min-h-11 flex-col items-center gap-0.5 rounded-xl border bg-card px-4 py-3.5 transition-shadow hover:shadow-md hover:shadow-primary/5"
              >
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <l.icon className="h-4 w-4 text-primary" aria-hidden />
                  {l.label}
                </span>
                <span className="truncate font-mono text-xs text-muted-foreground">{l.value}</span>
              </a>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="shine min-h-11">
              <Link href="/contact" data-pla="contact-open">
                Use the contact form
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="min-h-11">
              <a href={SITE.resume} download data-pla="resume-download-band">
                <Download className="h-4 w-4" aria-hidden />
                Résumé (PDF)
              </a>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
