# 8.0 Certification Checklist — nzamuwe.com

Run this after each wave. A dimension is "certified 8.0" only when every one of its
checks passes with the evidence listed. Budget 30 minutes for a full pass.

## 1. SEO & Discoverability (target 8.0)

- [ ] `curl https://nzamuwe.com/robots.txt` shows `Sitemap: https://nzamuwe.com/sitemap.xml` and `Disallow: /auth`
- [ ] `curl https://nzamuwe.com/sitemap.xml` returns only absolute `https://nzamuwe.com/...` URLs, lastmod ≤ 7 days old
- [ ] `curl -sI https://www.nzamuwe.com/` returns 301 → `https://nzamuwe.com/` (Cloudflare redirect rule live)
- [ ] `<link rel="canonical">` present and absolute (view-source check)
- [ ] JSON-LD validates: paste the script block into validator.schema.org — 0 errors
- [ ] Google Search Console: property verified for nzamuwe.com, sitemap submitted, "URL inspection → Test live URL" returns "URL is available to Google"
- [ ] Bing Webmaster Tools: site imported from GSC
- [ ] Search `"Prince Nzamuwe" data scientist` → the site appears on page 1 (allow 1–2 weeks after indexing)
- [ ] Each project has a permalink page (`/projects/...`) that returns real content
- [ ] Prerendered/SSG check: `curl` the homepage HTML and confirm project text is present WITHOUT JavaScript (this is the H2 gate — until this passes, cap SEO at 6.5)

## 2. Technical Health (target 8.0)

- [ ] `curl -sI https://nzamuwe.com/ | grep -i strict-transport` → HSTS header present
- [ ] `curl -sI https://nzamuwe.com/ | grep -i content-security` → CSP header present (start `Content-Security-Policy-Report-Only` for one week, then enforce)
- [ ] Plausible dashboard for domain `nzamuwe.com` records your own visit (was 0 events since launch)
- [ ] `curl -sI https://nzamuwe.com/resume.pdf` returns `content-type: application/pdf` — NOT text/html
- [ ] Favicon loads from `https://nzamuwe.com/favicon.png` (not convex.cloud)
- [ ] Browser console on homepage: 0 errors; no stray `*.convex.cloud` fetches other than the app's own backend
- [ ] Lighthouse (mobile, normal browsing profile): Performance ≥ 85, Best-Practices ≥ 95, SEO ≥ 95
- [ ] `/auth` either removed or returns 404/redirect for anonymous visitors
- [ ] www→apex redirect active (same as SEO check above)

## 3. Recruiter Trust (target 8.0)

- [ ] Every "Code" button on every project card opens a real repository owned by you (0 × `github.com/example`)
- [ ] Every demo link opens a working app (credio.streamlit.app + FinAccess published view)
- [ ] No employer names anywhere that you cannot prove; timeline contains no contradiction (grep the page source for "TechCorp", "DataFlow", "5+ years")
- [ ] No testimonials with stock photos; policy A (one real quote) or B (removed) applied
- [ ] No fake view counts anywhere (grep for "views" in the rendered page)
- [ ] Site name matches GitHub/LinkedIn name exactly ("Prince Nzamuwe")
- [ ] resume.pdf downloads as a real PDF and its employment claims match the site exactly
- [ ] A stranger test: ask one friend to find your GitHub from the site in under 30 seconds

## 4. Content & Messaging (target 8.0)

- [ ] Hero states role + proof in one screen (no "Turning data into actionable insights" generic tagline as the main line)
- [ ] Every project card has Problem / Approach / Result with at least one real number (0.869 AUC; 19,750 adults; 1.1%→39.0% bands)
- [ ] Every claim on the site traces to a repo, a screenshot, or the résumé
- [ ] About section is first-person and names the current program + expected graduation year
- [ ] Skills grid links every row to evidence (no percentage bars anywhere)
- [ ] Blog: either hidden or ≥ 1 real post on a permalink with no view counters

## 5. Conversion Elements (target 8.0)

- [ ] Above the fold: primary CTA "View projects" + secondary "Download résumé" — booking/price NOT the first action
- [ ] Contact path: email link visible without scrolling past projects
- [ ] Every interactive element does something: 0 dead buttons, 0 `#` links (grep rendered HTML for `href="#"` excluding in-page anchors)
- [ ] Résumé download works in incognito and on mobile
- [ ] Recruiter path (view → projects → GitHub → email) takes ≤ 3 clicks; consultant path (footer link → booking) still exists

## 6. Design & UX (target 7.5 → 8.0)

- [ ] All project card images are real product screenshots (0 generic Unsplash tech photos in project/blog contexts)
- [ ] Mobile (390px): no horizontal scroll; hero CTA pair stacks cleanly; project screenshots readable
- [ ] Dark mode: newly added screenshots/grid render correctly in both themes
- [ ] LCP on mobile ≤ 2.5 s on a mid-range phone profile (Chrome DevTools throttling)
- [ ] Focus states visible when tabbing through nav and CTAs (keyboard pass)
- [ ] OG preview renders correctly in LinkedIn Post Inspector and socialsharepreview.com

## Re-certification routine (repeat monthly)

1. Run every unchecked box above top-to-bottom (30 min)
2. Plausible: confirm events are flowing and note top referrers (are recruiters arriving from LinkedIn?)
3. Search Console: impressions/clicks trend for your name queries
4. Re-run the original audit scorecard; log the new per-dimension scores
