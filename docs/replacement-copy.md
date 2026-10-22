# nzamuwe.com — Replacement Copy Pack

Paste-ready text for every section the audit flagged. Anything in `[SQUARE BRACKETS]`
needs your confirmation — never publish a bracket you have not verified.
Written for the goal you set: **getting hired**. Consulting is still offered, but secondary.

---

## 1. Hero section (replaces the current tagline hero)

**Headline (primary recommendation):**

> Data scientist who ships models on real data — not toy datasets.

**Alternative headlines (pick one):**
- I build credit-risk models and decision dashboards that hold up in production.
- From raw survey data to decisions: machine learning, Python, and Power BI.
- Prince Nzamuwe — Data Scientist & Software Engineer in Nairobi.

**Subheadline:**

> I'm Prince Nzamuwe, a data scientist and software engineer based in Nairobi.
> Recent work: a credit-risk scorecard scoring ROC-AUC 0.869 on 150,000 borrowers,
> and a Power BI dashboard reconciling Kenya's FinAccess 2024 survey (19,750 adults)
> against published topline figures. Both are open-source — code, write-ups, and
> live demos below.

**CTA pair (recruiter-first, closes L5):**
- Primary button: `View projects` → anchors to the projects section
- Secondary button: `Download résumé (PDF)` → `/resume.pdf`
- Tertiary text link below the pair: `Hiring? Email me — prince@nzamuwe.com`

**Remove from hero:** the $150/hr booking widget as the first action. Move it to its
own "Consulting" section near the footer, one click away but not the default.

---

## 2. About section (first person, verifiable claims only)

> I got into data science by asking an uncomfortable question about money: who gets
> credit, and why? That question became **Credio**, a credit-risk scorecard trained on
> 150,000 real borrower records, where I compared a classic logistic-regression
> scorecard against gradient boosting and learned why the probability calibration
> matters more than the leaderboard metric.
>
> The second question was about access: how do Kenyan households actually use formal
> financial services? For the **FinAccess 2024 dashboard** I streamed the Central Bank
> of Kenya's 290 MB survey workbook into a clean 19,750-adult dataset, weighted every
> percentage correctly, and reconciled my numbers against the published topline —
> all 63 columns matched.
>
> I care about the unglamorous parts of data work: correct weights, calibrated
> probabilities, honest baselines, and code other people can rerun. My GitHub
> (github.com/princenzmw) is the receipts column for everything on this page.
>
> Currently: [BSc PROGRAM, INSTITUTION, EXPECTED YEAR — e.g. "BSc Computer Science,
> expected 2027"] and open to junior/associate data science and software roles,
> remote or in Nairobi.

---

## 3. Featured projects (replaces the three synthetic cards — closes C1, H5)

### Project card 1 — Credio · Credit-Risk Scorecard
- **Role:** Solo project — data, modeling, app
- **Problem:** Predict the probability that a borrower becomes 90+ days past due
  within two years, and turn that probability into decision-ready risk bands.
- **Approach:** Kaggle "Give Me Some Credit" (150,000 borrowers, 6.7% default rate).
  Built a logistic-regression scorecard baseline, then a histogram gradient-boosting
  model; chose GBM on ROC-AUC (0.865 vs 0.823) and skipped resampling after seeing
  it damage probability calibration.
- **Results:** ROC-AUC 0.869 · PR-AUC 0.407 · KS 0.584 · Brier 0.0486. Deciles of the
  score separate default rates from 1.1% (safest band) to 39.0% (riskiest band).
- **Stack:** Python 3.12, scikit-learn, pandas, Streamlit.
- **Links:** Code → `https://github.com/princenzmw/credit-risk-scorecard` ·
  Live demo → `https://credio.streamlit.app/`
- **Card visual:** two real screenshots of the Streamlit app (risk slider + band
  output), not stock photography.

### Project card 2 — FinAccess Kenya Dashboard
- **Role:** Solo project — data engineering, analysis, BI
- **Problem:** Kenya's FinAccess 2024 survey (CBK · KNBS · FSD Kenya) ships as a
  290 MB workbook almost nobody can explore. Make household financial inclusion
  explorable at county level, with survey weights handled correctly.
- **Approach:** Streamed and cleaned the workbook into 19,750 adult records × 63
  columns with weight variables (`w_*`), built a data dictionary, then designed a
  Power BI model with DAX measures and a custom theme.
- **Results:** Every weighted figure reconciles with the published topline (e.g.
  formal financial access: 85.7% unweighted vs 84.8% weighted — reported honestly).
  Reconciliation table ships in the repo.
- **Stack:** Python (pandas), Power BI, DAX.
- **Links:** Code → `https://github.com/princenzmw/finaccess-kenya-dashboard` ·
  [PUBLISH the .pbix to Power BI Service or a demo video → paste URL; a dashboard
  with no live view loses half its impact]
- **Card visual:** one real dashboard screenshot (county map or inclusion trends).

### Project card 3 — pick ONE of these two, whichever is truest
- **Option A — AirBnB Clone v4 (full-stack engineering):** console + ORM + RESTful
  API + dynamic web frontend built across four iterations; evidence you can carry a
  data product beyond the notebook. Code → `https://github.com/princenzmw/AirBnB_clone_v4`
- **Option B — a new, small-but-real dataset project you finish in a week** and
  write up properly (something Kenya/finance-adjacent: M-PESA adoption, SACCO data,
  Nairobi rentals). One honest project beats three synthetic ones.

**Delete entirely:** the three current cards with `github.com/example/*` links,
"TechCorp Inc.", "DataFlow Solutions", and any project you cannot demo or open-source.

---

## 4. Experience & timeline (closes C6, M7, L4 — pick the honest path)

**Path A — if you actually did paid/contract data work before 2024:**

> **Independent data & software work** — remote · 2022 – present
> Contract and freelance projects in data analysis and software engineering
> [NAME 1–2 CLIENTS OR PROJECTS YOU CAN PROVE, or "client work under NDA" if true].
> Alongside: BSc [PROGRAM], [INSTITUTION], 2024 – expected [YEAR].

**Path B — if the "Senior Data Scientist 2022–Present" title was template filler
(most likely, given the GitHub history):**

> **Training & independent projects** — Nairobi · 2023 – present
> Self-directed data science training and open-source projects (Credio, FinAccess
> dashboard, ALX software-engineering coursework). Full commit history on GitHub.
> Alongside: BSc [PROGRAM], [INSTITUTION], 2024 – expected [YEAR].

**Global rules:** remove "5+ years experience" everywhere; never invent employer
names; a credible student-with-real-repos story beats a fake senior story in every
screening process.

---

## 5. Skills section (replaces percentage bars — closes M1)

Delete the "Python 95%, ML 92%" bars. Replace with an evidence-linked grid:

| Area | Tools | Proof on this site |
|---|---|---|
| Machine learning | scikit-learn, gradient boosting | Credio scorecard (ROC-AUC 0.869) |
| Data engineering | pandas, ETL pipelines | FinAccess 290 MB workbook pipeline |
| Visualization & BI | Power BI, DAX, Streamlit | FinAccess dashboard, Credio app |
| Software engineering | Python, SQL, Git, REST APIs | AirBnB Clone v4 |
| [Add rows only for tools you would accept an interview test in] | | |

---

## 6. Testimonials (closes C7 — choose one policy, apply it fully)

**Policy A — real only.** Keep the section only if you can get one verifiable quote:
full name, real role, real organization, permission granted, real photo (or no
photo). One real quote from a lecturer, ALX mentor, or client beats five stock-avatar
quotes that say "this data scientist".

**Policy B — remove.** Delete the carousel and replace it with a compact
"References & background checks welcome" line in the footer, plus a link to your
GitHub commit history as public proof of work.

**In both cases:** delete every Unsplash stock avatar today. Recruiters reverse-image-
search faces; a stock face next to your name reads as fabrication.

---

## 7. Blog (closes H3, H4)

- Remove the hardcoded view counts ("2,100 views") immediately — any visitor can see
  they are fake, and real analytics (post-fix Plausible) will contradict them.
- Either remove the Blog nav item until you have content, or publish these two
  write-ups you are already 80% qualified to write, each on its own permalink page
  (`/blog/credio-scorecard-design`, `/blog/finaccess-survey-weights`):
  1. **"Why I didn't resample an imbalanced credit dataset"** — the calibration story
     from Credio. This is a genuinely differentiated post most bootcamp blogs don't have.
  2. **"Reconciling a 290 MB government survey in an afternoon"** — the FinAccess
     pipeline story.
- Delete `rss.xml`'s placeholder item until post 1 exists; then regenerate with
  absolute URLs.

---

## 8. Footer & legal (closes H6)

- Replace `#` links with real pages: a short Privacy Policy (you use Plausible —
  say so, it's privacy-friendly and worth one paragraph) and Terms page. vly.ai can
  generate both; review before publishing.
- Footer contact block: `prince@nzamuwe.com` · LinkedIn · GitHub — nothing else.
- Keep "Built with vly.ai" only if it is legally required by your plan; otherwise a
  clean footer reads more professional.

---

## 9. Consulting offer (demoted but not deleted — closes the strategy tension)

New section near the footer, two sentences:

> I also take on a small number of consulting engagements in data analysis and
> dashboarding. If you're a business (not a recruiter), [BOOKING LINK].

This keeps the revenue path alive without making every recruiter's first impression
a price tag.
