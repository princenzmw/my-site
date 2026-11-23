"""Generate ATS-safe, single-column one-page resumes (PDF and DOCX) for nzamuwe.com."""

from __future__ import annotations

import argparse
import html
import shutil
import subprocess
import tempfile
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIR = ROOT / "public"
CAREER_ROOT = Path(r"D:\Clones\CAREER\PRINCENZMW")
RESUMES_DIR = CAREER_ROOT / "resumes"

BROWSER_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
]
CHROME_NAMES = ("chrome", "google-chrome", "chromium", "msedge")

NOWRAP_TOKENS = (
    "ROC-AUC",
    "PR-AUC",
    "scikit-learn",
    "Industrial-Based",
    "Seasonal-Naive",
    "Time-Series",
    "cost-based",
    "leak-free",
    "race-proof",
    "bounded-memory",
    "5-page",
    "7-day",
    "9-person",
    "6-month",
    "45-point",
    "384-dim",
    "1536-dim",
    "5-minute",
    "16-thread",
    "OpenAI-compatible",
    "Figma-to-HTML/CSS/Django",
)


@dataclass(frozen=True)
class LinkItem:
    label: str
    display_url: str
    href: str


@dataclass(frozen=True)
class Entry:
    title: str
    meta: str
    links: tuple[LinkItem, ...]
    bullets: tuple[str, ...]


@dataclass(frozen=True)
class SkillGroup:
    label: str
    items: str


@dataclass(frozen=True)
class OpenSourceItem:
    repo: str
    detail: str
    display_url: str
    href: str


@dataclass(frozen=True)
class CertificationItem:
    name: str
    issuer_meta: str
    display_url: str = ""
    href: str = ""


@dataclass(frozen=True)
class ResumeVariant:
    key: str
    title: str
    target_line: str
    pdf_name: str
    docx_name: str
    public_pdf_name: str
    coursework: str
    projects: tuple[Entry, ...]
    skills: tuple[SkillGroup, ...]


HEADER = {
    "name": "PRINCE NZAMUWE",
    "location": "Nairobi, Kenya",
    "phone": "+254 757 723 708",
    "email": "prince@nzamuwe.com",
    "links": (
        LinkItem("", "nzamuwe.com", "https://nzamuwe.com/"),
        LinkItem("", "github.com/princenzmw", "https://github.com/princenzmw"),
        LinkItem("", "linkedin.com/in/princenzmw", "https://www.linkedin.com/in/princenzmw/"),
    ),
}

EXPERIENCE: tuple[Entry, ...] = (
    Entry(
        title="Apprentice, Technical Leadership Program (ATLP)",
        meta="Andela | Kigali, Rwanda | Jan 2024 - Sep 2024",
        links=(),
        bullets=(
            "Shipped 5 merged PRs and 18 peer code reviews (9 backend, 9 frontend) in a 9-person remote Agile squad (concurrent with Ida), building 5 Swagger-documented REST endpoints (password reset, admin roles) and 2 React admin dashboards.",
            "Authored 22 Jest unit tests for profile and permission controllers and designed normalized PostgreSQL tables for products, users, and orders, plus a 6-module Node.js/Express REST API for the solo capstone.",
        ),
    ),
    Entry(
        title="Software Development Trainee (Industrial-Based Training)",
        meta="Ida Technology | Kigali, Rwanda | Dec 2023 - Jun 2024",
        links=(),
        bullets=(
            "Completed a 6-month Rwanda Ministry of Education / RTB certified program (concurrent with ATLP and ALX), mastering 6 modules in Python frameworks, HTML/CSS/JavaScript, React, Next.js, Node.js, and DevOps.",
            "Built Django modules for user authentication (register, login, logout) and flight booking across 7 templates, 4 responsive Figma-to-HTML/CSS/Django pages, and Django REST Framework endpoints with JWT auth.",
        ),
    ),
)

OPEN_SOURCE: tuple[OpenSourceItem, ...] = (
    OpenSourceItem(
        repo="translate/translate (PR #6766, merged)",
        detail="Frequency sort in create_termunit (3 tests)",
        display_url="github.com/translate/translate/pull/6766",
        href="https://github.com/translate/translate/pull/6766",
    ),
    OpenSourceItem(
        repo="vega/altair (PR #4202, open)",
        detail="Sequence validation in selection_interval & docs (#3896)",
        display_url="github.com/vega/altair/pull/4202",
        href="https://github.com/vega/altair/pull/4202",
    ),
)

CERTIFICATIONS: tuple[CertificationItem, ...] = (
    CertificationItem(
        name="Certificate of Competence in Software Development (Industrial-Based Training)",
        issuer_meta="Rwanda TVET Board (MOE) & Ida Technology (Jun 2024)",
        display_url="",
        href="",
    ),
    CertificationItem(
        name="Introduction to Back-End Development",
        issuer_meta="Meta (Coursera)",
        display_url="coursera.org/account/accomplishments/verify/Q8VBEPM7UWZV",
        href="https://www.coursera.org/account/accomplishments/verify/Q8VBEPM7UWZV",
    ),
    CertificationItem(
        name="JavaScript Algorithms & Data Structures",
        issuer_meta="freeCodeCamp",
        display_url="freecodecamp.org/certification/princenzmw/javascript-algorithms-and-data-structures-v8",
        href="https://freecodecamp.org/certification/princenzmw/javascript-algorithms-and-data-structures-v8",
    ),
    CertificationItem(
        name="Artificial Intelligence Fundamentals",
        issuer_meta="IBM SkillsBuild",
        display_url="credly.com/badges/0dab507a-1b76-4d5f-9244-26d6da1ca4e3",
        href="https://www.credly.com/badges/0dab507a-1b76-4d5f-9244-26d6da1ca4e3",
    ),
)

SHARED_PROJECTS = {
    "credio": Entry(
        title="Credio: Credit-Risk Scorecard",
        meta="Oct 2026 - Nov 2026 | Python, scikit-learn",
        links=(
            LinkItem("Demo", "credio.nzamuwe.com", "https://credio.nzamuwe.com/"),
            LinkItem("Code", "github.com/princenzmw/credit-risk-scorecard", "https://github.com/princenzmw/credit-risk-scorecard"),
        ),
        bullets=(
            "Built a leak-free default pipeline in scikit-learn on 150,000 borrowers (20% missing income handled inside estimators); gradient boosting achieved ROC-AUC of 0.869, PR-AUC of 0.407, KS of 0.584, and Brier of 0.0486 vs 0.823 logistic baseline.",
            "Rejected SMOTE and class weights to keep calibrated probabilities; shipped monotonic risk tiers (1.1% to 39.0% default), cost-based cutoffs, Streamlit explanations, Docker packaging, and 19 pytest CI tests.",
        ),
    ),
    "finaccess": Entry(
        title="FinAccess Kenya 2024: Financial Inclusion Analytics",
        meta="Oct 2026 - Nov 2026 | Python, Power BI (DAX)",
        links=(
            LinkItem("Site", "nzamuwe.com/projects/finaccess", "https://nzamuwe.com/projects/finaccess"),
            LinkItem("Code", "github.com/princenzmw/finaccess-kenya-dashboard", "https://github.com/princenzmw/finaccess-kenya-dashboard"),
        ),
        bullets=(
            "Engineered a 16 MB chunked Python XML streaming parser compressing a 290 MB survey workbook (~3 GB XML) into an 8 MB CSV (19,750 adults weighted to 28.1M), reconciled via pytest CI (84.8% formal access, 9.9% excluded).",
            "Delivered a 5-page Power BI (DAX) model: 45-point county gap (48.5% to 94.0%), 63% vs 5% exclusion without national ID.",
        ),
    ),
    "finaccess_etl": Entry(
        title="FinAccess Kenya 2024: Streaming XML ETL Pipeline",
        meta="Oct 2026 - Nov 2026 | Python, Power BI",
        links=(
            LinkItem("Code", "github.com/princenzmw/finaccess-kenya-dashboard", "https://github.com/princenzmw/finaccess-kenya-dashboard"),
            LinkItem("Site", "nzamuwe.com/projects/finaccess", "https://nzamuwe.com/projects/finaccess"),
        ),
        bullets=(
            "Engineered a 16 MB bounded-memory Python XML streaming parser compressing a 290 MB national survey workbook (~3 GB uncompressed XML) into an 8 MB CSV covering 19,750 adults weighted to 28.1M.",
            "Built automated pytest CI reconciliation matching published CBK/KNBS toplines (84.8% formal access, 9.9% excluded) and a 5-page Power BI (DAX) analytical layer.",
        ),
    ),
    "dukapulse_ds": Entry(
        title="DukaPulse: Retail POS & Demand Telemetry",
        meta="Nov 2026 (MLH Builders Week) | FastAPI, TimescaleDB",
        links=(
            LinkItem("Demo", "dukapulse-kiosk.onrender.com/kiosk", "https://dukapulse-kiosk.onrender.com/kiosk"),
            LinkItem("Code", "github.com/princenzmw/DukaPulse", "https://github.com/princenzmw/DukaPulse"),
        ),
        bullets=(
            "Backtested demand forecasts across 14 SKUs (Seasonal-Naive won 14/14 at 1.01% to 5.43% MAPE vs 2.53% to 16.58% Holt Linear) on TimescaleDB 7-day hypertables (30m/1h aggregates) with Swahili ONNX search and Auth0 RS256 RBAC.",
            "Enforced atomic SQL checkouts (CHECK current_stock >= 0, savepoints); 16-thread CI race of 10,000 attempts on 1 unit yielded 1 success, 9,999 HTTP 409s, 0 oversells (30 tests: 25 unit, 5 PG integration).",
        ),
    ),
    "dukapulse_be": Entry(
        title="DukaPulse: Retail POS & Demand Telemetry Backend",
        meta="Nov 2026 (MLH Builders Week) | FastAPI, PostgreSQL",
        links=(
            LinkItem("Demo", "dukapulse-kiosk.onrender.com/kiosk", "https://dukapulse-kiosk.onrender.com/kiosk"),
            LinkItem("Code", "github.com/princenzmw/DukaPulse", "https://github.com/princenzmw/DukaPulse"),
        ),
        bullets=(
            "Enforced atomic SQL checkouts (CHECK current_stock >= 0, savepoints); 16-thread CI race of 10,000 attempts on 1 unit yielded 1 success, 9,999 HTTP 409s, 0 oversells (30 tests: 25 unit, 5 PG integration).",
            "Implemented Auth0 RS256 RBAC (margin redaction, 403 restock guard), TimescaleDB 7-day chunk hypertables (30m/1h aggregates), Swahili 384-dim ONNX search, and Seasonal-Naive forecasts (14/14 SKUs, 1.01% to 5.43% MAPE).",
        ),
    ),
    "grid_ops": Entry(
        title="grid-ops-search: Hybrid Vector & Time-Series CLI",
        meta="Nov 2026 | Python, PostgreSQL, TimescaleDB, pgvector, StreamingDiskANN",
        links=(
            LinkItem("Code", "github.com/princenzmw/grid-ops-search", "https://github.com/princenzmw/grid-ops-search"),
        ),
        bullets=(
            "Built a PostgreSQL/TimescaleDB retrieval CLI joining 1536-dim pgvector operational note embeddings (StreamingDiskANN with HNSW fallback) against 5-minute time_bucket substation telemetry rollups in one SQL query.",
            "Implemented dual embedding providers (OpenAI-compatible API and deterministic keyless hashing fallback), automatic substation ID resolution, masked DATABASE_URL logging, --json CLI output, Ruff linting, and 16 pytest CI tests.",
        ),
    ),
}

VARIANTS: dict[str, ResumeVariant] = {
    "data_science": ResumeVariant(
        key="data_science",
        title="Data Science & Machine Learning",
        target_line="Seeking Data Science, Analytics & Machine Learning Internships | Full-Time Jan 2027 - Apr 2027 (Flexible Availability)",
        pdf_name="Prince_Nzamuwe_Resume_Data_Science.pdf",
        docx_name="Prince_Nzamuwe_Resume_Data_Science.docx",
        public_pdf_name="resume.pdf",
        coursework="Machine Learning, Statistical Modeling, Optimization, Database Systems.",
        projects=(
            SHARED_PROJECTS["credio"],
            SHARED_PROJECTS["finaccess"],
            SHARED_PROJECTS["dukapulse_ds"],
        ),
        skills=(
            SkillGroup(
                "Languages",
                "Python, SQL (PostgreSQL, MySQL), R, MATLAB, TypeScript, JavaScript, HTML/CSS, Bash",
            ),
            SkillGroup(
                "Data Science, ML & BI",
                "scikit-learn, pandas, NumPy, Feature Engineering, Probability Calibration, ROC-AUC, PR-AUC, Time-Series Forecasting, Power BI (DAX, PBIP/TMDL, Power Query M), Star Schema",
            ),
            SkillGroup(
                "Backend & Cloud",
                "FastAPI, Django REST, Flask, React, Next.js, Node.js, REST APIs, Streamlit, TimescaleDB, pgvector, FastEmbed, Auth0/JWT, Docker, Git, GitHub Actions, pytest, Playwright, Render, Vercel, Cloudflare Workers, Timescale Cloud",
            ),
        ),
    ),
    "backend": ResumeVariant(
        key="backend",
        title="Python Backend Software Engineering",
        target_line="Seeking Python Backend & Software Engineering Internships | Full-Time Jan 2027 - Apr 2027 (Flexible Availability)",
        pdf_name="Prince_Nzamuwe_Resume_Backend.pdf",
        docx_name="Prince_Nzamuwe_Resume_Backend.docx",
        public_pdf_name="resume-backend.pdf",
        coursework="Database Systems, Data Structures & Algorithms, Optimization, Machine Learning.",
        projects=(
            SHARED_PROJECTS["dukapulse_be"],
            SHARED_PROJECTS["grid_ops"],
            SHARED_PROJECTS["finaccess_etl"],
        ),
        skills=(
            SkillGroup(
                "Languages",
                "Python, SQL (PostgreSQL, MySQL), TypeScript, JavaScript, HTML/CSS, C, Bash/Linux",
            ),
            SkillGroup(
                "Backend & Databases",
                "FastAPI, Django REST Framework, Flask, Node.js, React, Next.js, REST APIs, PostgreSQL, TimescaleDB, pgvector, SQLAlchemy, Auth0 RS256, JWT, Streamlit",
            ),
            SkillGroup(
                "Cloud, DevOps & Data",
                "Docker, Git, GitHub Actions CI/CD, pytest, Ruff, Playwright, Render, Vercel, Cloudflare Workers, Timescale Cloud, Streamlit Cloud, pandas, NumPy, scikit-learn, FastEmbed (ONNX), Power BI (DAX)",
            ),
        ),
    ),
}


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


def _format_body_html(text: str) -> str:
    """Escape body text and wrap hyphenated technical terms to avoid line-break splits."""
    escaped = html.escape(text)
    for token in NOWRAP_TOKENS:
        escaped_token = html.escape(token)
        if escaped_token in escaped:
            escaped = escaped.replace(escaped_token, f'<span class="nowrap">{escaped_token}</span>')
    return escaped


def _html_links(links: tuple[LinkItem, ...], sep: str = " | ") -> str:
    parts: list[str] = []
    for item in links:
        prefix = f"{html.escape(item.label)}: " if item.label else ""
        parts.append(f'<span class="nowrap">{prefix}<a href="{html.escape(item.href)}">{html.escape(item.display_url)}</a></span>')
    return sep.join(parts)


def render_html(variant: ResumeVariant) -> str:
    """Render an ATS-safe single-column HTML document for one resume variant."""
    def render_entries(entries: tuple[Entry, ...]) -> str:
        blocks: list[str] = []
        for entry in entries:
            sub_parts = [_format_body_html(entry.meta)]
            if entry.links:
                sub_parts.append(_html_links(entry.links))
            sub_html = " | ".join(sub_parts)
            bullets_html = "".join(f"<li>{_format_body_html(b)}</li>" for b in entry.bullets)
            blocks.append(
                f"""<div class="entry">
                  <div class="entry-title">{_format_body_html(entry.title)}</div>
                  <div class="entry-sub">{sub_html}</div>
                  <ul>{bullets_html}</ul>
                </div>"""
            )
        return "\n".join(blocks)

    skills_html = "\n".join(
        f'<div class="line"><strong>{html.escape(s.label)}:</strong> {_format_body_html(s.items)}</div>'
        for s in variant.skills
    )
    os_html = "\n".join(
        f'<li><strong>{html.escape(o.repo)}:</strong> {_format_body_html(o.detail)} '
        f'<span class="nowrap">| <a href="{html.escape(o.href)}">{html.escape(o.display_url)}</a></span></li>'
        for o in OPEN_SOURCE
    )
    cert_lines: list[str] = []
    for c in CERTIFICATIONS:
        if c.display_url and c.href:
            line_html = (
                f"<strong>{_format_body_html(c.name)}</strong> | {_format_body_html(c.issuer_meta)}"
                f' <span class="nowrap cert-verify">(Verify: <a class="cert-url" href="{html.escape(c.href)}">'
                f'{html.escape(c.display_url)}</a>)</span>'
            )
        else:
            line_html = (
                f"<strong>{_format_body_html(c.name)}</strong> | {_format_body_html(c.issuer_meta)}"
                f' <span class="nowrap cert-verify">(Ref: RTB/NEET/DIS/2024/ST0020657)</span>'
            )
        cert_lines.append(f"<li>{line_html}</li>")
    certs_html = "\n".join(cert_lines)

    contact_links = _html_links(HEADER["links"])  # type: ignore[arg-type]

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Prince Nzamuwe - {html.escape(variant.title)}</title>
  <style>
    @page {{
      size: letter;
      margin: 0.5in;
    }}
    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      hyphens: none;
      font-variant-ligatures: none;
      font-feature-settings: "liga" 0, "clig" 0;
    }}
    body {{
      font-family: Calibri, Arial, Helvetica, sans-serif;
      font-size: 10.0pt;
      line-height: 1.11;
      color: #111827;
      background: #ffffff;
    }}
    .nowrap {{
      white-space: nowrap;
    }}
    a {{
      color: #1d4ed8;
      text-decoration: none;
      white-space: nowrap;
    }}
    .cert-verify {{
      font-size: 9.0pt;
      color: #334155;
    }}
    .cert-url {{
      font-size: 8.8pt;
    }}
    .header {{
      margin-bottom: 3.2pt;
    }}
    .header h1 {{
      font-size: 17.5pt;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.03;
    }}
    .role-title {{
      font-size: 10.5pt;
      font-weight: 700;
      color: #1d4ed8;
      margin-top: 0.8pt;
    }}
    .contact {{
      font-size: 9.2pt;
      color: #1f2937;
      margin-top: 1pt;
    }}
    .target-line {{
      font-size: 9.3pt;
      color: #334155;
      margin-top: 0.8pt;
    }}
    h2 {{
      font-size: 10.1pt;
      font-weight: 700;
      color: #1d4ed8;
      text-transform: uppercase;
      letter-spacing: 0.35pt;
      border-bottom: 1pt solid #1d4ed8;
      padding-bottom: 0.8pt;
      margin-top: 3.5pt;
      margin-bottom: 1.8pt;
    }}
    .entry {{
      margin-bottom: 2.2pt;
    }}
    .entry:last-child {{
      margin-bottom: 0;
    }}
    .entry-title {{
      font-weight: 700;
      color: #0f172a;
      font-size: 10.0pt;
    }}
    .entry-sub {{
      font-size: 8.9pt;
      color: #334155;
      margin-top: 0.2pt;
    }}
    ul {{
      margin-top: 0.6pt;
      padding-left: 11.5pt;
    }}
    li {{
      margin-bottom: 0.4pt;
      text-align: left;
    }}
    .line {{
      margin-bottom: 0.9pt;
    }}
  </style>
</head>
<body>
  <div class="header">
    <h1>{html.escape(HEADER["name"])}</h1>
    <div class="role-title">{html.escape(variant.title)}</div>
    <div class="contact">
      {html.escape(HEADER["location"])} | {html.escape(HEADER["phone"])} |
      <a href="mailto:{html.escape(HEADER["email"])}">{html.escape(HEADER["email"])}</a> |
      {contact_links}
    </div>
    <div class="target-line">{html.escape(variant.target_line)}</div>
  </div>

  <h2>Education</h2>
  <div class="entry">
    <div class="entry-title">United States International University - Africa (USIU-Africa)</div>
    <div class="entry-sub">BSc in Data Science &amp; Analytics (3rd Year) | Nairobi, Kenya | Sep 2024 - Expected Sep 2028</div>
    <ul>
      <li>Mastercard Foundation Scholar | Coursework: {_format_body_html(variant.coursework)}</li>
    </ul>
  </div>
  <div class="entry">
    <div class="entry-title">ALX Software Engineering Programme</div>
    <div class="entry-sub">Software Engineering Foundations (9 Months) | Remote | Jun 2023 - May 2024</div>
    <ul>
      <li>Concurrent with ATLP &amp; Ida: built C Unix shell, Flask/MySQL AirBnB API, data structures, Linux shell, and Git.</li>
    </ul>
  </div>

  <h2>Technical Skills</h2>
  {skills_html}

  <h2>Experience</h2>
  {render_entries(EXPERIENCE)}

  <h2>Projects</h2>
  {render_entries(variant.projects)}

  <h2>Open Source</h2>
  <ul>
    {os_html}
  </ul>

  <h2>Certifications</h2>
  <ul>
    {certs_html}
  </ul>
</body>
</html>
"""


def build_pdf(variant: ResumeVariant, out_path: Path, copy_to: Path | None = None) -> None:
    """Render one variant's HTML to a single-page PDF using headless Chrome or Edge."""
    out_path.parent.mkdir(parents=True, exist_ok=True)
    browser = find_browser()
    html_content = render_html(variant)

    with tempfile.TemporaryDirectory() as tmpdir:
        html_path = Path(tmpdir) / "resume.html"
        html_path.write_text(html_content, encoding="utf-8")
        cmd = [
            browser,
            "--headless=new",
            "--disable-gpu",
            "--no-pdf-header-footer",
            f"--print-to-pdf={out_path.resolve()}",
            html_path.resolve().as_uri(),
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    if copy_to is not None:
        copy_to.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(out_path, copy_to)


def _add_hyperlink(paragraph, text: str, url: str, color_rgb=(0x1D, 0x4E, 0xD8), font_pt: float = 9.0) -> None:
    """Append an ATS-readable clickable XML hyperlink run to a python-docx paragraph."""
    from docx.opc.constants import RELATIONSHIP_TYPE
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn

    part = paragraph.part
    r_id = part.relate_to(url, RELATIONSHIP_TYPE.HYPERLINK, is_external=True)

    hyperlink = OxmlElement("w:hyperlink")
    hyperlink.set(qn("r:id"), r_id)

    new_run = OxmlElement("w:r")
    r_pr = OxmlElement("w:rPr")

    r_fonts = OxmlElement("w:rFonts")
    r_fonts.set(qn("w:ascii"), "Calibri")
    r_fonts.set(qn("w:hAnsi"), "Calibri")
    r_pr.append(r_fonts)

    sz = OxmlElement("w:sz")
    sz.set(qn("w:val"), str(int(round(font_pt * 2))))
    r_pr.append(sz)

    color = OxmlElement("w:color")
    color.set(qn("w:val"), f"{color_rgb[0]:02X}{color_rgb[1]:02X}{color_rgb[2]:02X}")
    r_pr.append(color)

    new_run.append(r_pr)
    t = OxmlElement("w:t")
    t.text = text
    new_run.append(t)
    hyperlink.append(new_run)
    paragraph._p.append(hyperlink)


def _add_bottom_border(paragraph, color_hex: str = "1D4ED8") -> None:
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn

    p_pr = paragraph._p.get_or_add_pPr()
    p_bdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "6")
    bottom.set(qn("w:space"), "1")
    bottom.set(qn("w:color"), color_hex)
    p_bdr.append(bottom)
    p_pr.append(p_bdr)


def build_docx(variant: ResumeVariant, out_path: Path, copy_to: Path | None = None) -> None:
    """Generate a single-column ATS-safe Word (.docx) file matching PDF content."""
    from docx import Document
    from docx.shared import Inches, Pt, RGBColor

    out_path.parent.mkdir(parents=True, exist_ok=True)
    doc = Document()

    for sec in doc.sections:
        sec.page_width = Inches(8.5)
        sec.page_height = Inches(11.0)
        sec.top_margin = Inches(0.5)
        sec.bottom_margin = Inches(0.5)
        sec.left_margin = Inches(0.5)
        sec.right_margin = Inches(0.5)

    normal = doc.styles["Normal"]
    normal.font.name = "Calibri"
    normal.font.size = Pt(10.0)
    normal.font.color.rgb = RGBColor(0x11, 0x18, 0x27)

    def add_p(space_before: float = 0, space_after: float = 0.5, line_spacing: float = 1.03):
        p = doc.add_paragraph()
        pf = p.paragraph_format
        pf.space_before = Pt(space_before)
        pf.space_after = Pt(space_after)
        pf.line_spacing = line_spacing
        return p

    def add_heading(title: str) -> None:
        p = add_p(space_before=3.0, space_after=1.4, line_spacing=1.02)
        pf = p.paragraph_format
        pf.keep_with_next = True
        r = p.add_run(title.upper())
        r.bold = True
        r.font.name = "Calibri"
        r.font.size = Pt(10.1)
        r.font.color.rgb = RGBColor(0x1D, 0x4E, 0xD8)
        _add_bottom_border(p)

    def add_bullet(
        text: str,
        prefix_bold: str = "",
        link: tuple[str, str] | None = None,
        link_pt: float = 9.5,
        wrap_verify: bool = False,
    ) -> None:
        p = doc.add_paragraph(style="List Bullet")
        pf = p.paragraph_format
        pf.space_before = Pt(0)
        pf.space_after = Pt(0.4)
        pf.line_spacing = 1.03
        if prefix_bold:
            rb = p.add_run(prefix_bold)
            rb.bold = True
            rb.font.name = "Calibri"
            rb.font.size = Pt(10.0)
        r = p.add_run(text)
        r.font.name = "Calibri"
        r.font.size = Pt(10.0)
        if link is not None:
            sep_text = " (Verify: " if wrap_verify else " | "
            rsep = p.add_run(sep_text)
            rsep.font.name = "Calibri"
            rsep.font.size = Pt(link_pt if wrap_verify else 10.0)
            if wrap_verify:
                rsep.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
            _add_hyperlink(p, link[0], link[1], font_pt=link_pt)
            if wrap_verify:
                rclose = p.add_run(")")
                rclose.font.name = "Calibri"
                rclose.font.size = Pt(link_pt)
                rclose.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

    # Header in body (not Word header/footer box)
    h1 = add_p(space_before=0, space_after=0.3, line_spacing=1.02)
    r1 = h1.add_run(HEADER["name"])  # type: ignore[arg-type]
    r1.bold = True
    r1.font.name = "Calibri"
    r1.font.size = Pt(17.5)
    r1.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    sub = add_p(space_before=0, space_after=0.5, line_spacing=1.02)
    rs = sub.add_run(variant.title)
    rs.bold = True
    rs.font.name = "Calibri"
    rs.font.size = Pt(10.5)
    rs.font.color.rgb = RGBColor(0x1D, 0x4E, 0xD8)

    contact = add_p(space_before=0, space_after=0.5, line_spacing=1.03)
    rc = contact.add_run(f"{HEADER['location']} | {HEADER['phone']} | ")
    rc.font.size = Pt(9.2)
    rc.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)
    _add_hyperlink(contact, HEADER["email"], f"mailto:{HEADER['email']}", font_pt=9.2)  # type: ignore[arg-type]
    for item in HEADER["links"]:  # type: ignore[attr-defined]
        rsep = contact.add_run(" | ")
        rsep.font.size = Pt(9.2)
        rsep.font.color.rgb = RGBColor(0x1F, 0x29, 0x37)
        _add_hyperlink(contact, item.display_url, item.href, font_pt=9.2)

    target = add_p(space_before=0, space_after=1.0, line_spacing=1.03)
    rtgt = target.add_run(variant.target_line)
    rtgt.font.size = Pt(9.3)
    rtgt.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

    # Education
    add_heading("Education")
    p = add_p(space_before=0, space_after=0.2)
    p.paragraph_format.keep_with_next = True
    rt = p.add_run("United States International University - Africa (USIU-Africa)")
    rt.bold = True
    rt.font.size = Pt(10.0)
    p2 = add_p(space_before=0, space_after=0.5)
    p2.paragraph_format.keep_with_next = True
    r2 = p2.add_run("BSc in Data Science & Analytics (3rd Year) | Nairobi, Kenya | Sep 2024 - Expected Sep 2028")
    r2.font.size = Pt(8.9)
    r2.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
    add_bullet(f"Mastercard Foundation Scholar | Coursework: {variant.coursework}")

    p = add_p(space_before=1.0, space_after=0.2)
    p.paragraph_format.keep_with_next = True
    rt = p.add_run("ALX Software Engineering Programme")
    rt.bold = True
    rt.font.size = Pt(10.0)
    p2 = add_p(space_before=0, space_after=0.5)
    p2.paragraph_format.keep_with_next = True
    r2 = p2.add_run("Software Engineering Foundations (9 Months) | Remote | Jun 2023 - May 2024")
    r2.font.size = Pt(8.9)
    r2.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
    add_bullet(
        "Concurrent with ATLP & Ida: built C Unix shell, Flask/MySQL AirBnB API, data structures, Linux shell, and Git."
    )

    # Technical Skills
    add_heading("Technical Skills")
    for sg in variant.skills:
        p = add_p(space_before=0, space_after=0.7)
        rl = p.add_run(f"{sg.label}: ")
        rl.bold = True
        rl.font.size = Pt(10.0)
        ri = p.add_run(sg.items)
        ri.font.size = Pt(10.0)

    def write_entries(heading: str, entries: tuple[Entry, ...]) -> None:
        add_heading(heading)
        for idx, entry in enumerate(entries):
            pt = add_p(space_before=1.0 if idx else 0, space_after=0.2)
            pt.paragraph_format.keep_with_next = True
            rt = pt.add_run(entry.title)
            rt.bold = True
            rt.font.size = Pt(10.0)

            ps = add_p(space_before=0, space_after=0.5)
            ps.paragraph_format.keep_with_next = True
            rs = ps.add_run(entry.meta)
            rs.font.size = Pt(8.9)
            rs.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
            if entry.links:
                for item in entry.links:
                    rsep = ps.add_run(" | ")
                    rsep.font.size = Pt(8.9)
                    rsep.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
                    if item.label:
                        rlbl = ps.add_run(f"{item.label}: ")
                        rlbl.font.size = Pt(8.9)
                        rlbl.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
                    _add_hyperlink(ps, item.display_url, item.href, font_pt=8.9)

            for b in entry.bullets:
                add_bullet(b)

    write_entries("Experience", EXPERIENCE)
    write_entries("Projects", variant.projects)

    add_heading("Open Source")
    for item in OPEN_SOURCE:
        add_bullet(item.detail, prefix_bold=f"{item.repo}: ", link=(item.display_url, item.href), link_pt=9.5)

    add_heading("Certifications")
    for cert in CERTIFICATIONS:
        if cert.display_url and cert.href:
            add_bullet(
                cert.issuer_meta,
                prefix_bold=f"{cert.name} | ",
                link=(cert.display_url, cert.href),
                link_pt=8.8,
                wrap_verify=True,
            )
        else:
            add_bullet(
                f"{cert.issuer_meta} (Ref: RTB/NEET/DIS/2024/ST0020657)",
                prefix_bold=f"{cert.name} | ",
            )

    doc.save(str(out_path))
    if copy_to is not None:
        copy_to.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(out_path, copy_to)


def build_all() -> None:
    """Build Data Science (default) and Backend resume PDFs and DOCX files."""
    RESUMES_DIR.mkdir(parents=True, exist_ok=True)
    ds = VARIANTS["data_science"]
    be = VARIANTS["backend"]

    build_pdf(ds, PUBLIC_DIR / ds.public_pdf_name, copy_to=CAREER_ROOT / "Prince_Nzamuwe_Resume.pdf")
    shutil.copy2(PUBLIC_DIR / ds.public_pdf_name, RESUMES_DIR / ds.pdf_name)
    build_docx(ds, RESUMES_DIR / ds.docx_name, copy_to=CAREER_ROOT / "Prince_Nzamuwe_Resume.docx")

    build_pdf(be, PUBLIC_DIR / be.public_pdf_name, copy_to=RESUMES_DIR / be.pdf_name)
    build_docx(be, RESUMES_DIR / be.docx_name)

    for path in (
        PUBLIC_DIR / ds.public_pdf_name,
        PUBLIC_DIR / be.public_pdf_name,
        CAREER_ROOT / "Prince_Nzamuwe_Resume.pdf",
        CAREER_ROOT / "Prince_Nzamuwe_Resume.docx",
        RESUMES_DIR / ds.pdf_name,
        RESUMES_DIR / ds.docx_name,
        RESUMES_DIR / be.pdf_name,
        RESUMES_DIR / be.docx_name,
    ):
        print(f"Wrote {path} ({path.stat().st_size:,} bytes)")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--variant", choices=tuple(VARIANTS.keys()), default="data_science")
    ap.add_argument("--out", type=Path, default=PUBLIC_DIR / "resume.pdf")
    ap.add_argument("--copy-to", type=Path, default=None)
    ap.add_argument("--docx", type=Path, default=None)
    ap.add_argument("--build-all", action="store_true")
    args = ap.parse_args()

    if args.build_all:
        build_all()
        return

    variant = VARIANTS[args.variant]
    build_pdf(variant, args.out.resolve(), args.copy_to.resolve() if args.copy_to else None)
    print(f"Wrote {args.out.resolve()} ({args.out.stat().st_size:,} bytes)")
    if args.copy_to:
        print(f"Copied to {args.copy_to.resolve()}")
    if args.docx:
        build_docx(variant, args.docx.resolve())
        print(f"Wrote {args.docx.resolve()} ({args.docx.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
