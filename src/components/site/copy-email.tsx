"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

/** Big email line with copy-to-clipboard + confirmation state. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. http) — the mailto link still works.
    }
  }, [email]);

  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-xl border bg-card px-4 py-3 sm:gap-3 sm:px-6 sm:py-4">
      <a
        href={`mailto:${email}`}
        className="truncate font-mono text-base font-semibold tracking-tight sm:text-xl md:text-2xl"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        data-pla="copy-email"
        aria-label={copied ? "Email copied" : `Copy ${email} to clipboard`}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground transition-colors hover:text-foreground"
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-500" aria-hidden />
        ) : (
          <Copy className="h-4 w-4" aria-hidden />
        )}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </span>
  );
}
