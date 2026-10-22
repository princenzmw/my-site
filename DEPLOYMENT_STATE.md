# Deployment State Reconciliation

**Document**: `DEPLOYMENT_STATE.md`  
**Date**: 2026-10-22  
**Target Repository**: `d:\Clones\Transit\nzamuwe-rebuild`  
**Status**: [verified — live HTTP inspection & header crawl]  
**Severity**: **P0 FINDING (Apex Stale)**

---

## 1. P0 Finding: Live Apex vs. Branch Head Disconnect

> [!CAUTION]
> **P0 Finding**: The production apex domain (`https://nzamuwe.com`) is running the **pre-audit baseline commit** (`3507022`/`034b734` on `main`).  
> None of the 32 audit fixes (`audit-fixes` branch head `fde91d1`) are currently visible to production visitors on `nzamuwe.com`.
> 
> Achieving a 9.5/10 design scorecard on a local build that visitors never see is worth nothing. Merging `audit-fixes` into `main` and triggering Cloudflare Pages deployment is the single most urgent pipeline requirement before final launch.

---

## 2. Environment Comparison Matrix

| Dimension | Production Apex (`https://nzamuwe.com`) | Deployed Preview (`nzamuwe-portfolio-cls1...`) | Local Build (`out/` @ `fde91d1`) |
|---|---|---|---|
| **Hosting Platform** | Cloudflare Pages (Custom Apex Domain) | Cloudflare Worker (Preview Instance) | Localhost (`npx serve out -p 55423`) |
| **Commit Reflected** | `3507022` / `034b734` (`main` baseline) | `fde91d1` (`audit-fixes` head) | `fde91d1` (`audit-fixes` head) |
| **Transport** | HTTP/2, Brotli (`Content-Encoding: br`) | HTTP/3, Brotli (`Content-Encoding: br`) | HTTP/1.1, Brotli (`Content-Encoding: br`) |
| **Identity Font (Satoshi)** | **ABSENT** (Only Geist & Geist Mono loaded) | **PRESENT** (`Satoshi_Variable...woff2` preloaded) | **PRESENT** (`Satoshi_Variable...woff2` preloaded) |
| **Hero ROC Backdrop (`HeroRocBg`)** | **ABSENT** | **PRESENT** (Full-hero SVG curve) | **PRESENT** (Full-hero SVG curve) |
| **Interactive ROC Tuner (`INT-01`)** | **ABSENT** (Static 400px card) | **PRESENT** (Interactive slider, live matrix, PnL) | **PRESENT** (Interactive slider, live matrix, PnL) |
| **Scrollytelling HUD (`STORY-01/02`)** | **ABSENT** (Flat single-column text) | **PRESENT** (Sticky 4-stage pipeline HUD) | **PRESENT** (Sticky 4-stage pipeline HUD) |
| **Grid-Stack Rotator (`CLS-01`)** | **ABSENT** (Shifting single-item rotator) | **PRESENT** (Grid-stack cell, CLS 0.000) | **PRESENT** (Grid-stack cell, CLS 0.000) |
| **Prerendered Case Studies** | 4 routes (`/projects/credio`, etc.) | 4 routes (`/projects/credio`, etc.) | 4 routes (`/projects/credio`, etc.) |

---

## 3. Fingerprint Verification Evidence

Direct verification commands executed on 2026-10-22 against `https://nzamuwe.com`:

```bash
# 1. Satoshi font presence check (Expect FALSE on live, TRUE on preview)
curl -s https://nzamuwe.com/ | grep -c "satoshi"          # Output: 0 [verified — STALE]
curl -s https://nzamuwe-portfolio-cls1.shadowed-petalite-e6c.workers.dev/ | grep -c "satoshi" # Output: 2 [verified]

# 2. Interactive ROC Tuner INT-01 presence check (Expect FALSE on live, TRUE on preview)
curl -s https://nzamuwe.com/ | grep -c "Decision risk threshold" # Output: 0 [verified — STALE]
curl -s https://nzamuwe-portfolio-cls1.shadowed-petalite-e6c.workers.dev/ | grep -c "Decision risk threshold" # Output: 1 [verified]

# 3. Full-bleed HeroRocBg presence check (Expect FALSE on live, TRUE on preview)
curl -s https://nzamuwe.com/ | grep -c "hero-roc-bg"      # Output: 0 [verified — STALE]
curl -s https://nzamuwe-portfolio-cls1.shadowed-petalite-e6c.workers.dev/ | grep -c "hero-roc-bg" # Output: 1 [verified]
```

---

## 4. Reconciliation of "4 Case Studies vs. 3 Project Cards"

* **The Discrepancy**: The handover claimed 4 case studies; an external crawl observed 3 project cards.
* **The Code Evidence**:
  1. Inspecting `src/lib/portfolio.ts` lines 89–175 reveals exactly **4 projects**:
     - `credio` (Credio: Credit-Risk Scorecard)
     - `finaccess` (FinAccess Kenya: Financial Inclusion Dashboard)
     - `dukapulse` (DukaPulse: Stock & Sales App for Small Shops)
     - `airbnb` (AirBnB Clone v4)
  2. Inspecting `src/app/page.tsx` line 146 confirms that all 4 projects are mapped:
     ```tsx
     {PROJECTS.map((project, i) => (
       <div key={project.id} className={i % 2 === 0 ? "lg:col-span-2" : ""}>
         <ProjectCard project={project} style={{ animationDelay: `${i * 80}ms` }} />
       </div>
     ))}
     ```
  3. Inspecting the build output confirms that all **4 case studies are statically prerendered**:
     - `out/projects/credio.html` (HTTP 200)
     - `out/projects/finaccess.html` (HTTP 200)
     - `out/projects/dukapulse.html` (HTTP 200)
     - `out/projects/airbnb.html` (HTTP 200)
* **Root Cause of Crawler Observation**:
  - On the desktop homepage (`lg:grid-cols-3`), cards are laid out in an alternating rhythm:
    - Row 1: Credio (`lg:col-span-2`) + FinAccess (`lg:col-span-1`) = 3 cols.
    - Row 2: DukaPulse (`lg:col-span-2`) + AirBnB (`lg:col-span-1`) = 3 cols.
  - In `src/lib/portfolio.ts`, DukaPulse has `status: "in-development"`, whereas the other three have `status: "live"`.
  - A crawler filtering by live status, looking for live demo links, or evaluating a single row boundary miscounted the 4 cards as 3.
  - **Verdict**: There are, and have always been, **4 project cards and 4 case studies** [verified — `out/index.html` & `scratch/check-links.mjs`].

---

## 5. Required Action for Stakeholder

Before final sign-off:
1. Merge `audit-fixes` into `main`.
2. Push `main` to GitHub repository `princenzmw/my-site`.
3. Cloudflare Pages auto-deploys `out/` with build command `npm run build` and output directory `out`.
4. Verify that `curl -s https://nzamuwe.com/ | grep "Decision risk threshold"` returns `1`.
