# Architecture — nzamuwe.com

One job: get a recruiter from skepticism to contact in under two minutes.
Nine prerendered routes, each answering one question (Who is this? What has
he built? Can I verify it? How do I reach him?), so every architectural
decision below serves that job or the owner's ability to maintain it alone.

## Render pipeline (static, crawler-first)

```
src/lib/portfolio.ts   (single source of truth — ALL content)
        │  imported by
        ▼
src/app/**/page.tsx + layout.tsx     React Server Components
   /  /about  /projects  /projects/[id] ×4  /experience  /contact
        │  next build  (output: "export")
        ▼
out/*.html + out/404.html + out/_next/static/*  (11 prerendered pages)
        │  git push → Cloudflare Pages
        ▼
nzamuwe.com  (Cloudflare edge CDN, 300+ PoPs, no origin server)
```

**Decision — full static export.** The previous vly.ai build was a
client-side-rendered SPA: crawlers received an empty `<div id="root">`,
which capped SEO at the "empty shell" ceiling. Here every byte of project
copy ships inside the HTML response — no JS required to read a single metric.
Verification: `curl -s https://nzamuwe.com/ | grep "ROC-AUC 0.869"` returns a
hit (the "H2 SEO gate").

**Consequences, accepted deliberately:**
- No server rendering per request → hosting is free-tier friendly and
  outage-proof; there is nothing to keep alive.
- Animations must never gate content. `.reveal-view` entrance effects are
  gated behind `@supports (animation-timeline: view())`; `CountUp` renders its
  final value server-side and only animates the transition when JS runs.
  `prefers-reduced-motion` disables every animation.
- Animation/interaction budget: zero animation libraries. All motion is CSS
  (view timelines, keyframes) plus three tiny `IntersectionObserver` /
  `requestAnimationFrame` components. The whole site ships **10 runtime
  dependencies** — a deliberate ceiling that keeps the JS payload small and
  the dependency surface auditable.

## Data flow

There is no database and no CMS — by design for a one-maintainer site.

- **Content**: hand-edited TypeScript (`src/lib/portfolio.ts`). Type-checked
  at build time; a typo is a compile error, not a broken page. Tests in
  `tests/portfolio.test.ts` enforce integrity (owned repo links only, no
  invented numbers for in-development work, no template fingerprints).
- **Assets**: `public/` ships verbatim (`resume.pdf`, `og-image.png`,
  `favicon.png`, `robots.txt`, `sitemap.xml`, `_headers`). Regenerators live
  in `tools/`.
- **Analytics**: Plausible (cookie-free) bound to `nzamuwe.com`. A queue shim
  in `layout.tsx` makes custom events (`data-pla` attributes →
  `src/components/site/click-tracking.tsx`) fire even before the script loads.

## Contact API (`functions/api/contact.ts`)

```
browser ── POST /api/contact ──▶ Cloudflare Pages Function (edge isolate)
                                   │ 1. JSON parse guard        → 400
                                   │ 2. honeypot + time-trap    → 200 (silent drop)
                                   │ 3. per-field validation    → 400 {errors:{field:copy}}
                                   │ 4. IP rate limit (5/10min) → 429
                                   │ 5. no RESEND_API_KEY?      → 503 (honest, with mailto copy)
                                   │ 6. Resend REST call        → 200 | 502
                                   ▼
                             prince@nzamuwe.com inbox
```

- Runs on Cloudflare's edge automatically at deploy — `functions/` is a
  Pages convention, not app code. No server, no cold-start billing.
- **Secrets**: `RESEND_API_KEY` (+ optional `CONTACT_TO`, `CONTACT_FROM`)
  live only in Cloudflare's encrypted environment variables. Never in the
  repo — `tests/contact-api.test.ts` proves the 503 path so a missing key
  degrades gracefully into a "email me directly" fallback, in the UI too
  (the form renders a prefilled `mailto:` link on any failure).
- Local exercise: `npm run build && npx wrangler pages dev out`, then
  `curl -X POST localhost:8788/api/contact -d '{"name":"T","email":"t@x.io","message":"hello hello hello hello"}'`.

## Content editing (the 5-minute change)

1. Edit `src/lib/portfolio.ts` (copy, projects, stats, skills, timeline).
2. `npm test` — integrity guardrails run in 0.6 s.
3. `npm run build` → `out/` is the new site; push deploys it.

No content lives in components; pages only render data structures. Each
project card and project row deep-links to a case-study page generated at
build time from the same data (zero duplication of copy: cards summarize,
case studies carry the full Problem → Approach → Results write-up).

## Deploy topology & headers

- **Host**: Cloudflare Pages, custom domain `nzamuwe.com`, `www` 301 → apex.
- **`public/_headers`**: HSTS (2y, preload), `X-Content-Type-Options`,
  `Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy`, and a
  CSP that is `Report-Only` for the first week, then enforced.
- **404s**: Next emits `out/404.html`; Cloudflare serves it for unknown routes.
- **Rollback**: every deploy is an immutable upload; rollback is a dashboard click.

## What was removed from the old stack, and why

| Removed | Reason |
|---------|--------|
| Convex backend + auth | The site's job needs zero user accounts; /auth was an indexed, sevable risk with no purpose |
| 42 of 45 shadcn components | Template bloat — the site uses Button, Badge, Separator |
| vly.ai toolbar/badge runtime | Builder fingerprint; recruiters reverse-search tooling tells |
| Booking widget with pricing | Recruiters are the primary audience; consulting is demoted to one footer-adjacent line |

## Testing strategy

| Layer | Tool | What it proves |
|-------|------|----------------|
| Unit — API contract | vitest, 9 tests | every documented status code + fallback behavior |
| Unit — content | vitest, 14 tests | claims stay supportable (owned links, no fake WIP metrics, fingerprints absent, human tone: zero em-dashes in shipped copy) |
| Unit — SEO files | vitest, 9 tests | robots/sitemap/headers/description budgets can't regress silently (sitemap must list every route) |
| Integration — audit | `npm run audit` | lint + test + build + 30 acceptance checks across every built page + scorecard, one command |
| Browser QA | agent-browser runs (recorded in docs/qa-screens/) | keyboard nav, focus visibility, 390 px layout, theme switching |
| Clean-room | fresh `npm ci` → build → test → serve → curl | an independent person can reproduce everything from the README |
