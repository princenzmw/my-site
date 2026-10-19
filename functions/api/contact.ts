/**
 * /api/contact — Cloudflare Pages Function (runs at the edge, zero cold-start cost).
 *
 * Cloudflare Pages serves everything in /functions automatically at deploy time;
 * no server to manage. Locally, run `npx wrangler pages dev out` after a build
 * to exercise the same code path.
 *
 * Contract (all responses JSON):
 *   POST /api/contact
 *     200 { ok: true }                       message accepted (or honeypot/bot — silently dropped)
 *     400 { ok:false, error, errors:{field}  validation failed, per-field helpful copy
 *     405 { ok:false, error }                wrong method (Allow: POST)
 *     429 { ok:false, error }                rate-limited (5 / 10 min / IP)
 *     502 { ok:false, error }                email provider failure
 *     503 { ok:false, error }                RESEND_API_KEY secret not configured yet
 *
 * Secrets live ONLY in the Cloudflare Pages dashboard (Settings → Environment
 * variables → encrypted): RESEND_API_KEY, optionally CONTACT_TO / CONTACT_FROM.
 * Nothing secret is committed — a missing key yields an honest 503, never a crash.
 */

export type Env = {
  RESEND_API_KEY?: string;
  /** Where messages are delivered. Defaults to the site owner. */
  CONTACT_TO?: string;
  /** Verified Resend sender, e.g. "Portfolio <notify@nzamuwe.com>". */
  CONTACT_FROM?: string;
};

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS = { perWindow: 5, windowMs: 10 * 60 * 1000, maxBodyChars: 5000 };
/** Mirrors the client copy in src/components/site/contact-form.tsx — keep in sync. */
const MESSAGES = {
  name: "Please add your name (2+ characters) so I know who's reaching out.",
  email: "That email doesn't look valid. I need it to reply to you.",
  message: "Add a little detail (20+ characters): what role, project, or question is this about?",
};

/** Per-isolate rate limiter. Good-enough deterrent for a contact form; abuse
 *  beyond this is Cloudflare WAF territory, not application code. */
const hits = new Map<string, number[]>();
export function resetRateLimit(): void {
  hits.clear();
}

function json(body: unknown, status: number, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...extraHeaders },
  });
}

export function jsonError(message: string): Response {
  return json({ ok: false, error: message }, 400);
}

export async function handleContact(request: Request, env: Env = {}, ip = "local"): Promise<Response> {
  /* ---- method & body ---- */
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "Send JSON with name, email, and message fields." }, 400);
  }

  const str = (k: string): string => (typeof payload[k] === "string" ? (payload[k] as string) : "").trim();
  const name = str("name");
  const email = str("email");
  const message = str("message");
  const company = str("company"); // honeypot — must stay empty
  const ts = typeof payload.ts === "number" ? payload.ts : 0;

  /* ---- bots: honeypot + sub-2.5s time-trap get a fake success, no send ---- */
  const tooFast = ts > 0 && Date.now() - ts < 2500;
  if (company !== "" || tooFast) {
    return json({ ok: true }, 200);
  }

  /* ---- validation: helpful, specific, per-field ---- */
  const errors: FieldErrors = {};
  if (name.length < 2 || name.length > 100) errors.name = MESSAGES.name;
  if (!EMAIL_RE.test(email) || email.length > 200) errors.email = MESSAGES.email;
  if (message.length < 20 || message.length > LIMITS.maxBodyChars) errors.message = MESSAGES.message;
  if (Object.values(errors).some(Boolean)) {
    return json({ ok: false, error: "Please fix the highlighted fields.", errors }, 400);
  }

  /* ---- rate limit ---- */
  const now = Date.now();
  const window_ = (hits.get(ip) ?? []).filter((t) => now - t < LIMITS.windowMs);
  if (window_.length >= LIMITS.perWindow) {
    return json(
      {
        ok: false,
        error: "Too many messages from your network right now. Try again in a bit, or email prince@nzamuwe.com directly.",
      },
      429,
    );
  }
  window_.push(now);
  hits.set(ip, window_);

  /* ---- delivery ---- */
  if (!env.RESEND_API_KEY) {
    return json(
      {
        ok: false,
        error:
          "Email delivery isn't configured yet (missing RESEND_API_KEY). Please email prince@nzamuwe.com directly, and I'll reply within a day.",
      },
      503,
    );
  }

  const from = env.CONTACT_FROM ?? "Portfolio contact form <onboarding@resend.dev>";
  const to = env.CONTACT_TO ?? "prince@nzamuwe.com";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Portfolio inquiry: ${name}`,
      text: `${message}\n\n${name} (${email})\nSent from the nzamuwe.com contact form`,
    }),
  });

  if (!res.ok) {
    return json(
      { ok: false, error: "The email provider returned an error. Please email prince@nzamuwe.com directly." },
      502,
    );
  }
  return json({ ok: true }, 200);
}

/* ---- Pages Function handlers ---- */

type Ctx = { request: Request; env: Env };

export async function onRequestPost({ request, env }: Ctx): Promise<Response> {
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  return handleContact(request, env, ip);
}

export async function onRequestGet(): Promise<Response> {
  return json({ ok: false, error: "Method not allowed. Use POST." }, 405, { Allow: "POST" });
}
