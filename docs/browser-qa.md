# Browser QA record — 2026-10-19

Environment: static build (`out/`) served with `npx serve out -l 4173` — the
exact artifact Cloudflare Pages would deploy, not the dev server.
Tool: agent-browser (headless Chromium). Screenshots in `docs/qa-screens/`.

## Run log

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Desktop 1280×900 renders, no error boundary | PASS | `desktop-1280-light.png` |
| 2 | Horizontal overflow: `scrollWidth - innerWidth` | **0 px** | eval output |
| 3 | Exactly one `<h1>`; 7 landmark sections | PASS | eval output |
| 4 | First Tab focuses "Skip to content" with **visible 2px solid outline (2px offset)** | PASS | `keyboard-focus.png` |
| 5 | Enter on skip link jumps to `#main` past the nav | PASS | eval output |
| 6 | Tab order continues through CTAs (Download résumé…) | PASS | eval output |
| 7 | Empty/invalid form submit → 3 per-field helpful errors + banner | PASS | `form-errors.png` |
| 8 | Valid submit on static preview (no API) → honest banner + **prefilled mailto fallback link** | PASS | `form-fallback.png` |
| 9 | Mobile 390×844: overflow **0 px**, headline not clipped | PASS | `mobile-390-light.png` |
| 10 | Mobile menu opens (aria-expanded), all 5 nav links present, 44px targets | PASS | `mobile-menu.png` |
| 11 | Menu → Contact navigates to `/#contact`, section in view | PASS | eval output |
| 12 | Theme cycle: system → light → dark; `html.dark` + background recomputed | PASS | `dark-mode.png` |
| 13 | `/nonexistent-page` → custom 404: "This page doesn't exist" + 3 recovery links, `noindex` | PASS | `404-page.png` |
| 14 | Page errors across entire session (all interactions) | **0** | agent-browser `errors` |
| 15 | Console errors (excluding expected Plausible "Ignoring Event: localhost") | **0** | agent-browser `console` |

## Notes

- The single console note, `Ignoring Event: localhost`, is Plausible declining
  custom events from a non-production domain — proof the event wiring fires.
  On nzamuwe.com the same events register normally.
- The form's failure path was deliberately exercised in a state that
  production won't hit (static preview without the Pages Function). It
  degraded exactly as designed: honest message + the key action stays
  completable via the prefilled email link.
- Keyboard test sequence used real `Tab`/`Enter` key presses, not synthetic
  focus, so the recorded outline styles are what a keyboard user sees.
