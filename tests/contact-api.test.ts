/**
 * tests/contact-api.test.ts — proves the /api/contact contract end to end.
 * Matrix: 200 (send + honeypot + time-trap) · 400 (invalid JSON, field errors)
 *         405 (GET) · 429 (rate limit) · 502 (provider error) · 503 (no key)
 */
import { describe, expect, it, vi, afterEach } from "vitest";
import { handleContact, onRequestGet, type Env } from "../functions/api/contact";

const VALID = {
  name: "Ada Lovelace",
  email: "ada@company.com",
  message: "We are hiring a data science intern in Nairobi and your projects look relevant.",
  ts: Date.now() - 10_000, // opened > 2.5s ago -> passes the time-trap
};

function req(body: unknown): Request {
  return new Request("https://nzamuwe.com/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("POST /api/contact — validation (400)", () => {
  it("rejects malformed JSON with a 400 and a helpful message", async () => {
    const res = await handleContact(req("{not json"), {}, "t1");
    expect(res.status).toBe(400);
    const j = (await res.json()) as { error: string };
    expect(j.error).toMatch(/JSON/i);
  });

  it("returns per-field errors for a bad email, short message, and missing name", async () => {
    const res = await handleContact(
      req({ name: "A", email: "nope", message: "hi", ts: Date.now() - 10_000 }),
      {},
      "t2",
    );
    expect(res.status).toBe(400);
    const j = (await res.json()) as { errors: Record<string, string> };
    expect(j.errors.name).toBeTruthy();
    expect(j.errors.email).toMatch(/email/i);
    expect(j.errors.message).toMatch(/20\+|detail/i);
  });
});

describe("POST /api/contact — bot defenses (fake 200, no send)", () => {
  it("silently accepts a filled honeypot and never calls the provider", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const res = await handleContact(req({ ...VALID, company: "spammy corp" }), {}, "t3");
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("silently accepts submissions faster than 2.5 seconds", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const res = await handleContact(req({ ...VALID, ts: Date.now() }), {}, "t4");
    expect(res.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("POST /api/contact — delivery", () => {
  it("returns 503 with an honest message when RESEND_API_KEY is not configured", async () => {
    const res = await handleContact(req(VALID), {}, "t5");
    expect(res.status).toBe(503);
    const j = (await res.json()) as { error: string };
    expect(j.error).toMatch(/prince@nzamuwe\.com/);
  });

  it("sends via Resend and returns 200 on success", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ id: "abc" }), { status: 202 }));
    vi.stubGlobal("fetch", fetchMock);
    const fakeKey = `fake_${"x".repeat(24)}`;
    const env: Env = { RESEND_API_KEY: fakeKey, CONTACT_TO: "inbox@nzamuwe.com" };
    const res = await handleContact(req(VALID), env, "t6");
    expect(res.status).toBe(200);
    const j = (await res.json()) as { ok: boolean };
    expect(j.ok).toBe(true);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    const body = JSON.parse(String(init.body)) as { reply_to: string; to: string[] };
    expect(body.reply_to).toBe(VALID.email);
    expect(body.to).toEqual(["inbox@nzamuwe.com"]);
  });

  it("returns 502 when the email provider fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("boom", { status: 500 })));
    const fakeKey = `fake_${"y".repeat(24)}`;
    const res = await handleContact(req(VALID), { RESEND_API_KEY: fakeKey }, "t7");
    expect(res.status).toBe(502);
  });
});

describe("POST /api/contact — rate limiting (429)", () => {
  it("blocks the 6th message from one IP inside the window", async () => {
    for (let i = 0; i < 5; i++) {
      const r = await handleContact(req(VALID), {}, "rate-limit-test");
      expect([429, 503]).toContain(r.status); // 503 = valid but unconfigured; still counted
    }
    const res = await handleContact(req(VALID), {}, "rate-limit-test");
    expect(res.status).toBe(429);
    const j = (await res.json()) as { error: string };
    expect(j.error).toMatch(/prince@nzamuwe\.com/);
  });
});

describe("GET /api/contact — method guard (405)", () => {
  it("rejects GET with 405 and an Allow: POST header", async () => {
    const res = await onRequestGet();
    expect(res.status).toBe(405);
    expect(res.headers.get("Allow")).toBe("POST");
  });
});
