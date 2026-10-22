"""resume.pdf for nzamuwe.com — mirrors Prince's Oct 2026 résumé draft.

Email updated to prince@nzamuwe.com (his own domain mailbox). DukaPulse is
included as "In development" with no invented metrics. Prince should replace
this with his final formatted résumé whenever he likes; every fact here
traces to that document or the public repositories.
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle,
)

BLUE = HexColor("#1d4ed8")
DARK = HexColor("#111827")
GRAY = HexColor("#4b5563")
LINE = HexColor("#d1d5db")

s_name = ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=19,
                        leading=23, textColor=DARK, alignment=TA_CENTER)
s_role = ParagraphStyle("role", fontName="Helvetica", fontSize=10.5, leading=14,
                        textColor=BLUE, alignment=TA_CENTER, spaceBefore=2)
s_contact = ParagraphStyle("contact", fontName="Helvetica", fontSize=9,
                           leading=12.5, textColor=GRAY, alignment=TA_CENTER,
                           spaceBefore=4)
s_h2 = ParagraphStyle("h2", fontName="Helvetica-Bold", fontSize=10.5, leading=13,
                      textColor=BLUE, spaceBefore=8, spaceAfter=3)
s_body = ParagraphStyle("body", fontName="Helvetica", fontSize=9.3, leading=13,
                        textColor=DARK, alignment=4)  # justified body only
s_left = ParagraphStyle("left", parent=s_body, alignment=0)
s_bullet = ParagraphStyle("bullet", parent=s_body, leftIndent=11,
                          bulletIndent=2, spaceBefore=1.2,
                          bulletFontName="Helvetica")
s_job = ParagraphStyle("job", fontName="Helvetica-Bold", fontSize=10,
                       leading=13, textColor=DARK)
s_meta = ParagraphStyle("meta", fontName="Helvetica", fontSize=8.7, leading=11.5,
                        textColor=GRAY)

doc = SimpleDocTemplate(
    "/home/z/my-project/public/resume.pdf", pagesize=A4,
    topMargin=14 * mm, bottomMargin=12 * mm,
    leftMargin=17 * mm, rightMargin=17 * mm,
    title="Prince Nzamuwe — Résumé",
    author="Prince Nzamuwe",
)

story = [
    Paragraph("PRINCE NZAMUWE", s_name),
    Paragraph("Data Science &amp; Analytics — Machine Learning · Data-Driven Apps · Backend Development",
              s_role),
    Paragraph(
        "Nairobi, Kenya &nbsp;·&nbsp; +254 757 723 708 &nbsp;·&nbsp; prince@nzamuwe.com",
        s_contact),
    Paragraph(
        "github.com/princenzmw &nbsp;·&nbsp; linkedin.com/in/princenzmw &nbsp;·&nbsp; "
        "credio.streamlit.app", s_contact),
    HRFlowable(width="100%", thickness=1.1, color=BLUE, spaceBefore=6, spaceAfter=2),

    Paragraph("PROFILE", s_h2),
    Paragraph(
        "Data science and backend-focused 3rd-year BSc Data Science &amp; Analytics student at "
        "USIU-Africa (expected 2028). Builds data-driven applications end to end: PostgreSQL data "
        "models, Python machine learning, FastAPI services and React front ends — tested and "
        "deployed. Trained through the ALX Software Engineering Programme (Foundations Phase) and "
        "Andela's ATLP. Open to data, ML and software internships; available for freelance data "
        "analysis, dashboard and web development projects.", s_body),

    Paragraph("PROJECTS", s_h2),
    Paragraph("Credio — Credit-Risk Scorecard "
              '<font color="#4b5563" size="8.5">(github.com/princenzmw/credit-risk-scorecard · credio.streamlit.app)</font>',
              s_job),
    Paragraph("Python, scikit-learn, pandas, Streamlit, pytest, GitHub Actions.", s_meta),
    Paragraph("Built a leak-free credit-default pipeline on 150,000 borrowers: handled special codes and 20% missing income inside the scikit-learn pipeline; gradient boosting reached 0.869 ROC-AUC and 0.407 PR-AUC on a held-out test set (logistic baseline: 0.823 on validation).", s_bullet, bulletText="•"),
    Paragraph("Produced calibrated risk bands (observed default 1.1% to 39.0%) and a cost-based approval threshold; tested class weights and SMOTE and rejected both because they distorted predicted probabilities.", s_bullet, bulletText="•"),
    Paragraph("Deployed a Streamlit app with per-applicant explanations, 19 unit tests and GitHub Actions CI.", s_bullet, bulletText="•"),
    Spacer(1, 4),
    Paragraph("FinAccess Kenya — Financial Inclusion Dashboard "
              '<font color="#4b5563" size="8.5">(github.com/princenzmw/finaccess-kenya-dashboard)</font>',
              s_job),
    Paragraph("Power BI (DAX), Python, pandas.", s_meta),
    Paragraph("Built a five-page Power BI dashboard on the 2024 FinAccess survey (19,750 adults, survey-weighted to 28.1 million) covering access, county gaps, digital credit and exclusion drivers.", s_bullet, bulletText="•"),
    Paragraph("Wrote a streaming prep script that turned a 290 MB workbook into an 8 MB CSV and reconciled weighted results to the published topline (84.8% formal access, 9.9% excluded).", s_bullet, bulletText="•"),
    Paragraph("Found county formal access ranging from 48.5% to 94.0%, and 63% exclusion among adults without an ID vs 5% with one.", s_bullet, bulletText="•"),
    Spacer(1, 4),
    Paragraph("DukaPulse — Stock &amp; Sales App for Small Shops "
              '<font color="#4b5563" size="8.5">(in development — links publish with v1.0)</font>',
              s_job),
    Paragraph("FastAPI, PostgreSQL, React, TypeScript, Docker.", s_meta),
    Paragraph("Building a full-stack stock and sales app with JWT authentication, owner and staff roles, and sales that cannot oversell stock; 4-week demand forecasts per product, backtested against a seasonal-naive baseline.", s_bullet, bulletText="•"),
    Paragraph("pytest backend suite + Playwright end-to-end tests; CI on GitHub Actions; deploy targets Vercel, Render and Neon.", s_bullet, bulletText="•"),
    Spacer(1, 4),
    Paragraph("AirBnB Clone v4 "
              '<font color="#4b5563" size="8.5">(github.com/princenzmw/AirBnB_clone_v4)</font>',
              s_job),
    Paragraph("Four-iteration full-stack build: CLI console → SQLAlchemy ORM → Flask REST API → dynamic web frontend, with unit tests throughout. Python, MySQL, Docker.", s_bullet, bulletText="•"),

    Paragraph("EXPERIENCE", s_h2),
    Paragraph("Apprentice — Andela Technical Leadership Program (ATLP) "
              '<font color="#4b5563" size="8.5">Rwanda · Jan 2024 – Sep 2024</font>', s_job),
    Paragraph("Shipped features of a full-stack e-commerce app (TypeScript, React, PostgreSQL) in a 9-person Agile team and performed code reviews; designed the normalized PostgreSQL schema for products, users and orders.", s_bullet, bulletText="•"),
    Spacer(1, 3),
    Paragraph("Trainee — Ida Technology (NEET program) "
              '<font color="#4b5563" size="8.5">Rwanda · Dec 2023 – Jun 2024</font>', s_job),
    Paragraph("Built Django/React web apps with JWT authentication; converted Figma designs into responsive React components.", s_bullet, bulletText="•"),

    Paragraph("SKILLS", s_h2),
]
skills = [
    ["Data &amp; ML", "Python (pandas, scikit-learn), SQL (PostgreSQL, MySQL), Power BI (DAX), R, MATLAB, Excel"],
    ["Web &amp; Software", "FastAPI, Django, Flask, TypeScript, JavaScript, React, REST APIs, JWT authentication, Streamlit"],
    ["Tools &amp; Practice", "Git/GitHub, GitHub Actions (CI), Docker, pytest, Playwright, Agile teamwork, code review, Figma-to-code"],
]
tbl = Table([[Paragraph(f"<b>{a}</b>", s_left), Paragraph(b, s_left)] for a, b in skills],
            colWidths=[36 * mm, None])
tbl.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ("TOPPADDING", (0, 0), (-1, -1), 3),
    ("LINEBELOW", (0, 0), (-1, -2), 0.4, LINE),
]))
story += [tbl,

    Paragraph("EDUCATION", s_h2),
    Paragraph("BSc Data Science &amp; Analytics — United States International University – Africa (USIU-Africa), Nairobi "
              '<font color="#4b5563" size="8.5">2024 – expected 2028 (3rd year)</font>', s_job),
    Paragraph("Relevant coursework: Statistical Modeling, Machine Learning, Statistical Inference, Data Warehousing &amp; Mining, Optimization, Statistical Computing, Data Structures &amp; Algorithms, Database Systems.", s_meta),
    Paragraph("ALX Software Engineering Programme (online) — completed the 9-month Foundations Phase; project repositories on GitHub.", s_left),

    Paragraph("CERTIFICATIONS", s_h2),
    Paragraph("Back-End Developer Certificate, Meta &nbsp;·&nbsp; JavaScript Algorithms and Data Structures, freeCodeCamp "
              "&nbsp;·&nbsp; Artificial Intelligence Fundamentals, IBM SkillsBuild", s_left),

    Paragraph("REFERENCES", s_h2),
    Paragraph("References &amp; background checks welcome. Full commit history and "
              "project write-ups at github.com/princenzmw.", s_left),
]

doc.build(story)
print("resume.pdf written")
