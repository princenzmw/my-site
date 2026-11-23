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
class ResumeVariant:
    key: str
    title: str
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
        meta="Andela | Online (Concurrent) | Jan 2024 - Sep 2024",
        links=(),
        bullets=(
            "Shipped full-stack e-commerce features (TypeScript, React, PostgreSQL) in a 9-person Agile squad with PR reviews.",
            "Designed the normalized PostgreSQL schema for products, users, and orders with foreign keys and REST endpoints.",
        ),
    ),
    Entry(
        title="Software Engineering Trainee, NEET Program",
        meta="Ida Technology | Kigali, Rwanda (On-site, Concurrent) | Dec 2023 - Jun 2024",
        links=(),
        bullets=(
            "Built Django REST Framework modules for user accounts and online ticket booking with JWT authentication.",
            "Converted Figma UI mockups into responsive React components wired to REST API endpoints.",
        ),
    ),
)

OPEN_SOURCE: tuple[OpenSourceItem, ...] = (
    OpenSourceItem(
        repo="translate/translate (PR #6766, open)",
        detail="Frequency target sort in create_termunit (3 tests)",
        display_url="github.com/translate/translate/pull/6766",
        href="https://github.com/translate/translate/pull/6766",
    ),
    OpenSourceItem(
        repo="vega/altair (PR #4202, open)",
        detail="Sequence validation in selection_interval & docs (#3896)",
        display_url="github.com/vega/altair/pull/4202",
        href="https://github.com/vega/altair/pull/4202",
    ),
    OpenSourceItem(
        repo="streamlit-extras (PRs #421, #422, open)",
        detail="Directory ordering option & Windows build fix",
        display_url="github.com/arnaudmiribel/streamlit-extras/pull/421",
        href="https://github.com/arnaudmiribel/streamlit-extras/pull/421",
    ),
)

SHARED_PROJECTS = {
    "credio": Entry(
        title="Credio: Credit-Risk Scorecard",
        meta="Oct 2026 - Nov 2026 | Python, scikit-learn, Streamlit, Docker",
        links=(
            LinkItem("Demo", "credio.nzamuwe.com", "https://credio.nzamuwe.com/"),
            LinkItem("Code", "github.com/princenzmw/credit-risk-scorecard", "https://github.com/princenzmw/credit-risk-scorecard"),
        ),
        bullets=(
            "Built a leak-free default pipeline on 150,000 borrowers (20% missing income handled in estimators); gradient boosting hit 0.869 ROC-AUC, 0.407 PR-AUC, 0.584 KS, and 0.0486 Brier vs 0.823 logistic baseline.",
            "Rejected SMOTE and class weights to keep calibrated probabilities; shipped monotonic risk tiers (1.1% to 39.0% default), cost-based cutoffs, live Streamlit explanations, and 19 CI tests.",
        ),
    ),
    "credio_compact": Entry(
        title="Credio: Credit-Risk ML Pipeline",
        meta="Oct 2026 - Nov 2026 | Python, scikit-learn, pandas, Streamlit, pytest, Docker, GitHub Actions CI",
        links=(
            LinkItem("Demo", "credio.nzamuwe.com", "https://credio.nzamuwe.com/"),
            LinkItem("Code", "github.com/princenzmw/credit-risk-scorecard", "https://github.com/princenzmw/credit-risk-scorecard"),
        ),
        bullets=(
            "Built a Dockerized, leak-free scikit-learn pipeline over 150,000 borrower records (0.869 ROC-AUC, 0.407 PR-AUC, 0.0486 Brier) with calibrated cost-based approval cutoffs and 19 CI tests.",
        ),
    ),
    "finaccess": Entry(
        title="FinAccess Kenya 2024: Financial Inclusion Analytics",
        meta="Oct 2026 - Nov 2026 | Python, Power BI (DAX), pytest CI",
        links=(
            LinkItem("Site", "nzamuwe.com/projects/finaccess", "https://nzamuwe.com/projects/finaccess"),
            LinkItem("Code", "github.com/princenzmw/finaccess-kenya-dashboard", "https://github.com/princenzmw/finaccess-kenya-dashboard"),
        ),
        bullets=(
            "Engineered a 16 MB chunked XML parser compressing a 290 MB survey workbook (~3 GB XML) into an 8 MB CSV (19,750 adults weighted to 28.1M) reconciled via pytest CI (84.8% formal access, 9.9% excluded).",
            "Built a 5-page Power BI model finding a 45-point county gap (48.5% to 94.0%) and 63% vs 5% exclusion by national ID.",
        ),
    ),
    "finaccess_etl": Entry(
        title="FinAccess Kenya 2024: Streaming XML ETL Pipeline",
        meta="Oct 2026 - Nov 2026 | Python, pandas, XML Streaming, Power BI (DAX), pytest, Ruff, CI",
        links=(
            LinkItem("Code", "github.com/princenzmw/finaccess-kenya-dashboard", "https://github.com/princenzmw/finaccess-kenya-dashboard"),
            LinkItem("Site", "nzamuwe.com/projects/finaccess", "https://nzamuwe.com/projects/finaccess"),
        ),
        bullets=(
            "Engineered a 16 MB chunked Python XML streaming parser compressing a 290 MB workbook (~3 GB XML) into an 8 MB CSV (19,750 adults weighted to 28.1M) with automated pytest topline reconciliation (84.8% formal).",
        ),
    ),
    "mzigo": Entry(
        title="Mzigo Chakula: Kenya Food Price Inflation BI",
        meta="Oct 2026 - Nov 2026 | Power BI (PBIP/TMDL), DAX, Power Query M, pytest",
        links=(
            LinkItem("Site", "nzamuwe.com/projects/mzigo-chakula", "https://nzamuwe.com/projects/mzigo-chakula"),
            LinkItem("Code", "github.com/princenzmw/mzigo-chakula", "https://github.com/princenzmw/mzigo-chakula"),
        ),
        bullets=(
            "Modeled 55,692 World Bank RTFP rows across 233 markets, 27 counties, and 238 months (2007 to 2026) in a 4-table TMDL star schema with 4 Power Query M scripts, 15 DAX measures, 46 PBIR visuals, and pytest checks.",
        ),
    ),
    "dukapulse_ds": Entry(
        title="DukaPulse: Retail POS & Demand Telemetry",
        meta="Nov 2026 | FastAPI, TimescaleDB, PostgreSQL, Docker",
        links=(
            LinkItem("Demo", "dukapulse-kiosk.onrender.com/kiosk", "https://dukapulse-kiosk.onrender.com/kiosk"),
            LinkItem("Code", "github.com/princenzmw/DukaPulse", "https://github.com/princenzmw/DukaPulse"),
        ),
        bullets=(
            "Backtested forecasts across 14 SKUs (Seasonal-Naive won 14/14 at 1.01% to 5.43% MAPE vs 2.53% to 16.58% Holt Linear) on TimescaleDB 7-day chunk hypertables with 30m/1h aggregates and Swahili ONNX search.",
            "Built atomic SQL stock decrements (CHECK current_stock >= 0) and savepoint cart rollback; CI verified 16 threads racing 10,000 checkouts on 1 unit yielded 1 success, 9,999 HTTP 409 conflicts, and 0 oversells (30 tests).",
        ),
    ),
    "dukapulse_be": Entry(
        title="DukaPulse: Retail POS & Demand Telemetry Backend",
        meta="Nov 2026 | FastAPI, PostgreSQL, TimescaleDB, pgvector, Auth0 RS256, FastEmbed ONNX, Docker",
        links=(
            LinkItem("Demo", "dukapulse-kiosk.onrender.com/kiosk", "https://dukapulse-kiosk.onrender.com/kiosk"),
            LinkItem("Code", "github.com/princenzmw/DukaPulse", "https://github.com/princenzmw/DukaPulse"),
        ),
        bullets=(
            "Built race-proof checkouts using atomic SQL decrements, CHECK (current_stock >= 0), and savepoint cart rollbacks; CI verified 16 threads racing 10,000 checkouts on 1 unit yielded 1 success, 9,999 HTTP 409s, and 0 oversells (30 tests: 25 unit, 5 PG integration).",
            "Implemented Auth0 RS256 RBAC, TimescaleDB 7-day chunk hypertables (30m/1h continuous aggregates), Swahili 384-dim ONNX FastEmbed search, and Seasonal-Naive forecasts (won 14/14 SKUs at 1.01% to 5.43% MAPE).",
        ),
    ),
    "grid_ops": Entry(
        title="grid-ops-search: Hybrid Vector & Time-Series CLI",
        meta="Nov 2026 | Python, PostgreSQL, TimescaleDB, pgvector, pgvectorscale (DiskANN), pytest, Ruff",
        links=(
            LinkItem("Code", "github.com/princenzmw/grid-ops-search", "https://github.com/princenzmw/grid-ops-search"),
        ),
        bullets=(
            "Joined pgvector semantic note embeddings (StreamingDiskANN with HNSW fallback) and TimescaleDB 5-minute time_bucket SQL telemetry queries, adding --json CLI output and 16 unit tests in CI.",
        ),
    ),
}

VARIANTS: dict[str, ResumeVariant] = {
    "data_science": ResumeVariant(
        key="data_science",
        title="Data Science & Machine Learning Intern",
        pdf_name="Prince_Nzamuwe_Resume_Data_Science.pdf",
        docx_name="Prince_Nzamuwe_Resume_Data_Science.docx",
        public_pdf_name="resume.pdf",
        coursework="Machine Learning, Statistical Modeling & Inference, Data Warehousing, Database Systems, Optimization.",
        projects=(
            SHARED_PROJECTS["credio"],
            SHARED_PROJECTS["finaccess"],
            SHARED_PROJECTS["mzigo"],
            SHARED_PROJECTS["dukapulse_ds"],
        ),
        skills=(
            SkillGroup("Languages", "Python, SQL (PostgreSQL, MySQL), R, MATLAB, TypeScript, JavaScript"),
            SkillGroup("Data Science & BI", "scikit-learn, pandas, NumPy, Feature Engineering, Probability Calibration, ROC-AUC/PR-AUC/KS/Brier, Time-Series Forecasting, Power BI (DAX, PBIP/TMDL, Power Query M), Star Schema Modeling"),
            SkillGroup("Backend & Tooling", "FastAPI, Django REST, Flask, Streamlit, TimescaleDB, pgvector, FastEmbed, Auth0/JWT, Docker, pytest, CI"),
        ),
    ),
    "backend": ResumeVariant(
        key="backend",
        title="Python Backend Software Engineering Intern",
        pdf_name="Prince_Nzamuwe_Resume_Backend.pdf",
        docx_name="Prince_Nzamuwe_Resume_Backend.docx",
        public_pdf_name="resume-backend.pdf",
        coursework="Database Systems, Data Structures & Algorithms, Optimization, Data Warehousing, Machine Learning, Statistical Modeling.",
        projects=(
            SHARED_PROJECTS["dukapulse_be"],
            SHARED_PROJECTS["grid_ops"],
            SHARED_PROJECTS["finaccess_etl"],
            SHARED_PROJECTS["credio_compact"],
        ),
        skills=(
            SkillGroup("Languages", "Python, SQL (PostgreSQL, MySQL), C, TypeScript, JavaScript, Bash/Linux"),
            SkillGroup("Backend & Databases", "FastAPI, Django REST Framework, Flask, React, Streamlit, PostgreSQL, TimescaleDB, pgvector, SQLAlchemy, Auth0 RS256, JWT, Docker, Git, pytest, Ruff, Playwright, GitHub Actions CI"),
            SkillGroup("Data & ML Systems", "pandas, NumPy, scikit-learn, FastEmbed (ONNX), Streaming ETL Pipelines, Power BI (DAX, Power Query M), Star Schema Modeling"),
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


def _html_links(links: tuple[LinkItem, ...]) -> str:
    parts: list[str] = []
    for item in links:
        prefix = f"{html.escape(item.label)}: " if item.label else ""
        parts.append(f'{prefix}<a href="{html.escape(item.href)}">{html.escape(item.display_url)}</a>')
    return " | ".join(parts)


def render_html(variant: ResumeVariant) -> str:
    """Render an ATS-safe single-column HTML document for one resume variant."""
    def render_entries(entries: tuple[Entry, ...]) -> str:
        blocks: list[str] = []
        for entry in entries:
            sub_parts = [html.escape(entry.meta)]
            if entry.links:
                sub_parts.append(_html_links(entry.links))
            sub_html = " | ".join(sub_parts)
            bullets_html = "".join(f"<li>{html.escape(b)}</li>" for b in entry.bullets)
            blocks.append(
                f"""<div class="entry">
                  <div class="entry-title">{html.escape(entry.title)}</div>
                  <div class="entry-sub">{sub_html}</div>
                  <ul>{bullets_html}</ul>
                </div>"""
            )
        return "\n".join(blocks)

    skills_html = "\n".join(
        f'<div class="line"><strong>{html.escape(s.label)}:</strong> {html.escape(s.items)}</div>'
        for s in variant.skills
    )
    os_html = "\n".join(
        f'<li><strong>{html.escape(o.repo)}:</strong> {html.escape(o.detail)} | '
        f'<a href="{html.escape(o.href)}">{html.escape(o.display_url)}</a></li>'
        for o in OPEN_SOURCE
    )
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
      font-size: 9.5pt;
      line-height: 1.18;
      color: #111827;
      background: #ffffff;
    }}
    a {{
      color: #1d4ed8;
      text-decoration: none;
      white-space: nowrap;
    }}
    .header {{
      margin-bottom: 4.5pt;
    }}
    .header h1 {{
      font-size: 15.5pt;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.08;
    }}
    .role-title {{
      font-size: 10.2pt;
      font-weight: 700;
      color: #1d4ed8;
      margin-top: 1pt;
    }}
    .contact {{
      font-size: 9.0pt;
      color: #1f2937;
      margin-top: 1.5pt;
    }}
    h2 {{
      font-size: 10.0pt;
      font-weight: 700;
      color: #1d4ed8;
      text-transform: uppercase;
      letter-spacing: 0.35pt;
      border-bottom: 1pt solid #1d4ed8;
      padding-bottom: 1pt;
      margin-top: 5pt;
      margin-bottom: 2.5pt;
    }}
    .entry {{
      margin-bottom: 3.5pt;
    }}
    .entry:last-child {{
      margin-bottom: 0;
    }}
    .entry-title {{
      font-weight: 700;
      color: #0f172a;
      font-size: 9.6pt;
    }}
    .entry-sub {{
      font-size: 9.0pt;
      color: #334155;
      margin-top: 0.5pt;
    }}
    ul {{
      margin-top: 1.2pt;
      padding-left: 12pt;
    }}
    li {{
      margin-bottom: 1pt;
      text-align: left;
    }}
    .line {{
      margin-bottom: 1.5pt;
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
  </div>

  <h2>Education</h2>
  <div class="entry">
    <div class="entry-title">United States International University - Africa (USIU-Africa)</div>
    <div class="entry-sub">BSc in Data Science &amp; Analytics (3rd Year) | Nairobi, Kenya | Sep 2024 - Sep 2028</div>
    <ul>
      <li>Mastercard Foundation Scholar (Full Academic Scholarship). Coursework: {html.escape(variant.coursework)}</li>
    </ul>
  </div>
  <div class="entry">
    <div class="entry-title">ALX Software Engineering Programme</div>
    <div class="entry-sub">Software Engineering Foundations (9 Months) | Online (Concurrent) | Jun 2023 - May 2024</div>
    <ul>
      <li>Completed foundations in C, Python, memory management, data structures, MySQL relational databases, Linux shell tooling, and Git.</li>
    </ul>
  </div>

  <h2>Experience</h2>
  {render_entries(EXPERIENCE)}

  <h2>Projects</h2>
  {render_entries(variant.projects)}

  <h2>Technical Skills</h2>
  {skills_html}

  <h2>Open Source</h2>
  <ul>
    {os_html}
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
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn
    from docx.opc.constants import RELATIONSHIP_TYPE

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
    sz.set(qn("w:val"), str(int(font_pt * 2)))
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
    normal.font.size = Pt(9.5)
    normal.font.color.rgb = RGBColor(0x11, 0x18, 0x27)

    def add_p(space_before: float = 0, space_after: float = 1.0, line_spacing: float = 1.08):
        p = doc.add_paragraph()
        pf = p.paragraph_format
        pf.space_before = Pt(space_before)
        pf.space_after = Pt(space_after)
        pf.line_spacing = line_spacing
        return p

    def add_heading(title: str) -> None:
        p = add_p(space_before=4.5, space_after=2.0, line_spacing=1.05)
        pf = p.paragraph_format
        pf.keep_with_next = True
        r = p.add_run(title.upper())
        r.bold = True
        r.font.name = "Calibri"
        r.font.size = Pt(10.0)
        r.font.color.rgb = RGBColor(0x1D, 0x4E, 0xD8)
        _add_bottom_border(p)

    def add_bullet(text: str, prefix_bold: str = "", link: tuple[str, str] | None = None) -> None:
        p = doc.add_paragraph(style="List Bullet")
        pf = p.paragraph_format
        pf.space_before = Pt(0)
        pf.space_after = Pt(1.0)
        pf.line_spacing = 1.08
        if prefix_bold:
            rb = p.add_run(prefix_bold)
            rb.bold = True
            rb.font.name = "Calibri"
            rb.font.size = Pt(9.5)
        r = p.add_run(text)
        r.font.name = "Calibri"
        r.font.size = Pt(9.5)
        if link is not None:
            rsep = p.add_run(" | ")
            rsep.font.name = "Calibri"
            rsep.font.size = Pt(9.5)
            _add_hyperlink(p, link[0], link[1], font_pt=9.5)

    # Header in body (not Word header/footer box)
    h1 = add_p(space_before=0, space_after=0.5, line_spacing=1.05)
    r1 = h1.add_run(HEADER["name"])  # type: ignore[arg-type]
    r1.bold = True
    r1.font.name = "Calibri"
    r1.font.size = Pt(15.5)
    r1.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    sub = add_p(space_before=0, space_after=1.0, line_spacing=1.05)
    rs = sub.add_run(variant.title)
    rs.bold = True
    rs.font.name = "Calibri"
    rs.font.size = Pt(10.2)
    rs.font.color.rgb = RGBColor(0x1D, 0x4E, 0xD8)

    contact = add_p(space_before=0, space_after=2.0, line_spacing=1.08)
    rc = contact.add_run(f"{HEADER['location']} | {HEADER['phone']} | ")
    rc.font.size = Pt(9.0)
    _add_hyperlink(contact, HEADER["email"], f"mailto:{HEADER['email']}", font_pt=9.0)  # type: ignore[arg-type]
    for item in HEADER["links"]:  # type: ignore[attr-defined]
        rsep = contact.add_run(" | ")
        rsep.font.size = Pt(9.0)
        _add_hyperlink(contact, item.display_url, item.href, font_pt=9.0)

    # Education
    add_heading("Education")
    p = add_p(space_before=0, space_after=0.5)
    p.paragraph_format.keep_with_next = True
    rt = p.add_run("United States International University - Africa (USIU-Africa)")
    rt.bold = True
    rt.font.size = Pt(9.6)
    p2 = add_p(space_before=0, space_after=1.0)
    p2.paragraph_format.keep_with_next = True
    r2 = p2.add_run("BSc in Data Science & Analytics (3rd Year) | Nairobi, Kenya | Sep 2024 - Sep 2028")
    r2.font.size = Pt(9.0)
    r2.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
    add_bullet(f"Mastercard Foundation Scholar (Full Academic Scholarship). Coursework: {variant.coursework}")

    p = add_p(space_before=1.5, space_after=0.5)
    p.paragraph_format.keep_with_next = True
    rt = p.add_run("ALX Software Engineering Programme")
    rt.bold = True
    rt.font.size = Pt(9.6)
    p2 = add_p(space_before=0, space_after=1.0)
    p2.paragraph_format.keep_with_next = True
    r2 = p2.add_run("Software Engineering Foundations (9 Months) | Online (Concurrent) | Jun 2023 - May 2024")
    r2.font.size = Pt(9.0)
    r2.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
    add_bullet("Completed foundations in C, Python, memory management, data structures, MySQL relational databases, Linux shell tooling, and Git.")

    def write_entries(heading: str, entries: tuple[Entry, ...]) -> None:
        add_heading(heading)
        for idx, entry in enumerate(entries):
            pt = add_p(space_before=1.8 if idx else 0, space_after=0.5)
            pt.paragraph_format.keep_with_next = True
            rt = pt.add_run(entry.title)
            rt.bold = True
            rt.font.size = Pt(9.6)

            ps = add_p(space_before=0, space_after=1.0)
            ps.paragraph_format.keep_with_next = True
            rs = ps.add_run(entry.meta)
            rs.font.size = Pt(9.0)
            rs.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
            if entry.links:
                for item in entry.links:
                    rsep = ps.add_run(" | ")
                    rsep.font.size = Pt(9.0)
                    rsep.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
                    if item.label:
                        rlbl = ps.add_run(f"{item.label}: ")
                        rlbl.font.size = Pt(9.0)
                        rlbl.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
                    _add_hyperlink(ps, item.display_url, item.href, font_pt=9.0)

            for b in entry.bullets:
                add_bullet(b)

    write_entries("Experience", EXPERIENCE)
    write_entries("Projects", variant.projects)

    add_heading("Technical Skills")
    for sg in variant.skills:
        p = add_p(space_before=0, space_after=1.2)
        rl = p.add_run(f"{sg.label}: ")
        rl.bold = True
        rl.font.size = Pt(9.5)
        ri = p.add_run(sg.items)
        ri.font.size = Pt(9.5)

    add_heading("Open Source")
    for item in OPEN_SOURCE:
        add_bullet(item.detail, prefix_bold=f"{item.repo}: ", link=(item.display_url, item.href))

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
