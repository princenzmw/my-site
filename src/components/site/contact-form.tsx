"use client";

import * as React from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/portfolio";

type Fields = { name: string; email: string; message: string; company: string };
type Errors = Partial<Record<keyof Pick<Fields, "name" | "email" | "message">, string>>;
type Status = "idle" | "sending" | "sent" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Mirrors the server-side copy in functions/api/contact.ts — keep both in sync. */
const MESSAGES = {
  name: "Please add your name (2+ characters) so I know who's reaching out.",
  email: "That email doesn't look valid. I need it to reply to you.",
  message: "Add a little detail (20+ characters): what role, project, or question is this about?",
};

function validate(f: Fields): Errors {
  const errors: Errors = {};
  if (f.name.trim().length < 2) errors.name = MESSAGES.name;
  if (!EMAIL_RE.test(f.email.trim())) errors.email = MESSAGES.email;
  if (f.message.trim().length < 20) errors.message = MESSAGES.message;
  return errors;
}

const inputBase =
  "w-full rounded-lg border bg-background px-3.5 py-2.5 text-sm leading-relaxed outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-destructive/40";

export function ContactForm() {
  const [fields, setFields] = React.useState<Fields>({ name: "", email: "", message: "", company: "" });
  const [errors, setErrors] = React.useState<Errors>({});
  const [status, setStatus] = React.useState<Status>("idle");
  const [banner, setBanner] = React.useState<string | null>(null);
  const openedAt = React.useRef<number>(0);

  React.useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    // Clear the field-level error as soon as the visitor starts fixing it.
    if (errors[key as keyof Errors]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const mailtoFallback = React.useCallback(() => {
    const subject = encodeURIComponent(`Portfolio inquiry: ${fields.name.trim() || "hello"}`);
    const body = encodeURIComponent(`${fields.message.trim()}\n\n${fields.name.trim()} (${fields.email.trim()})`);
    return `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  }, [fields]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fieldErrors = validate(fields);
    if (Object.values(fieldErrors).some(Boolean)) {
      setErrors(fieldErrors);
      setBanner("Please fix the highlighted fields so I can reply to the right person.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setBanner(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, ts: openedAt.current }),
      });
      if (res.ok) {
        const w = window as unknown as { plausible?: (...args: unknown[]) => void };
        w.plausible?.("Contact Submit");
        setStatus("sent");
        return;
      }
      const data = (await res.json().catch(() => null)) as { errors?: Errors; error?: string } | null;
      if (data?.errors && Object.values(data.errors).some(Boolean)) {
        setErrors(data.errors);
        setBanner(data.error ?? "Please fix the highlighted fields.");
      } else {
        setBanner(data?.error ?? "Something went wrong sending the message.");
      }
      setStatus("error");
    } catch {
      // Endpoint unreachable (e.g. static preview without the API) — the
      // prefilled mailto fallback keeps the key action completable.
      setBanner(
        "The form backend isn't reachable right now. Use the email button below and your mail app will open with the message prefilled.",
      );
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="mx-auto mt-10 max-w-xl rounded-xl border border-emerald-600/40 bg-emerald-500/10 p-6 text-left">
        <p className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="h-5 w-5" aria-hidden />
          Message sent
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Thanks! Your message landed in prince@nzamuwe.com&apos;s inbox. I reply within a day, usually faster.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto mt-10 max-w-xl text-left">
      {/* Honeypot — hidden from humans, irresistible to bots. Server drops it silently. */}
      <input
        type="text"
        name="company"
        value={fields.company}
        onChange={set("company")}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1.5 block text-sm font-medium">
            Name
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            value={fields.name}
            onChange={set("name")}
            aria-required="true"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "cf-name-error" : undefined}
            placeholder="Your name"
            autoComplete="name"
            className={inputBase}
          />
          {errors.name && (
            <p id="cf-name-error" className="mt-1.5 text-xs leading-relaxed text-destructive">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            value={fields.email}
            onChange={set("email")}
            aria-required="true"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "cf-email-error" : undefined}
            placeholder="you@company.com"
            autoComplete="email"
            className={inputBase}
          />
          {errors.email && (
            <p id="cf-email-error" className="mt-1.5 text-xs leading-relaxed text-destructive">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="cf-message" className="mb-1.5 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          value={fields.message}
          onChange={set("message")}
          aria-required="true"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "cf-message-error" : "cf-message-hint"}
          placeholder="Which role or project is this about?"
          className={`${inputBase} resize-y`}
        />
        {errors.message ? (
          <p id="cf-message-error" className="mt-1.5 text-xs leading-relaxed text-destructive">
            {errors.message}
          </p>
        ) : (
          <p id="cf-message-hint" className="mt-1.5 text-xs text-muted-foreground">
            Internship, freelance dashboard, or a question about the projects: all welcome.
          </p>
        )}
      </div>

      {/* Status region — announced politely by screen readers. */}
      <div aria-live="polite">
        {banner && status === "error" && (
          <p className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm leading-relaxed text-destructive">
            {banner}{" "}
            <a href={mailtoFallback()} className="font-semibold underline underline-offset-2">
              Email me instead
            </a>
          </p>
        )}
      </div>

      <Button type="submit" size="lg" className="shine mt-5 min-h-11 w-full sm:w-auto" disabled={status === "sending"}>
        <Send className="h-4 w-4" aria-hidden />
        {status === "sending" ? "Sending…" : "Send message"}
      </Button>
      <p className="mt-3 text-xs text-muted-foreground">
        Goes straight to my inbox. No newsletter, no tracking pixels, nothing shared.
      </p>
    </form>
  );
}
