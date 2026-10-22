# Font Inventory & Delivery Analysis

**Document**: `FONT_INVENTORY.md`  
**Date**: 2026-10-22  
**Target Repository**: `d:\Clones\Transit\nzamuwe-rebuild`  
**Status**: [verified — source code inspection & production build analysis]  
**Purpose**: Input baseline for Sprint 1 (Mobile LCP Optimization).

---

## 1. Executive Summary

1. **Self-Hosted Delivery (Zero Third-Party CDNs)**:
   - There are **ZERO** external font network requests (no Google Fonts API, no Fontshare CDN, no Adobe Typekit).
   - All fonts are compiled, hashed, and self-hosted locally by Next.js under `/_next/static/media/` [verified — `out/_next/static/media/`].
2. **The Identity Font**:
   - **Satoshi** (`Satoshi-Variable.woff2`) is the site's sole typographic identity font, providing geometric precision and structural weight to all `h1`, `h2`, and `h3` headings [verified — `src/app/globals.css L174`].
   - It is loaded via `next/font/local` with variable weight `300 900` and `font-display: swap` [verified — `src/app/layout.tsx L8-L14`].
3. **The Supporting System Fonts**:
   - **Geist Sans**: Variable weight `100 900`, body and UI typography (`--font-geist-sans`).
   - **Geist Mono**: Variable weight `100 900`, metric chips, code snippets, tags, dates (`--font-geist-mono`).
4. **Active Font Requests on First Paint**:
   - Exactly **3 WOFF2 font files** are preloaded via `<link rel="preload" as="font" type="font/woff2" crossorigin="">` in `<head>` [verified — `out/index.html L1`].
   - Total preloaded font payload across the wire: **77,144 bytes (~77.1 KB)** [verified — `out/_next/static/media/`].

---

## 2. Complete Font Face Roster

| Font Family | Role / Elements | Weight Range | Source | Physical File in `out/` | File Size | Preloaded in `<head>` | `font-display` | Subsetting Status |
|---|---|:---:|---|---|:---:|:---:|:---:|---|
| **Satoshi** *(Identity Font)* | Headings (`h1`, `h2`, `h3`) | `300 900` (Variable) | `next/font/local` (`src/fonts/Satoshi-Variable.woff2`) | `Satoshi_Variable-s.p.2hc6iddu2ejw7.woff2` | **24,748 B** (24.2 KB) | **YES** (`preload: true`) | `swap` | Full Latin Variable (Unsubsetted) |
| **Geist Sans** | Body copy, navigation, buttons | `100 900` (Variable) | `next/font/google` (`Geist`) | `caa3a2e1cccd8315-s.p.0wgildi0cnwt9.woff2` | **29,288 B** (28.6 KB) | **YES** (Next.js auto-preload) | `swap` | Latin subset (`subsets: ["latin"]`) |
| **Geist Mono** | Stat values, metrics, metadata chips | `100 900` (Variable) | `next/font/google` (`Geist_Mono`) | `797e433ab948586e-s.p.0r6juujl39pe6.woff2` | **23,108 B** (22.6 KB) | **YES** (Next.js auto-preload) | `swap` | Latin subset (`subsets: ["latin"]`) |

### Non-Preloaded Supporting Glyph Sets
Next.js emits `@font-face` rules for non-Latin unicode ranges (Cyrillic, Greek, Vietnamese), but these are **not** preloaded and are **never** requested on English page loads:
* `4fa387ec64143e14...woff2` (Geist Mono Cyrillic, 12.9 KB) — unrequested.
* `53b9e256198e5412...woff2` (Geist Vietnamese, 8.0 KB) — unrequested.
* `5ce348bf30bf5439...woff2` (Geist Mono Cyrillic-Ext, 6.2 KB) — unrequested.
* `6306c77e7c8268e4...woff2` (Geist Mono Box-Drawing, 5.9 KB) — unrequested.
* `7178b3e590c64307...woff2` (Geist Latin-Ext, 16.5 KB) — unrequested.
* `7d817b4c03b0c5f1...woff2` (Geist Mono Vietnamese, 7.7 KB) — unrequested.
* `8a480f0b521d4e75...woff2` (Geist Cyrillic, 14.9 KB) — unrequested.
* `bbc41e54d2fcbd21...woff2` (Geist Mono Latin-Ext, 14.7 KB) — unrequested.
* `fef07dbb0973bf53...woff2` (Geist Cyrillic-Ext, 7.3 KB) — unrequested.

---

## 3. Render-Blocking & Critical Path Analysis

* **Render-Blocking CSS**:
  - The site includes **one** compiled critical stylesheet: `/_next/static/chunks/1d67e1g-e8d9g.css` (`15.4 KB` Brotli / `82.9 KB` raw) [verified — `out/index.html`].
  - All `@font-face` rules and fallback metrics (`ascent-override`, `descent-override`, `size-adjust`) are inlined inside this single CSS chunk.
  - There is **zero external render-blocking font CSS**.
* **Preload Competition on Throttled 4G**:
  - In `<head>`, three fonts are preloaded in parallel:
    ```html
    <link rel="preload" href="/_next/static/media/797e433ab948586e-s.p.0r6juujl39pe6.woff2" as="font" crossorigin="" type="font/woff2"/>
    <link rel="preload" href="/_next/static/media/Satoshi_Variable-s.p.2hc6iddu2ejw7.woff2" as="font" crossorigin="" type="font/woff2"/>
    <link rel="preload" href="/_next/static/media/caa3a2e1cccd8315-s.p.0wgildi0cnwt9.woff2" as="font" crossorigin="" type="font/woff2"/>
    ```
  - Total wire transfer for fonts: **77.1 KB**.
  - At the mobile 4G throttled rate ($1,638.4\text{ Kbps} = 204.8\text{ KB/s}$), downloading 77.1 KB of fonts plus 15.4 KB of CSS plus 19.2 KB of HTML consumes $\sim 550\text{ms}$ of pure wire-time, multiplexed across HTTP/2 or HTTP/3 streams.

---

## 4. Reconciliation of "3-Font display:swap Overhead"

* **The Prior Claim**: Gate Review #3 claimed that `font-display: swap` on 3 webfonts caused a 5.2s–5.7s LCP delay.
* **The Reality Check**:
  1. Under `font-display: swap`, browsers paint the text immediately using the local `@font-face Fallback` (Arial with `size-adjust` metrics) if the font is not ready at FCP.
  2. The actual FCP on the deployed Brotli CDN is **1.19s–1.23s**.
  3. However, Lighthouse's LCP metric is recorded when the **final font glyphs of the largest text block** paint. Because the `h1` element is styled with `var(--font-heading)` (`satoshi`), the browser swaps from `satoshi Fallback` to `satoshi` when `Satoshi_Variable.woff2` finishes loading.
  4. Under simulated 4G latency (150ms roundtrip delay per chunk), this font swap arrives after the fallback paint.
  5. Crucially: `Satoshi-Variable.woff2` is **24.7 KB**. It is not bloated. It is already preloaded.
  6. The 3-font payload is lean (77 KB total for 3 variable fonts), but multiplexed download contention on mobile connections delays Satoshi's arrival relative to FCP.

---

## 5. Directives for Sprint 1

1. **Identity Protection**: Satoshi **MUST** remain the identity font for `h1, h2, h3`. `display: optional` is strictly forbidden because it drops the identity font for first-time mobile visitors, capping Typography below the $\ge 9.5$ target.
2. **Subsetting Opportunity**: `Satoshi-Variable.woff2` currently ships the full Latin character set (24.7 KB). Subsetting it to the specific Latin glyphs used across the site's headings can reduce its weight from 24.7 KB down to $\sim 8\text{ KB}–12\text{ KB}$.
3. **Preload Prioritization**: Ensure `Satoshi_Variable.woff2` has the highest font fetch priority in `<head>`, ahead of `Geist Mono` (which is only used below the fold on metric chips).
