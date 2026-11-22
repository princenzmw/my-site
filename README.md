# nzamuwe.com

Source code for my personal portfolio site, built as a static-exported Next.js 16 app with nine prerendered routes and one Cloudflare Pages Function for the contact form.

- Claim verification commands: [`docs/claims-evidence.md`](docs/claims-evidence.md)
- Codebase overview: [`ARCHITECTURE.md`](ARCHITECTURE.md)

## Quickstart

```bash
npm install           # install dependencies (Node 22)
npm run dev           # dev server -> http://localhost:3000
npm run build         # production static export -> ./out
npm test              # 32 tests: API contract, content integrity, tone + SEO guards
npm run audit         # 6-dimension audit (lint + test + build + 30 checks)
npm run audit:online  # adds live-network checks (GitHub API, npm audit)
```

The audit prints a per-dimension scorecard and writes results to `audit-results.json`, exiting non-zero if any dimension drops below 8.0 so it can gate CI.

## Repository layout

| Path | Purpose |
|------|---------|
| `src/lib/portfolio.ts` | Site content data; edit this file first rather than hard-coding copy in components |
| `src/app/page.tsx` | Home page: hero, stat band, four project cards, contact band |
| `src/app/about/page.tsx` | `/about`: background, current focus, skills with proof links, coursework |
| `src/app/projects/page.tsx` | `/projects`: index of all projects |
| `src/app/projects/[id]/page.tsx` | `/projects/<id>`: case-study pages generated at build time |
| `src/app/experience/page.tsx` | `/experience`: timeline, education, certifications |
| `src/app/contact/page.tsx` | `/contact`: contact form and direct channels |
| `src/components/site/` | Dependency-free UI components |
| `src/app/not-found.tsx` | Custom 404 page (ships as `out/404.html`) |
| `functions/api/contact.ts` | Cloudflare Pages Function for validated contact submissions |
| `tests/` | Vitest suites covering contact API contract, content integrity, and SEO files |
| `scripts/audit.mjs` | 6-dimension audit script that checks every built page |
| `docs/claims-evidence.md` | Every metric on the site mapped to its source and verification command |
| `README-DEPLOY.md` | Cloudflare Pages deployment steps and post-deploy checks |

## Build and test checks

- `npm run build` emits static HTML with project metrics prerendered (check `curl -s http://localhost:3000 | grep "0.869"` against `out/index.html`).
- `npm test` runs 32 tests covering contact API status codes (200, 400, 405, 429, 502, 503), content integrity, and SEO files.
- No secrets are committed to git; the contact function reads `RESEND_API_KEY` from Cloudflare environment variables at runtime.

## Deploying

See [`README-DEPLOY.md`](README-DEPLOY.md) for Cloudflare Pages setup (`npm run build`, output `out`, `NODE_VERSION=22`), custom domain configuration, and contact-form secrets.

## Stack

Next.js 16 (App Router, `output: "export"`), TypeScript (strict), Tailwind CSS 4, shadcn/ui (3 components), next-themes, Plausible Analytics, and Cloudflare Pages Functions.
