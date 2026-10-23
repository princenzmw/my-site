import type { Metadata } from "next";
import { CalendarCheck, Clock, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/site/page-shell";
import { CopyEmail } from "@/components/site/copy-email";
import { ContactForm } from "@/components/site/contact-form";
import { CONSULTING, CONTACT, SITE } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Hiring for a data, ML, or software internship in Nairobi or remote? Need a dashboard built? Email prince@nzamuwe.com or use the form. I reply within a day.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Prince Nzamuwe",
    description:
      "Hiring for a data, ML, or software internship in Nairobi or remote? Need a dashboard built? Email prince@nzamuwe.com or use the form. I reply within a day.",
    url: "/contact",
  },
  twitter: {
    title: "Contact | Prince Nzamuwe",
    description:
      "Hiring for a data, ML, or software internship? Email prince@nzamuwe.com or use the form. I reply within a day.",
  },
};

const NEXT_STEPS = [
  {
    icon: Clock,
    title: "I reply within a day",
    text: "Usually faster. If your message lands overnight (EAT), you'll hear from me the next morning.",
  },
  {
    icon: CalendarCheck,
    title: "What helps me help you",
    text: "The role or project, the timeline, and one line about the team. A link to the job spec works too.",
  },
  {
    icon: ShieldCheck,
    title: "Verification is welcome",
    text: "References, code walkthroughs, live demos: happy to schedule any of them. The metrics on this site are all reproducible.",
  },
];

export default function ContactPage() {
  return (
    <PageShell>
      <section className="relative overflow-hidden border-b" aria-labelledby="contact-heading">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div aria-hidden className="bg-glow absolute inset-0" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Contact</p>
          <h1 id="contact-heading" className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {CONTACT.heading}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
            {CONTACT.text}
          </p>

          <div className="mt-8 flex justify-center">
            <CopyEmail email={SITE.email} />
          </div>

          <p className="mt-8 text-sm text-muted-foreground">{CONSULTING.text}</p>

          {/* Preferred conversion path: validated form, honest fallbacks. */}
          <ContactForm />
        </div>
      </section>

      <section aria-label="What happens after you write" className="py-10 sm:py-14">
        <div className="mx-auto grid max-w-5xl gap-6 px-4 sm:px-6 md:grid-cols-3">
          {NEXT_STEPS.map((s) => (
            <div key={s.title} className="rounded-xl border bg-card p-6">
              <h2 className="flex items-center gap-2 font-semibold tracking-tight">
                <s.icon className="h-4 w-4 text-primary" aria-hidden />
                {s.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
