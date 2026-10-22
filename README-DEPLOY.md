# nzamuwe.com — Rebuilt, Self-Owned Portfolio

A complete rebuild of Prince Nzamuwe's portfolio as a **static-exported Next.js 16 site**,
deployable on **Cloudflare Pages** from a repository **you own**.

This rebuild removes every trace of the vly.ai builder and closes all 25 issues from the
site audit (`nzamuwe.com_Website_Audit_Report.pdf`) and the elevation plan
(`nzamuwe.com_Score_Elevation_Blueprint.pdf`). No "Secured by" badge, no builder toolbar
code, no `.vly.sh` checks, no placeholder employers, no stock faces, no fake view counts.

**New in this version (v3):**
- Real routes instead of hash links: `/about`, `/projects`, `/projects/<id>` ×4,
  `/experience`, `/contact` — each with its own title, description, and canonical URL.
- Four case-study pages generated at build time from the same `portfolio.ts` data.
- Copy rewritten in a plain human voice: zero em-dashes in shipped HTML (audited),
  no filler phrases.
- MLH Global Hack Week (API Week, Nov 2025) added to the timeline.
- Dependencies upgraded: `next@16.4`, `eslint@10`, `vitest@5` — **0 vulnerabilities in
  production dependencies** (verified by `npm run audit:online`).
- Audit harness upgraded: it now crawls every built page (not just home), measures meta
  tags as the browser decodes them, and no longer triggers Node's DEP0190 warning.

Latest verified scorecard: **9.9/10** (`npm run audit:online`); the only unverified
check is CV4 (real recruiter contacts), which requires post-launch traffic by definition.

---

## 1. Before you publish — the remaining edits

Your résumé (Oct 2026 draft) has already been merged in: USIU-Africa education, the
ATLP/Ida Technology timeline, certifications, DukaPulse, and `prince@nzamuwe.com` are
shipped. Only these are left:

| # | What | Where | Status |
|---|------|-------|--------|
| 1 | ~~BSc program, institution, year~~ | `ABOUT.currently` | ✅ Resolved from your résumé |
| 2 | ~~Timeline path A vs B~~ | `EXPERIENCE` | ✅ Resolved — ATLP, Ida Technology, MLH API Week, independent projects |
| 3 | FinAccess live view URL | `PROJECTS[1]` (`demo` field) | **Open** — publish to Power BI Service (see §6.4), then set `demo: "https://app.powerbi.com/view?r=..."` on the finaccess project; the "Live demo" button appears automatically |
| 4 | DukaPulse links & metrics | `PROJECTS[2]` | **Open by design** — ships as "In development" with zero invented numbers |
| 5 | `resume.pdf` | `public/resume.pdf` | ✅ Regenerated to mirror your résumé. Swap in your final PDF anytime — claims must match this site exactly |
| 6 | Portrait photo (optional) | hero | Honest "PN" monogram + animated ROC panel. The old site's hero photo was a stock face — swap in a real photo only when you're happy to publish it |
| 7 | ~~JSON-LD `alumniOf`~~ | `src/app/layout.tsx` | ✅ Added |

Everything else is real, verified content: your GitHub repos, live demo, and measured
metrics. Search for `[` in `src/lib/portfolio.ts` — there are no brackets left in copy.

## 2. Run it locally

```bash
npm install        # Node 22
npm run dev        # http://localhost:3000 — /, /about, /projects, /experience, /contact
npm test           # 32 tests: API contract, content integrity + tone, SEO guards
npm run audit      # 6-dimension acceptance audit (writes audit-results.json)
npm run audit:online  # adds live checks: npm audit (prod), GitHub repo verification
```

The audit exits non-zero if any dimension scores below the 8.0 acceptance bar.

## 3. Deploy to Cloudflare Pages — exact steps

> ⚠️ **Your current Pages project has Build output directory = `dist`.** That was correct
> for the old Vite project. This rebuild is Next.js static export and outputs to `out`.
> If you deploy with `dist`, Cloudflare will publish the old/empty folder. Fix it in
> step 3.4 below (or delete the old project and create a fresh one).

### 3.1 Commit and push the code

```powershell
cd D:\Clones\Transit\nzamuwe-rebuild
# .gitignore already covers node_modules/, out/, .env* — verify with:
git init
git add -A
git status                        # confirm out/ and node_modules/ are NOT listed
git commit -m "nzamuwe.com: self-owned Next.js rebuild, 9.9/10 acceptance score"
git branch -M main
git remote add origin https://github.com/princenzmw/nzamuwe-com.git
git push -u origin main
```

This repo is itself recruiter evidence: tidy code, real history, README, tests.

### 3.2 Connect the repo to Pages

Cloudflare Dashboard → **Workers & Pages** → your existing project (or **Create →
Pages → Connect to Git** → pick `nzamuwe-com`).

### 3.3 Build configuration (Production **and** Preview)

| Setting | Value | Why |
|---|---|---|
| Framework preset | **None** | The "Next.js" preset assumes SSR via next-on-pages; this site is a pure static export |
| Build command | `npm run build` | Runs `next build`, which emits the static site |
| Build output directory | **`out`** ← change from `dist` | Next static export target, set in `next.config.ts` |
| Root directory | *(blank)* | The repo root is the project |
| Production branch | `main` | |

### 3.4 Environment variables (Production **and** Preview)

| Variable | Value | Required |
|---|---|---|
| `NODE_VERSION` | `22` | **Yes** — Next 16 needs Node ≥ 20.9; CF's default may be older |

Optional, only when wiring the contact form's email delivery (§3.7):
`RESEND_API_KEY` (encrypted), `CONTACT_FROM` (e.g. `Portfolio <notify@nzamuwe.com>`).

### 3.5 Deploy and watch the build log

Deploy → the log must show `✓ Generating static pages (11/11)` and the summary
listing `/`, `/about`, `/projects`, `/projects/[id]` (×4), `/experience`, `/contact`.
On success, `https://<project>.pages.dev` serves the site. If you see
`Error: Output directory "dist" not found`, the output directory was not updated.

### 3.6 Custom domains (nzamuwe.com) — DNS is already on Cloudflare

1. Pages project → **Custom domains → Set up a custom domain** → `nzamuwe.com` → Continue.
   Because the zone is on Cloudflare, it auto-creates the apex record (CNAME flattened
   to `<project>.pages.dev`) and provisions the TLS certificate — no manual DNS.
2. Repeat for `www.nzamuwe.com`. The shipped `public/_redirects` sends `www → apex`
   with a 301.
3. **Do not touch your Zoho Mail records.** The MX records (`mx1.zoho.com`, …), the
   `zoho` verification TXT, SPF TXT, and the DKIM CNAME must stay exactly as they are.
   The apex CNAME for Pages coexists with MX — that is normal and safe. If you ever
   see mail delivery issues after DNS edits, re-check SPF/DKIM/DMARC in the Zoho admin
   first.

### 3.7 Contact form backend (optional, ~5 minutes, recommended)

The form posts to `/api/contact`, a Cloudflare Pages Function that deploys automatically
from `functions/api/contact.ts`. To actually deliver mail:
1. Create a free [resend.com](https://resend.com) account, verify `nzamuwe.com`
   (add the DKIM/SPF records Resend shows — they coexist with Zoho's), generate an API key.
2. Pages → Settings → **Environment variables** → add encrypted `RESEND_API_KEY`.
3. Until the key exists the API answers **503 with an honest message** and the form
   shows a prefilled `mailto:` fallback — the conversion path never dead-ends.
   The 200/400/405/429/502/503 contract is proven by `tests/contact-api.test.ts`.

## 4. Verify after deploying (30 minutes)

Fast gates first:

```bash
curl -s https://nzamuwe.com/robots.txt        # sitemap + AI crawler rules
curl -s https://nzamuwe.com/sitemap.xml       # 10 absolute URLs, all /… routes
curl -sI https://www.nzamuwe.com/ | head -3   # expect 301 → https://nzamuwe.com/
curl -s https://nzamuwe.com/ | grep -c "ROC-AUC 0.869"          # ≥1 → prerendered
curl -s https://nzamuwe.com/about | grep -c "About Prince Nzamuwe"  # ≥1 → routes work
curl -s -o /dev/null -w "%{http_code}\n" https://nzamuwe.com/projects/credio    # 200
curl -s -X POST https://nzamuwe.com/api/contact -H "Content-Type: application/json" \
  -d '{"name":"T","email":"t@x.io","message":"hello hello hello hello"}'        # 200 or 503 + fallback copy
curl -sI https://nzamuwe.com/ | grep -i strict-transport         # security headers live
```

Then:
1. **Google Search Console**: add property `nzamuwe.com` (DNS TXT verification via
   Cloudflare), submit `https://nzamuwe.com/sitemap.xml`, request indexing for `/`.
   Do the same in **Bing Webmaster Tools** (it can import from GSC). This is what puts
   the site in the race for "data scientist Kenya"–type queries — see §6.6 for the
   honest picture of what rankings take.
2. **Plausible**: the site ships `data-domain="nzamuwe.com"`. Create/confirm your
   Plausible site, then create goals for the custom events: `resume-download`,
   `hire-me`, `copy-email`, `contact-open`, `email-hero`, `code-credio`,
   `demo-credio`, `case-study-*`. CV4 (real conversion outcomes) flips from
   *unverified* to *verified* only after this data accumulates.

## 5. Dependency notes (read after your first `npm ci`)

- Production dependencies: **0 known vulnerabilities** (that is what audit check T7
  measures, via `npm audit --omit=dev`).
- `npm ci` may still print `5 high severity vulnerabilities`. All five sit in the
  **dev-only** ESLint toolchain (`eslint-config-next → fast-glob → micromatch → braces`,
  a build-time glob DoS with no patched release upstream as of Oct 2026). They never
  ship to the site and cannot affect visitors. Track it: bump `eslint-config-next`
  when the advisory clears.
- The two **critical** findings your earlier run reported lived in `vitest ≤ 4`
  (tinypool RCE gadget) and are fixed by the `vitest@5` upgrade already in this repo.

## 6. Platform strategy — your questions, answered

### 6.1 Northflank for Credio (yes — do this)

The free **Developer Sandbox** gives *always-on* compute: 2 free services, 1 free
database addon, 2 cron jobs. No sleeping, unlike free Streamlit Cloud. That fixes the
"demo cold-starts after minutes of idling" problem permanently, and `credio.nzamuwe.com`
looks far stronger than `*.streamlit.app`.

1. In the Credio repo, add a `Dockerfile`:
   ```dockerfile
   FROM python:3.12-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   COPY . .
   EXPOSE 8501
   CMD ["streamlit", "run", "app.py", "--server.port", "8501", "--server.address", "0.0.0.0"]
   ```
   (plus a `.dockerignore` with `.git`, `venv`, `__pycache__`, `reports/`).
2. Northflank → **Create service → Deploy from Git** → pick the repo → build type
   **Dockerfile** → port **8501, HTTP** → health check path `/`.
3. When it's green: service → **Ports → TLS / custom domain** → add
   `credio.nzamuwe.com`; Northflank gives you a CNAME target. Add that CNAME in
   Cloudflare DNS. If certificate issuance stalls behind the Cloudflare proxy, set the
   record to **DNS-only** (grey cloud) until the cert is issued.
4. Update `portfolio.ts`: `credio: "https://credio.nzamuwe.com/"` and the Credio
   project's `demo`. Keep the Streamlit URL as a fallback comment until the new one is verified.
5. Update the model card/readme note in `docs/claims-evidence.md` (demo row) after the move.

Free-sandbox realism: it fits one always-on demo service. If you later need a second
always-on service (say, a DukaPulse API), the second free slot is there — after that
it's pay-as-you-go per second of consumption.

### 6.2 Tencent RTC (free tier: 10,000 minutes/month for a year)

Honest answer: TRTC does not fit a data-science portfolio today, and bolting a video
call widget onto this site would be gimmicky. There is exactly one use where it earns
its place: a future **real-time voice agent** demo — TRTC (or its Conversational AI
engine) feeding speech-to-text → an LLM → text-to-speech, deployed on Northflank. That
is a genuinely hot 2026 portfolio piece for someone marketing ML + backend skills. Build
it only when you have a focused weekend for it; a half-working voice demo is worse
than none. Until then: let the free minutes sit unused, they cost you nothing.

### 6.3 GitHub Student Pack (expires Nov 2027)

Still worth using (note: the DigitalOcean $200-credit offer **ended 31 Jul 2026** —
don't count on it):
- **GitHub Copilot (student tier)** — free; use it for DukaPulse velocity, review everything it writes.
- **JetBrains IDEs** — PyCharm Professional for Credio/DukaPulse work.
- **MongoDB Atlas / Azure offers** — if a future project needs a managed DB that isn't PostgreSQL-on-Northflank.
- **Namecheap / .tech domain offers** — demo domains for hackweek projects, not for your name brand (nzamuwe.com is yours).

### 6.4 FinAccess `.pbix` — publish the live view, link out, don't iframe

You do not need to "host" the .pbix anywhere — Power BI Desktop files aren't web
artifacts. The real choice is how the live report reaches recruiters:

- **Recommended: Power BI Service → Publish to web → public URL → paste into
  `PROJECTS[finaccess].demo`.** The site then shows a "Live demo" button that opens
  the interactive report in a new tab. The underlying survey is public (CBK · KNBS ·
  FSD Kenya), so publish-to-web's "anyone with the link" model is fine here.
- Why link out instead of embedding the report in an iframe on nzamuwe.com: the
  publish-to-web iframe is slow to paint, brittle inside CSPs (`_headers` sets
  `frame-ancestors 'none'`, which you'd have to weaken), and Microsoft can change or
  revoke the embed model. A button keeps your page fast (no third-party JS on load),
  keeps the security headers strict, and Plausible still tracks the click
  (`data-pla="demo-finaccess"`). Keep the repo README's screenshots as the
  always-works fallback.
- If you later want an on-site interactive version, the higher-signal move is a small
  Plotly/Streamlit rebuild of two key visuals on Northflank — it shows engineering,
  not just BI-tool fluency.

### 6.5 Convex or Supabase? No — and that's the right answer

This site needs zero user accounts, zero dynamic data, and zero uploads. Static export
+ one edge function is the *correct* architecture: nothing to keep alive, nothing to
patch, nothing to pay for. Recruiters read "no database, no CMS, no secrets" as
restraint, not as a gap. Reach for Supabase (Postgres + auth + storage, generous free
tier) when a *project* genuinely needs a backend — e.g. if DukaPulse grows multi-user
demo accounts, or a future app needs uploads. Convex fits realtime-collab-style apps.
Don't add either to the portfolio itself.

### 6.6 The honest picture on "hard to ignore" SEO

The site now has the controllables maxed: per-page titles/descriptions targeting
"data scientist Kenya / ML engineer Nairobi" phrasing, Person schema with
Nairobi/address + `knowsAbout`, sitemap with every route, prerendered copy, fast
pages, clean internal links. What rankings additionally take, and no audit can
guarantee: time (weeks, not days), and a handful of inbound links. Fastest legitimate
wins: link nzamuwe.com from your GitHub profile README and LinkedIn; publish one
write-up of the FinAccess county-gap finding on dev.to/LinkedIn and link back; keep
the GitHub commit streak visible. Submit the sitemap in GSC the day you deploy.

## 7. What changed vs the vly build

| Audit ID | Issue | Fixed by |
|----------|-------|----------|
| C1 | 3 project "Code" buttons → `github.com/example/*` (404) | Real repos: credit-risk-scorecard, finaccess-kenya-dashboard, AirBnB_clone_v4 |
| C2 | Plausible `data-domain="localhost"` (zero data since launch) | `data-domain="nzamuwe.com"`, server-rendered `<script defer>` |
| C3/C4 | robots.txt + sitemap.xml pointed at a placeholder domain | Corrected files in `public/` |
| C5 | Relative og:url / og:image | Absolute URLs via `metadataBase` |
| C6 | "Senior Data Scientist 2022–present" vs student timeline | Honest timeline, no invented employers |
| C7 | Stock-avatar testimonials | Removed entirely |
| H1/H2 | No structured data; SPA shell | JSON-LD graph + full static prerender on **9 routes** |
| H3/H4 | Fake view counts; empty Blog | Blog removed until real posts exist |
| H5 | Unverifiable synthetic projects | Only demo-able / open-source projects remain |
| H6 | Dead `#` links, missing legal pages | 0 `href="#"`; privacy note in footer |
| M1 | "Python 95%" percentage bars | Evidence-linked skills with proof links |
| M3/L2 | /auth indexed; favicon on convex.cloud | /auth gone; favicon served from the domain |
| L3 | Generic tagline | Proof-first headline + name-first title with Nairobi, Kenya |
| L5 | Booking widget as first CTA | Recruiter-first CTAs; consulting demoted |
| — | vly.ai builder fingerprints | All removed (bundle is 100% yours) |
| — | `/#hash` navigation (your report) | Real routes with per-page metadata + case-study pages |

## 8. Project structure

```
src/
  app/              layout.tsx (metadata + JSON-LD + Plausible)
    page.tsx        home: hero, stat band, 4 project cards, contact band
    about/          /about: story + skills + coursework
    projects/       /projects index + /projects/[id] case studies (build-time)
    experience/     /experience: timeline + education + certifications
    contact/        /contact: form + channels
    not-found.tsx   custom 404 (out/404.html)
  components/
    site/           header (active-route nav), page-shell, footer, project-card,
                    contact-form, roc-panel, role-rotator, count-up, …
    ui/             button, badge, separator (shadcn/ui)
  lib/
    portfolio.ts    ← ALL site content lives here — edit this file first
functions/
  api/contact.ts    Cloudflare Pages Function (validated contact endpoint)
tests/              vitest: API matrix, content integrity + tone, SEO guards
scripts/
  audit.mjs         reproducible 6-dimension scoring harness (crawls all pages)
public/             og-image.png, favicon.png, robots.txt, sitemap.xml, resume.pdf, _headers
docs/               qa-checklist.md, claims-evidence.md (every number → source + command)
tools/              make_resume.py, make_favicon.py (asset regenerators)
```

**Stack:** Next.js 16 (App Router, static export) · TypeScript (strict) · Tailwind CSS 4 ·
shadcn/ui · next-themes · Plausible Analytics · Cloudflare Pages Functions (contact only) ·
vitest 5. No database, no CMS, no secrets in the repo — nothing to maintain beyond content.
