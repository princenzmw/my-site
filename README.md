# nzamuwe.com — Prince Nzamuwe's portfolio

A static-exported Next.js 16 site: fully prerendered HTML across nine real
routes, zero runtime backend on the pages themselves, one edge function for
the contact form, deployable on Cloudflare Pages from a repository Prince owns.

**Recruiter? Two fast paths:**
- Verify the claims → [`docs/claims-evidence.md`](docs/claims-evidence.md) (copy-paste commands)
- Understand the codebase → [`ARCHITECTURE.md`](ARCHITECTURE.md) (one read)

## Quickstart

```bash
npm install        # install dependencies (Node 22)
npm run dev        # dev server  → http://localhost:3000
npm run build      # production static export → ./out
npm test           # 32 tests: API contract, content integrity, tone + SEO guards
npm run audit      # 6-dimension acceptance audit (lint + test + build + 30 checks)
npm run audit:online  # adds live-network checks (GitHub API, npm audit)
```

The audit prints a per-dimension scorecard and writes machine-readable
evidence to `audit-results.json`. It exits non-zero if any dimension sits
below the 8.0 acceptance bar, so it can gate CI.

## What lives where

| Path | Purpose |
|------|---------|
| `src/lib/portfolio.ts` | **All site content** — edit this file first; nothing is hard-coded in components |
| `src/app/page.tsx` | Home: hero, stat band, all four project cards, contact band |
| `src/app/about/page.tsx` | `/about` — story, currently, skills with proof links, coursework ticker |
| `src/app/projects/page.tsx` | `/projects` — the index of every build |
| `src/app/projects/[id]/page.tsx` | `/projects/<id>` — case-study pages, generated at build time for all four projects |
| `src/app/experience/page.tsx` | `/experience` — timeline, education, certifications |
| `src/app/contact/page.tsx` | `/contact` — form, direct channels, what-happens-next |
| `src/components/site/` | Purpose-built components (all dependency-free: no animation/UI libraries) |
| `src/app/not-found.tsx` | Custom 404 (ships as `out/404.html`) |
| `functions/api/contact.ts` | Cloudflare Pages Function — validated contact endpoint with real error responses |
| `tests/` | vitest suites (API contract matrix, content data integrity + tone, SEO file guards) |
| `scripts/audit.mjs` | The reproducible 6-dimension scoring harness (crawls every built page) |
| `docs/claims-evidence.md` | Every metric on the site → source + verification command |
| `README-DEPLOY.md` | Deploy to Cloudflare Pages + post-deploy verification + remaining owner decisions |

## Guarantee this repo makes about itself

- `npm run build` completes with zero errors and emits fully prerendered HTML
  (project metrics like ROC-AUC 0.869 are visible with JavaScript disabled — check
  `curl -s http://localhost:3000 | grep "0.869"` against `out/index.html`).
- `npm test` passes (32 tests covering the contact API's 200/400/405/429/502/503
  matrix, content integrity and tone, and SEO file contracts).
- No secrets exist in this repository — the contact function reads
  `RESEND_API_KEY` from Cloudflare's encrypted environment at runtime.

## Deploying

See [`README-DEPLOY.md`](README-DEPLOY.md) — 10 minutes, once: push to GitHub,
connect Cloudflare Pages (`npm run build`, output `out`, `NODE_VERSION=22`),
add the custom domain, optionally set the two contact-form secrets.

## Stack

Next.js 16 (App Router, `output: "export"`) · TypeScript (strict) · Tailwind CSS 4 ·
shadcn/ui (3 components, not 45) · next-themes · Plausible Analytics ·
Cloudflare Pages Functions. No database, no CMS, no server to keep alive.
