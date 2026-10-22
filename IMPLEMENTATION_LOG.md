# Implementation Log — Audit Fixes

| ID | Status | Files Changed | Deviations from Report / Notes |
|---|---|---|---|
| Q-01 | DONE | src/app/page.tsx | None. Replaced hardcoded hero breakpoint jumps with clamp(2rem,4.5vw+0.5rem,3.5rem) leading-[1.08] tracking-[-0.025em]. |
| Q-02 | DONE | src/app/globals.css | None. Increased reveal-view translateY from 28px to 48px, removed 0.985 scale, widened animation range to entry 55%. Prefers-reduced-motion guard preserved. |
| Q-03 | DONE | src/app/page.tsx, src/components/site/project-card.tsx, src/app/about/page.tsx | None. Added CSS animationDelay stagger (i * 80ms) to stat band items, project cards, and skills grid. |
| Q-04 | DONE | src/components/site/hero-roc-bg.tsx, src/app/page.tsx, src/components/site/roc-panel.tsx | None. Delivered Concept 1: created HeroRocBg with full-hero SVG backdrop, reused existing roc-line and roc-fill CSS animations, adjusted RocPanel delay to 400ms. Prefers-reduced-motion respected. |
| Q-05 | DONE | src/lib/portfolio.ts | None. Increased project accent gradient opacities from 10/5 to 20/10/15 for clear visual differentiation between projects. |
| Q-06 | DONE | src/app/about/page.tsx | None. Constrained About narrative text to 65ch via max-w-prose for optimal line reading length. |
| Q-07 | DONE | src/components/ui/button.tsx | None. Replaced transition-all with explicit property list transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-150. |
| Q-08 | DONE | src/components/ui/button.tsx | Added active:scale-[0.98] with motion-reduce:transform-none for button press micro-interaction with reduced-motion protection. |
| Q-09 | DONE | src/app/globals.css | Added @view-transition { navigation: auto; } at top-level with prefers-reduced-motion disablement. Build passed. |
| F-01 | DONE | src/app/layout.tsx, src/app/globals.css | Path taken: local file src/fonts/Satoshi-Variable.woff2 loaded via next/font/local (weight 300 900, display swap). Applied --font-heading to h1–h3 in @layer base. Geist retained for body, Geist Mono for metric chips. |
| F-02 | DONE | src/app/page.tsx | None. Verified clamp(2rem,4.5vw+0.5rem,3.5rem) on hero h1 eliminating 43% snap at sm breakpoint (implemented in Q-01). |
| F-03 | DONE | src/components/site/section-heading.tsx, src/app/page.tsx | None. Added size prop ('small', 'default', 'large') to SectionHeading to introduce typographic hierarchy; applied size="large" to featured projects heading. |
| F-04 | DONE | src/app/about/page.tsx | None. Verified max-w-prose (65ch) constraint on About page narrative text (implemented in Q-06). |
| F-05 | DONE | src/app/page.tsx, src/app/about/page.tsx, src/app/contact/page.tsx, src/app/experience/page.tsx, src/app/projects/page.tsx | None. Standardized section padding to two deliberate tiers: py-20 sm:py-28 for major sections and py-10 sm:py-14 for bands. |
| F-06 | DONE | src/lib/portfolio.ts, src/components/site/project-card.tsx | Override applied: implemented per-project accent colors via accentSolid tokens in portfolio.ts and applied border-l-4 ${project.accentSolid} to project card headers. |
| F-07 | DONE | src/app/globals.css, src/app/projects/[id]/page.tsx | None. Added section[id], [id] scroll-margin-top: 4.5rem rule and added id attributes (#problem, #approach, #results, #stack) to project case study write-up sections. |
| F-08 | DONE | src/app/globals.css | Verified dark flash behavior: :root:not(.light) within @media (prefers-color-scheme: dark) ensures no dark flash for OS-dark + site-light users because next-themes applies .light synchronously via blocking head script prior to initial paint. |
| F-09 | DONE | src/components/ui/button.tsx | None. Verified explicit property transition list on Button CVA base avoiding layout thrashing from transition-all (implemented in Q-07/Q-08). |
| F-10 | DONE | src/app/globals.css | None. Verified visible scroll reveal-view with 48px translateY and entry 55% range with prefers-reduced-motion protection (implemented in Q-02). |
| F-11 | DONE | src/app/page.tsx, src/components/site/project-card.tsx, src/app/about/page.tsx | None. Verified 80ms animationDelay stagger across stat band items, project cards, and skills grid (implemented in Q-03). |
