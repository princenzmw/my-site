"""Generate ATS-safe one-page resume.pdf for nzamuwe.com via headless Chrome/Edge."""

from __future__ import annotations

import argparse
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUT = ROOT / "public" / "resume.pdf"

BROWSER_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
]

CHROME_NAMES = ("chrome", "google-chrome", "chromium", "msedge")


def find_browser() -> str:
    """Locate Chrome or Edge executable for headless PDF generation."""
    for candidate in BROWSER_CANDIDATES:
        if Path(candidate).exists():
            return candidate
    for name in CHROME_NAMES:
        found = shutil.which(name)
        if found:
            return found
    raise FileNotFoundError("Could not find Google Chrome or Microsoft Edge for headless PDF generation.")


HTML_CONTENT = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Prince Nzamuwe - Resume</title>
  <style>
    @page {
      size: letter;
      margin: 0.35in 0.45in;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      hyphens: none;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.85pt;
      line-height: 1.26;
      color: #111827;
      background: #ffffff;
    }
    a {
      color: #1d4ed8;
      text-decoration: none;
    }
    .header {
      text-align: center;
      margin-bottom: 7pt;
    }
    .header h1 {
      font-size: 18pt;
      font-weight: 700;
      letter-spacing: 0.6pt;
      color: #0f172a;
      line-height: 1.1;
    }
    .subtitle {
      font-size: 9.4pt;
      font-weight: 600;
      color: #1d4ed8;
      margin-top: 2pt;
    }
    .contact {
      font-size: 8.3pt;
      color: #334155;
      margin-top: 3pt;
    }
    .contact a {
      color: #1f2937;
    }
    h2 {
      font-size: 9.6pt;
      font-weight: 700;
      color: #1d4ed8;
      text-transform: uppercase;
      letter-spacing: 0.5pt;
      border-bottom: 1pt solid #1d4ed8;
      padding-bottom: 1.5pt;
      margin-top: 7.5pt;
      margin-bottom: 4pt;
    }
    .entry {
      margin-bottom: 4.5pt;
    }
    .entry:last-child {
      margin-bottom: 0;
    }
    .row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8pt;
    }
    .title {
      font-weight: 700;
      color: #0f172a;
      font-size: 9.1pt;
    }
    .meta-right {
      font-size: 8.4pt;
      color: #475569;
      white-space: nowrap;
    }
    .subrow {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 8pt;
      margin-top: 0.5pt;
    }
    .role {
      font-style: italic;
      color: #334155;
      font-size: 8.6pt;
    }
    .stack {
      font-style: italic;
      color: #475569;
      font-size: 8.2pt;
      margin-top: 0.5pt;
    }
    ul {
      margin-top: 1.8pt;
      padding-left: 12pt;
    }
    li {
      margin-bottom: 1.5pt;
      text-align: left;
    }
    code {
      font-family: Consolas, "Courier New", monospace;
      font-size: 8.1pt;
      color: #0f172a;
    }
    .skills-line {
      margin-bottom: 2.2pt;
    }
    .skills-line strong {
      color: #0f172a;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>PRINCE NZAMUWE</h1>
    <div class="subtitle">Data Science, Machine Learning &amp; Python Backend | Open to Internships &amp; Part-Time Engineering Roles</div>
    <div class="contact">
      Nairobi, Kenya | +254 757 723 708 |
      <a href="mailto:prince@nzamuwe.com">prince@nzamuwe.com</a> |
      <a href="https://nzamuwe.com/">nzamuwe.com</a> |
      <a href="https://github.com/princenzmw">github.com/princenzmw</a> |
      <a href="https://www.linkedin.com/in/princenzmw/">linkedin.com/in/princenzmw</a>
    </div>
  </div>

  <h2>Education</h2>
  <div class="entry">
    <div class="row">
      <span class="title">United States International University - Africa (USIU-Africa)</span>
      <span class="meta-right">Nairobi, Kenya | 2024 - Expected 2028 (3rd Year)</span>
    </div>
    <div class="role">BSc in Data Science &amp; Analytics | Mastercard Foundation Scholar (Full Academic Scholarship)</div>
    <ul>
      <li><strong>Relevant Coursework:</strong> Machine Learning, Statistical Modeling &amp; Inference, Data Warehousing &amp; Mining, Database Systems, Optimization, Data Structures &amp; Algorithms.</li>
    </ul>
  </div>
  <div class="entry">
    <div class="row">
      <span class="title">ALX Software Engineering Programme</span>
      <span class="meta-right">Remote | 2023 - 2024</span>
    </div>
    <ul>
      <li>Completed 9-month systems and backend Foundations Phase: C, Python, memory management, data structures, relational databases, Linux, and Git team workflows.</li>
    </ul>
  </div>

  <h2>Technical Skills</h2>
  <div class="skills-line"><strong>Languages:</strong> Python, SQL (PostgreSQL, MySQL), TypeScript, JavaScript, R, MATLAB, HTML/CSS</div>
  <div class="skills-line"><strong>Data &amp; ML:</strong> scikit-learn, pandas, NumPy, Feature Engineering, Probability Calibration, Model Evaluation (ROC-AUC, PR-AUC, KS, Brier), Time-Series Forecasting, Power BI (DAX, PBIP/TMDL, Power Query M), Star Schema Modeling</div>
  <div class="skills-line"><strong>Backend &amp; Tools:</strong> FastAPI, Django REST Framework, Flask, React, Streamlit, TimescaleDB, pgvector, FastEmbed (ONNX), REST APIs, Auth0 / JWT, Docker, Git, pytest, Ruff, Playwright, GitHub Actions CI/CD</div>

  <h2>Projects</h2>
  <div class="entry">
    <div class="row">
      <span class="title">Credio: Credit-Risk Scorecard</span>
      <span class="meta-right"><a href="https://credio.nzamuwe.com/">Live Demo</a> | <a href="https://github.com/princenzmw/credit-risk-scorecard">Code</a></span>
    </div>
    <div class="stack">Python, scikit-learn, pandas, Streamlit, pytest, Docker, GitHub Actions CI</div>
    <ul>
      <li>Built a leak-free default pipeline on 150,000 borrower records (20% missing income and special bureau codes handled inside estimators); gradient boosting reached 0.869 ROC-AUC, 0.407 PR-AUC, 0.584 KS, and 0.0486 Brier vs 0.823 logistic baseline.</li>
      <li>Evaluated and rejected SMOTE and class weighting to preserve probability calibration; shipped monotonic risk tiers (1.1% to 39.0% observed default), cost-based cutoffs, live Streamlit explanations, and 19 CI tests.</li>
    </ul>
  </div>
  <div class="entry">
    <div class="row">
      <span class="title">DukaPulse: Retail POS &amp; Demand Telemetry</span>
      <span class="meta-right"><a href="https://dukapulse-kiosk.onrender.com/kiosk">Live Kiosk</a> | <a href="https://github.com/princenzmw/DukaPulse">Code</a></span>
    </div>
    <div class="stack">FastAPI, TimescaleDB, PostgreSQL, pgvector, Auth0 RS256, FastEmbed ONNX, Streamlit, Docker</div>
    <ul>
      <li>Built race-proof checkouts with atomic conditional SQL decrements and <code>CHECK (current_stock &gt;= 0)</code>; CI verified 16 threads racing 10,000 checkouts against 1 unit yielded 1 success, 9,999 HTTP 409 responses, and 0 oversells (24 tests).</li>
      <li>Implemented TimescaleDB 7-day chunk hypertables with 30m/1h continuous aggregates, Auth0 RBAC, Swahili ONNX vector search, and backtested demand forecasts (Seasonal-Naive won 14/14 products, 1.01% to 5.43% MAPE).</li>
    </ul>
  </div>
  <div class="entry">
    <div class="row">
      <span class="title">FinAccess Kenya 2024: Financial Inclusion Analytics</span>
      <span class="meta-right"><a href="https://app.powerbi.com/view?r=eyJrIjoiYTJjMDVkMmUtZGYxMC00ZTExLTlhZGEtYjcyZTZiNjk1YzhkIiwidCI6IjE2ZDgzZWU2LTI1NGEtNDY5ZC1hNmNjLTU0ZTJjYTIzMTNlNyIsImMiOjh9&embedImagePlaceholder=true&pageName=a09621f88fac873c711f">Live Report</a> | <a href="https://nzamuwe.com/projects/finaccess">Case Study</a> | <a href="https://github.com/princenzmw/finaccess-kenya-dashboard">Code</a></span>
    </div>
    <div class="stack">Python, pandas, XML Streaming, Power BI (DAX), pytest, GitHub Actions CI</div>
    <ul>
      <li>Engineered a 16 MB chunked XML parser compressing a 290 MB survey workbook (~3 GB XML) into an 8 MB CSV (19,750 adults weighted to 28.1M Kenyan adults) with automated topline reconciliation (84.8% formal, 9.9% excluded) and pytest CI.</li>
      <li>Built a 5-page Power BI model uncovering a 45-point county gap in formal access (48.5% to 94.0%) and 63% exclusion among adults without a national ID vs 5% with one.</li>
    </ul>
  </div>
  <div class="entry">
    <div class="row">
      <span class="title">Mzigo Chakula: Kenya Food Price Inflation BI</span>
      <span class="meta-right"><a href="https://nzamuwe.com/projects/mzigo-chakula">Case Study</a> | <a href="https://github.com/princenzmw/mzigo-chakula">Code</a></span>
    </div>
    <div class="stack">Power BI (PBIP/TMDL), DAX, Power Query M, Python, pytest</div>
    <ul>
      <li>Modeled 55,692 World Bank RTFP market observations across 233 markets, 27 counties, and 238 months (2007 to 2026) in a 4-table TMDL star schema with 4 Power Query M scripts, 15 validated DAX measures, 46 PBIR visuals, and pytest checks.</li>
    </ul>
  </div>

  <h2>Experience</h2>
  <div class="entry">
    <div class="row">
      <span class="title">Andela Technical Leadership Program (ATLP) - Apprentice</span>
      <span class="meta-right">Kigali, Rwanda | Jan 2024 - Sep 2024</span>
    </div>
    <ul>
      <li>Shipped full-stack e-commerce features (TypeScript, React, PostgreSQL) in a 9-person Agile squad with PR code reviews and designed the normalized PostgreSQL schema for users, products, and orders.</li>
    </ul>
  </div>
  <div class="entry">
    <div class="row">
      <span class="title">Ida Technology (NEET Program) - Software Engineering Trainee</span>
      <span class="meta-right">Kigali, Rwanda | Dec 2023 - Jun 2024</span>
    </div>
    <ul>
      <li>Implemented Django REST Framework backend endpoints with JWT authentication and converted Figma mockups into responsive React components.</li>
    </ul>
  </div>

  <h2>Open Source &amp; Certifications</h2>
  <div class="entry">
    <ul>
      <li><strong>Open Source:</strong> <a href="https://github.com/vega/altair/pull/4202">vega/altair PR #4202</a> (sequence validation in <code>selection_interval</code> and docs fix for #3896; CI passing on Python 3.11 to 3.14); <a href="https://github.com/arnaudmiribel/streamlit-extras/pull/421">arnaudmiribel/streamlit-extras PR #421</a> &amp; <a href="https://github.com/arnaudmiribel/streamlit-extras/pull/422">#422</a> (directory ordering option and Windows build script fix).</li>
      <li><strong>Certifications &amp; Hackathons:</strong> <a href="https://www.coursera.org/account/accomplishments/verify/Q8VBEPM7UWZV">Meta: Introduction to Back-End Development</a> | <a href="https://freecodecamp.org/certification/princenzmw/javascript-algorithms-and-data-structures-v8">freeCodeCamp JavaScript Algorithms &amp; Data Structures</a> | <a href="https://www.credly.com/badges/0dab507a-1b76-4d5f-9244-26d6da1ca4e3">IBM SkillsBuild AI Fundamentals</a> | MLH Global Hack Week: Builders Week (Nov 2026).</li>
    </ul>
  </div>
</body>
</html>
"""


def build_pdf(out_path: Path, copy_to: Path | None = None) -> None:
    """Render HTML_CONTENT to a single-page PDF using headless Chrome or Edge."""
    out_path.parent.mkdir(parents=True, exist_ok=True)
    browser = find_browser()

    with tempfile.TemporaryDirectory() as tmpdir:
        html_path = Path(tmpdir) / "resume.html"
        html_path.write_text(HTML_CONTENT, encoding="utf-8")
        cmd = [
            browser,
            "--headless=new",
            "--disable-gpu",
            "--no-pdf-header-footer",
            f"--print-to-pdf={out_path.resolve()}",
            html_path.resolve().as_uri(),
        ]
        subprocess.run(cmd, check=True)

    if copy_to is not None:
        copy_to.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(out_path, copy_to)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--out", type=Path, default=DEFAULT_OUT)
    ap.add_argument("--copy-to", type=Path, default=None)
    args = ap.parse_args()
    build_pdf(args.out.resolve(), args.copy_to.resolve() if args.copy_to else None)
    print(f"Wrote {args.out.resolve()} ({args.out.stat().st_size:,} bytes)")
    if args.copy_to:
        print(f"Copied to {args.copy_to.resolve()}")


if __name__ == "__main__":
    main()
