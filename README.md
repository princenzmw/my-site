# nzamuwe.com

Source code for my personal portfolio site, built as a static-exported Next.js 16 app with prerendered routes and one Cloudflare Pages Function for the contact form.

Architecture notes live in [`ARCHITECTURE.md`](ARCHITECTURE.md).

## Quickstart

```bash
npm install      # install dependencies (Node 22)
npm run dev      # dev server -> http://localhost:3000
npm run build    # production static export -> ./out
npm run preview  # serve static export locally
npm run lint     # run ESLint
npm test         # run Vitest suites
```

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
| `src/components/site/` | Custom site UI components |
| `src/components/ui/` | Shared shadcn/ui primitives (badge, button, separator) |
| `src/app/not-found.tsx` | Custom 404 page (ships as `out/404.html`) |
| `functions/api/contact.ts` | Cloudflare Pages Function for validated contact submissions |
| `scripts/optimize-scripts.mjs` | Post-build static output script run by `npm run build` |
| `tests/` | Vitest suites covering the contact API, portfolio content integrity, and SEO files |

## Build and security notes

- `npm run build` emits static HTML to `./out` with project metrics prerendered.
- `npm test` runs the Vitest suites in `tests/contact-api.test.ts`, `tests/portfolio.test.ts`, and `tests/seo-files.test.ts`.
- No secrets are committed to git; `functions/api/contact.ts` reads `RESEND_API_KEY` from Cloudflare environment variables at runtime.

## Deploying

Connect this repository to Cloudflare Pages with build command `npm run build`, output directory `out`, and `NODE_VERSION=22`, then configure `RESEND_API_KEY` (and optional recipient environment variables) in Cloudflare Pages settings.

## Stack

Next.js 16 (App Router, `output: "export"`), TypeScript (strict), Tailwind CSS 4, shadcn/ui (3 components), next-themes, Plausible Analytics, and Cloudflare Pages Functions.
