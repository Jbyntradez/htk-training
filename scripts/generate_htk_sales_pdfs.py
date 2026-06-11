from __future__ import annotations

import csv
import html
import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import landscape, letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    ListFlowable,
    ListItem,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.platypus.tableofcontents import TableOfContents


ROOT = Path(__file__).resolve().parents[1]
SALES = ROOT / "htk-sales-operating-system"

NAVY = colors.HexColor("#17365D")
NAVY_2 = colors.HexColor("#1F497D")
NAVY_DARK = colors.HexColor("#10243E")
GOLD = colors.HexColor("#C7A253")
TEXT = colors.HexColor("#2B2F33")
MUTED = colors.HexColor("#667085")
LINE = colors.HexColor("#D7DEE8")
FILL = colors.HexColor("#F5F7FA")
RED = colors.HexColor("#852424")
RED_FILL = colors.HexColor("#FAEEEE")
GREEN = colors.HexColor("#1E6B43")
GREEN_FILL = colors.HexColor("#EEF7F2")


def escape_inline(text: str) -> str:
    escaped = html.escape(text, quote=False)
    escaped = re.sub(r"`([^`]+)`", r'<font name="Courier" color="#10243E">\1</font>', escaped)
    escaped = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", escaped)
    escaped = re.sub(r"\*(.+?)\*", r"<i>\1</i>", escaped)
    return escaped


def is_table_separator(line: str) -> bool:
    s = line.strip()
    if not (s.startswith("|") and s.endswith("|")):
        return False
    cells = [c.strip() for c in s.strip("|").split("|")]
    return bool(cells) and all(re.match(r"^:?-{3,}:?$", c) for c in cells)


def split_table_row(line: str) -> list[str]:
    return [c.strip() for c in line.strip().strip("|").split("|")]


def build_styles(compact: bool = False):
    ss = getSampleStyleSheet()
    body_size = 8.9 if compact else 9.5
    body_leading = 11.4 if compact else 12.4
    ss.add(
        ParagraphStyle(
            "CoverTitleHTK",
            parent=ss["Title"],
            fontName="Helvetica-Bold",
            fontSize=29,
            leading=34,
            textColor=NAVY_DARK,
            alignment=TA_CENTER,
            spaceAfter=12,
        )
    )
    ss.add(
        ParagraphStyle(
            "CoverSubHTK",
            parent=ss["Normal"],
            fontName="Helvetica",
            fontSize=11.5,
            leading=15,
            textColor=TEXT,
            alignment=TA_CENTER,
            spaceAfter=5,
        )
    )
    ss.add(
        ParagraphStyle(
            "TocTitleHTK",
            parent=ss["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=19,
            leading=23,
            textColor=NAVY_DARK,
            spaceAfter=18,
        )
    )
    ss.add(
        ParagraphStyle(
            "H1HTK",
            parent=ss["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=15,
            leading=18,
            textColor=colors.white,
            backColor=NAVY,
            borderColor=NAVY,
            borderWidth=0.25,
            borderPadding=(6, 8, 6, 8),
            spaceBefore=8,
            spaceAfter=8,
            keepWithNext=1,
        )
    )
    ss.add(
        ParagraphStyle(
            "H2HTK",
            parent=ss["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12.3,
            leading=14.7,
            textColor=NAVY_DARK,
            spaceBefore=8,
            spaceAfter=4,
            keepWithNext=1,
        )
    )
    ss.add(
        ParagraphStyle(
            "H3HTK",
            parent=ss["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=10.5,
            leading=12.5,
            textColor=NAVY_2,
            spaceBefore=6,
            spaceAfter=3,
            keepWithNext=1,
        )
    )
    ss.add(
        ParagraphStyle(
            "H4HTK",
            parent=ss["Heading4"],
            fontName="Helvetica-Bold",
            fontSize=9.4,
            leading=11.2,
            textColor=NAVY_DARK,
            spaceBefore=5,
            spaceAfter=2,
            keepWithNext=1,
        )
    )
    ss.add(
        ParagraphStyle(
            "BodyHTK",
            parent=ss["BodyText"],
            fontName="Helvetica",
            fontSize=body_size,
            leading=body_leading,
            textColor=TEXT,
            spaceBefore=0,
            spaceAfter=4.2 if compact else 5.3,
        )
    )
    ss.add(
        ParagraphStyle(
            "BulletHTK",
            parent=ss["BodyHTK"],
            leftIndent=14,
            firstLineIndent=-7,
            bulletIndent=2,
            spaceAfter=2.5 if compact else 3.2,
        )
    )
    ss.add(
        ParagraphStyle(
            "NumberHTK",
            parent=ss["BodyHTK"],
            leftIndent=18,
            firstLineIndent=-12,
            bulletIndent=0,
            spaceAfter=2.5 if compact else 3.2,
        )
    )
    ss.add(
        ParagraphStyle(
            "QuoteHTK",
            parent=ss["BodyHTK"],
            fontName="Helvetica-Oblique",
            leftIndent=12,
            rightIndent=8,
            borderColor=GOLD,
            borderWidth=0,
            borderPadding=(4, 6, 4, 8),
            backColor=colors.HexColor("#FBF8EF"),
            spaceBefore=3,
            spaceAfter=6,
        )
    )
    ss.add(
        ParagraphStyle(
            "TableCellHTK",
            parent=ss["BodyHTK"],
            fontSize=7.6 if compact else 8.1,
            leading=9.2 if compact else 9.9,
            spaceAfter=0,
        )
    )
    ss.add(
        ParagraphStyle(
            "TableHeadHTK",
            parent=ss["TableCellHTK"],
            fontName="Helvetica-Bold",
            textColor=colors.white,
        )
    )
    ss.add(
        ParagraphStyle(
            "CodeHTK",
            parent=ss["BodyHTK"],
            fontName="Courier",
            fontSize=7.2,
            leading=8.7,
            textColor=NAVY_DARK,
            backColor=FILL,
            borderColor=LINE,
            borderWidth=0.4,
            borderPadding=(4, 5, 4, 5),
        )
    )
    ss.add(
        ParagraphStyle(
            "TOC0HTK",
            parent=ss["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9.5,
            leading=12,
            textColor=NAVY_DARK,
            spaceAfter=2,
        )
    )
    ss.add(
        ParagraphStyle(
            "TOC1HTK",
            parent=ss["Normal"],
            fontName="Helvetica",
            fontSize=8.3,
            leading=10.2,
            leftIndent=14,
            textColor=TEXT,
            spaceAfter=1,
        )
    )
    ss.add(
        ParagraphStyle(
            "TOC2HTK",
            parent=ss["Normal"],
            fontName="Helvetica",
            fontSize=7.7,
            leading=9.5,
            leftIndent=26,
            textColor=MUTED,
            spaceAfter=0.5,
        )
    )
    return ss


class HTKDoc(BaseDocTemplate):
    def __init__(self, filename, doc_title, **kwargs):
        super().__init__(filename, **kwargs)
        self.doc_title = doc_title

    def afterFlowable(self, flowable):
        if isinstance(flowable, Paragraph):
            style = flowable.style.name
            if style in ("H1HTK", "H2HTK", "H3HTK"):
                level = {"H1HTK": 0, "H2HTK": 1, "H3HTK": 2}[style]
                if level <= 1:
                    self.notify("TOCEntry", (level, flowable.getPlainText(), self.page))


def make_header_footer(title: str):
    def draw(canvas_obj, doc):
        canvas_obj.saveState()
        p = canvas_obj.getPageNumber()
        if p > 1:
            width, height = doc.pagesize
            left = doc.leftMargin
            right = width - doc.rightMargin
            canvas_obj.setStrokeColor(LINE)
            canvas_obj.setLineWidth(0.5)
            canvas_obj.line(left, height - 0.50 * inch, right, height - 0.50 * inch)
            canvas_obj.setFillColor(NAVY_DARK)
            canvas_obj.setFont("Helvetica-Bold", 7.6)
            canvas_obj.drawString(left, height - 0.39 * inch, title)
            canvas_obj.setFillColor(MUTED)
            canvas_obj.setFont("Helvetica", 7.2)
            canvas_obj.drawRightString(right, height - 0.39 * inch, "Hard To Kill Training")
            canvas_obj.line(left, 0.50 * inch, right, 0.50 * inch)
            canvas_obj.drawRightString(right, 0.33 * inch, f"Page {p}")
        canvas_obj.restoreState()

    return draw


def make_table(rows: list[list[str]], styles, width: float, compact: bool = False):
    if len(rows) >= 2 and all(re.match(r"^:?-{3,}:?$", c) for c in rows[1]):
        header = rows[0]
        body = rows[2:]
    else:
        header = rows[0]
        body = rows[1:]
    col_count = len(header)
    data = [[Paragraph(escape_inline(c), styles["TableHeadHTK"]) for c in header]]
    for row in body:
        row = row + [""] * (col_count - len(row))
        data.append([Paragraph(escape_inline(c), styles["TableCellHTK"]) for c in row[:col_count]])

    if col_count == 2:
        col_widths = [width * 0.38, width * 0.62]
    elif col_count == 3:
        col_widths = [width * 0.50, width * 0.25, width * 0.25]
    elif col_count == 4:
        col_widths = [width * 0.33, width * 0.22, width * 0.22, width * 0.23]
    else:
        col_widths = [width / max(1, col_count)] * col_count

    table = Table(data, colWidths=col_widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), NAVY),
                ("GRID", (0, 0), (-1, -1), 0.3, LINE),
                ("BOX", (0, 0), (-1, -1), 0.5, LINE),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5 if compact else 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5 if compact else 6),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, FILL]),
            ]
        )
    )
    return table


def parse_markdown(md: str, styles, frame_width: float, major_breaks: bool = False, compact: bool = False):
    flows = []
    lines = md.splitlines()
    i = 0
    in_code = False
    code_lines: list[str] = []

    def flush_code():
        nonlocal code_lines
        if code_lines:
            code = "<br/>".join(html.escape(line, quote=False) for line in code_lines)
            flows.append(Paragraph(code, styles["CodeHTK"]))
            flows.append(Spacer(1, 5))
            code_lines = []

    while i < len(lines):
        raw = lines[i]
        line = raw.rstrip()
        stripped = line.strip()
        if stripped.startswith("```"):
            if in_code:
                flush_code()
                in_code = False
            else:
                in_code = True
            i += 1
            continue
        if in_code:
            code_lines.append(line)
            i += 1
            continue
        if not stripped:
            i += 1
            continue

        if stripped.startswith("|") and i + 1 < len(lines) and is_table_separator(lines[i + 1]):
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                rows.append(split_table_row(lines[i]))
                i += 1
            flows.append(Spacer(1, 3))
            flows.append(make_table(rows, styles, frame_width, compact=compact))
            flows.append(Spacer(1, 7))
            continue

        m = re.match(r"^(#{1,4})\s+(.*)$", stripped)
        if m:
            level = len(m.group(1))
            text = m.group(2).strip()
            if major_breaks and level == 1 and flows:
                flows.append(PageBreak())
            style = {1: "H1HTK", 2: "H2HTK", 3: "H3HTK", 4: "H4HTK"}[level]
            flows.append(Paragraph(escape_inline(text), styles[style]))
            i += 1
            continue

        if stripped.startswith(">"):
            quote_lines = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                quote_lines.append(lines[i].strip().lstrip(">").strip())
                i += 1
            flows.append(Paragraph(escape_inline(" ".join(quote_lines)), styles["QuoteHTK"]))
            continue

        if stripped.startswith("- "):
            items = []
            while i < len(lines) and lines[i].strip().startswith("- "):
                text = lines[i].strip()[2:].strip()
                if text.startswith("[ ] "):
                    text = "□ " + text[4:]
                elif text.startswith("[x] ") or text.startswith("[X] "):
                    text = "☑ " + text[4:]
                items.append(text)
                i += 1
            list_items = [
                ListItem(Paragraph(escape_inline(item), styles["BulletHTK"]), bulletText="•")
                for item in items
            ]
            flows.append(
                ListFlowable(
                    list_items,
                    bulletType="bullet",
                    leftIndent=0,
                    bulletFontName="Helvetica",
                    bulletFontSize=8,
                    bulletColor=NAVY,
                )
            )
            flows.append(Spacer(1, 2))
            continue

        if re.match(r"^\d+\.\s+", stripped):
            items = []
            while i < len(lines):
                mm = re.match(r"^(\d+)\.\s+(.*)$", lines[i].strip())
                if not mm:
                    break
                items.append((mm.group(1) + ".", mm.group(2)))
                i += 1
            list_items = [
                ListItem(Paragraph(escape_inline(text), styles["NumberHTK"]), bulletText=marker)
                for marker, text in items
            ]
            flows.append(
                ListFlowable(
                    list_items,
                    bulletType="1",
                    leftIndent=0,
                    bulletFontName="Helvetica",
                    bulletFontSize=8,
                    bulletColor=NAVY,
                )
            )
            flows.append(Spacer(1, 2))
            continue

        parts = [stripped]
        i += 1
        while i < len(lines):
            nxt = lines[i].strip()
            if (
                not nxt
                or nxt.startswith("#")
                or nxt.startswith("- ")
                or nxt.startswith("|")
                or nxt.startswith(">")
                or nxt.startswith("```")
                or re.match(r"^\d+\.\s+", nxt)
            ):
                break
            parts.append(nxt)
            i += 1
        flows.append(Paragraph(escape_inline(" ".join(parts)), styles["BodyHTK"]))

    flush_code()
    return flows


def cover_story(title: str, subtitle: str, descriptor: str, styles):
    rule = Table([[""]], colWidths=[2.8 * inch], rowHeights=[3])
    rule.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), GOLD)]))
    return [
        Spacer(1, 2.15 * inch),
        Paragraph(title, styles["CoverTitleHTK"]),
        Paragraph(subtitle, styles["CoverSubHTK"]),
        Spacer(1, 0.25 * inch),
        rule,
        Spacer(1, 2.2 * inch),
        Paragraph(descriptor, styles["CoverSubHTK"]),
        PageBreak(),
    ]


def build_doc(filename: Path, title: str, subtitle: str, descriptor: str, content_md: str, *, compact=False, major_breaks=False):
    page_w, page_h = letter
    left = right = 0.64 * inch
    top = 0.70 * inch
    bottom = 0.66 * inch
    frame_width = page_w - left - right
    styles = build_styles(compact=compact)
    doc = HTKDoc(
        str(filename),
        title,
        pagesize=letter,
        leftMargin=left,
        rightMargin=right,
        topMargin=top,
        bottomMargin=bottom,
        title=title,
        author="Hard To Kill Training",
    )
    frame = Frame(left, bottom, frame_width, page_h - top - bottom, id="normal", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=make_header_footer(title))])

    toc = TableOfContents()
    toc.levelStyles = [styles["TOC0HTK"], styles["TOC1HTK"], styles["TOC2HTK"]]
    story = cover_story(title, subtitle, descriptor, styles)
    story.extend([Paragraph("Table of Contents", styles["TocTitleHTK"]), toc, PageBreak()])
    story.extend(parse_markdown(content_md, styles, frame_width, major_breaks=major_breaks, compact=compact))
    doc.multiBuild(story)


def read_sales_manual_md() -> str:
    ordered = [
        SALES / "README.md",
        SALES / "01_positioning/HTK_Positioning.md",
        SALES / "02_ideal_client_profile/Ideal_Client_Profile.md",
        SALES / "03_disqualification/Disqualification_Framework.md",
        SALES / "04_sales_process/Sales_Process_Overview.md",
        SALES / "05_discovery_call/Discovery_Call_Framework.md",
        SALES / "06_needs_analysis/HTK_Needs_Analysis.md",
        SALES / "07_offer_presentation/Offer_Presentation_Script.md",
        SALES / "08_objection_handling/Objection_Handling_Library.md",
        SALES / "09_closing/Closing_Framework.md",
        SALES / "10_payment_enrollment/Payment_Enrollment_Process.md",
        SALES / "11_crm/CRM_Requirements.md",
        SALES / "12_follow_up/Follow_Up_System.md",
        SALES / "13_sales_kpis/Sales_KPIs.md",
        SALES / "14_brand_protection/HTK_Brand_Protection_Rules.md",
        SALES / "15_certification/HTK_Closer_Certification_Program.md",
        SALES / "16_command_sheet/HTK_ONE_PAGE_CLOSER_COMMAND_SHEET.md",
    ]
    parts = []
    for path in ordered:
        txt = path.read_text(encoding="utf-8").strip()
        if path.name == "README.md":
            txt = txt.replace("# HTK SALES OPERATING SYSTEM", "# Repository Overview")
        parts.append(txt)
    parts.append(template_appendix_md())
    return "\n\n".join(parts)


def template_appendix_md() -> str:
    out = ["# Templates Appendix"]
    for name in ["Discovery_Call_Notes.md", "Call_QA_Scorecard.md", "Enrollment_Handoff_Template.md"]:
        path = SALES / "templates" / name
        out.append(path.read_text(encoding="utf-8").strip())
    for name in ["Closer_CRM_Template.csv", "Daily_Sales_Report_Template.csv"]:
        path = SALES / "templates" / name
        fields = next(csv.reader([path.read_text(encoding="utf-8").splitlines()[0]]))
        out.append(f"## {name}")
        out.append("Required fields:")
        out.extend(f"- `{field}`" for field in fields)
    return "\n\n".join(out)


QUICKSTART_MD = r"""
# HTK Sales Quickstart

## 1. Mission

The closer's job is to help qualified prospects make a clear decision about HTK coaching.

- Confirm fit.
- Run a disciplined discovery call.
- Identify goals, obstacles, consequences, and commitment.
- Present HTK only when fit is clear.
- Close without pressure.
- Disqualify poor-fit prospects.
- Protect the HTK brand.

HTK is performance coaching for men who want to be strong, conditioned, mobile, athletic, durable, and capable in real life. HTK is not bodybuilding-only coaching, medical care, injury rehab, or free programming.

## 2. HTK Positioning To Memorize

Use this exact positioning:

> HTK is performance coaching for men who want to be strong, conditioned, mobile, athletic, and capable in real life. It is built around athleticism and durability, not bodybuilding-only training.

Use this to separate HTK from bodybuilding:

> Looking better can happen as a byproduct of better training and consistency, but HTK is not a bodybuilding-only program. The center of the work is performance: strength, conditioning, mobility, durability, and athleticism.

## 3. Ideal Prospect Snapshot

### A-Tier

- Man age 18-45.
- Athlete, former athlete, military, veteran, first responder, tactical professional, serious fitness enthusiast, or high performer.
- Wants performance, durability, conditioning, athleticism, mobility, or real-world capability.
- Takes responsibility and values coaching.
- Has a meaningful reason to act now.

### B-Tier

- General fitness or busy professional with some performance interest.
- Wants consistency, structure, and better training.
- Needs discovery to clarify goal, urgency, and commitment.

### C-Tier

- Bodybuilding-only, quick-fix, free-coaching, guarantee-seeking, or low-accountability prospect.
- Do not pressure. Disqualify respectfully when fit is not there.

## 4. Call Flow

1. Open: "The goal is to see whether HTK is actually a fit."
2. Rapport: Keep it relevant to training, sport, service, work, and schedule.
3. Goal: What is he trying to build?
4. Current state: What does training look like now?
5. Obstacle: What is holding it back?
6. Consequence: What happens if nothing changes?
7. Desired outcome: What would success look like?
8. Commitment: Is he willing to train, communicate, and be coached?
9. Decision process: Can he decide today? Anyone else involved?
10. Offer: Present only if fit is clear.
11. Close: Ask for a clear decision.
12. CRM: Log outcome and next action immediately.

## 5. Discovery Questions

### Goal

- "What are you trying to build right now?"
- "What would be different in 90 days if training was working?"
- "What matters most: strength, conditioning, mobility, speed, durability, or feeling athletic again?"

### Current Situation

- "What does your training look like right now?"
- "Are you following a plan or piecing it together?"
- "What are you doing for strength, conditioning, and mobility?"

### Obstacle

- "What has been the main thing holding that goal back?"
- "What have you tried already?"
- "Why did that not solve it?"

### Consequence

- "If nothing changes for six months, what happens?"
- "What is the cost of staying where you are?"
- "Why not just keep doing what you are doing now?"

### Commitment

- "How serious are you about fixing this now?"
- "Are you open to being coached and held accountable?"
- "If HTK is a fit, are you in a position to make a decision today?"

## 6. Qualification Checklist

A prospect is qualified when:

- [ ] Fits HTK market.
- [ ] Has a performance-related goal.
- [ ] Has a meaningful obstacle.
- [ ] Wants progress now.
- [ ] Open to coaching and accountability.
- [ ] Willing to train consistently.
- [ ] Understands HTK is not bodybuilding-only.
- [ ] Can make or define a real decision.

## 7. Disqualification Checklist

Do not sell when:

- [ ] Under 18.
- [ ] Wants bodybuilding-only and rejects performance.
- [ ] Wants quick fix or guaranteed result.
- [ ] Refuses accountability.
- [ ] Wants free coaching or full plan on call.
- [ ] Wants medical, injury, rehab, or pain advice.
- [ ] Cannot train consistently and refuses change.
- [ ] Hostile, unsafe, explicit, or abusive.
- [ ] Investment would create serious financial distress.

## 8. Offer Presentation

Transition:

> Based on what you told me, the gap is not effort. You have been willing to train. The gap is structure, direction, and accountability around the kind of performance you want to build. HTK is designed for that.

Offer structure:

1. Re-anchor the prospect's goal.
2. Re-anchor the main obstacle.
3. Explain HTK as performance coaching.
4. Explain structure, programming direction, accountability, and adjustment.
5. Explain expected client commitment.
6. Present approved current terms.
7. Ask what is unclear.
8. Move to decision.

Do not invent discounts, bonuses, scarcity, guarantees, refund terms, coach access, or timeline promises.

## 9. Objection Map

| Objection | Ask |
|---|---|
| I need to think | "What part do you need to think through: fit, timing, investment, or execution?" |
| Too expensive | "Is it affordability, or whether the coaching is worth it?" |
| No time | "Is time the issue, or not having structure around the time you do have?" |
| I can do it myself | "What has stopped you from doing it so far?" |
| Maybe later | "What would need to change later?" |
| Talk to spouse | "If they are good with it, do you want to move forward?" |
| Free content first | "What are you hoping free content will solve?" |
| Not sure it works | "Is that based on HTK, or past attempts?" |

Stop pushing when the prospect requires a guarantee, refuses accountability, cannot afford it without real distress, gives a clear no, or is not a fit.

## 10. Closing Language

Fit close:

> Based on what you told me, HTK fits the goal. You want [goal], the main thing holding it back is [obstacle], and you said you are ready to [commitment]. The next step is enrollment. Do you want to move forward?

Clarity close:

> Is the hesitation about fit, timing, investment, or whether you will follow through?

Disqualification close:

> I do not think HTK is the cleanest fit right now, and I would rather tell you straight than force the offer where it does not belong.

## 11. Enrollment Rules

Before payment:

- [ ] Prospect is qualified.
- [ ] Prospect gave clear yes.
- [ ] Current approved price and terms were stated accurately.
- [ ] No guarantee was made.
- [ ] No medical advice was given.
- [ ] CRM notes are complete enough for onboarding.

After payment:

1. Confirm payment in the approved system.
2. Move CRM to Closed Won.
3. Record payment date, offer, terms, and revenue.
4. Send enrollment confirmation.
5. Submit onboarding handoff.

## 12. CRM Must-Haves

Every completed call must log:

- Stage
- Show status
- Goal
- Current situation
- Main obstacle
- Consequence
- Desired outcome
- Commitment level
- Decision process
- Offer presented yes/no
- Objections
- Outcome
- Next action/date or closed-lost reason
- Payment status if won
- Handoff status if enrolled

## 13. Follow-Up Cadence

| Timing | Purpose |
|---|---|
| Day 1 | Clarify next step while call is fresh |
| Day 3 | Re-anchor goal and unresolved decision |
| Day 7 | Decision check |
| Day 14 | Respectful close-loop |
| Day 30 | Relationship-based reactivation only if appropriate |

## 14. Brand Protection

- No guarantees.
- No medical advice.
- No false urgency.
- No invented discounts, refunds, bonuses, or terms.
- No pressure after a clear no.
- No selling poor-fit prospects.
- No public arguments or private-detail sharing.
- When unsure, stop and escalate.

## 15. First Week Certification Path

Day 1: Memorize positioning and brand rules.

Day 2: Score sample prospects and red flags.

Day 3: Role-play discovery calls.

Day 4: Role-play offer, objections, and close.

Day 5: Complete CRM, enrollment, and handoff drills.

Closer may handle live prospects only after manager certification.
"""


def draw_command_sheet(path: Path):
    W, H = landscape(letter)
    c = canvas.Canvas(str(path), pagesize=landscape(letter))
    c.setTitle("HTK CLOSER COMMAND SHEET")
    c.setAuthor("Hard To Kill Training")
    margin = 24
    header_h = 43
    gap = 8
    usable_w = W - 2 * margin
    col_w = (usable_w - 2 * gap) / 3
    x1 = margin
    x2 = margin + col_w + gap
    x3 = margin + 2 * (col_w + gap)
    y_top = H - header_h - 13

    c.setFillColor(NAVY)
    c.rect(0, H - header_h, W, header_h, stroke=0, fill=1)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(margin, H - 27, "HTK CLOSER COMMAND SHEET")
    c.setFont("Helvetica", 8.3)
    c.drawRightString(W - margin, H - 17, "Live Sales Call Quick Reference")
    c.setFillColor(GOLD)
    c.rect(margin, H - header_h - 3, 185, 3, stroke=0, fill=1)

    def wrap(text, font, size, width):
        words = text.split()
        lines, cur = [], ""
        for word in words:
            trial = word if not cur else cur + " " + word
            if stringWidth(trial, font, size) <= width:
                cur = trial
            else:
                if cur:
                    lines.append(cur)
                cur = word
        if cur:
            lines.append(cur)
        return lines

    def line_text(text, x, y, w, bullet="•", size=6.2, leading=7.15):
        c.setFillColor(TEXT)
        c.setFont("Helvetica", size)
        if bullet:
            c.drawString(x, y, bullet)
            tx = x + 8
            tw = w - 8
        else:
            tx = x
            tw = w
        for idx, ln in enumerate(wrap(text, "Helvetica", size, tw)):
            c.drawString(tx, y - idx * leading, ln)
        return y - max(1, len(wrap(text, "Helvetica", size, tw))) * leading

    def box(x, y, w, h, title, items, *, fill=colors.white, head=NAVY, numbered=False, size=6.2, leading=7.1):
        c.setStrokeColor(LINE)
        c.setFillColor(fill)
        c.roundRect(x, y - h, w, h, 3, stroke=1, fill=1)
        c.setFillColor(head)
        c.roundRect(x, y - 17, w, 17, 3, stroke=0, fill=1)
        c.rect(x, y - 17, w, 8, stroke=0, fill=1)
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 8.1)
        c.drawString(x + 6, y - 11.5, title)
        yy = y - 24
        for idx, item in enumerate(items, 1):
            marker = f"{idx}." if numbered else "•"
            yy = line_text(item, x + 7, yy, w - 14, bullet=marker, size=size, leading=leading)
            yy -= 1.0
        return y - h

    def checks(x, y, w, h, title, items, *, fill=GREEN_FILL, head=GREEN):
        c.setStrokeColor(LINE)
        c.setFillColor(fill)
        c.roundRect(x, y - h, w, h, 3, stroke=1, fill=1)
        c.setFillColor(head)
        c.roundRect(x, y - 17, w, 17, 3, stroke=0, fill=1)
        c.rect(x, y - 17, w, 8, stroke=0, fill=1)
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 8.1)
        c.drawString(x + 6, y - 11.5, title)
        yy = y - 24
        for item in items:
            c.setStrokeColor(LINE)
            c.rect(x + 7, yy - 4.2, 5, 5, stroke=1, fill=0)
            yy = line_text(item, x + 17, yy, w - 24, bullet=None, size=6.2, leading=7.1)
            yy -= 1.0
        return y - h

    def mini_table(x, y, w, h):
        c.setStrokeColor(LINE)
        c.setFillColor(colors.white)
        c.roundRect(x, y - h, w, h, 3, stroke=1, fill=1)
        c.setFillColor(NAVY)
        c.roundRect(x, y - 17, w, 17, 3, stroke=0, fill=1)
        c.rect(x, y - 17, w, 8, stroke=0, fill=1)
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 8.1)
        c.drawString(x + 6, y - 11.5, "OBJECTION CHEAT SHEET")
        rows = [
            ("Think", "What part: fit, timing, investment, execution?"),
            ("Price", "Affordability or value?"),
            ("Time", "No time, or no structure around the time?"),
            ("Myself", "What stopped you so far?"),
            ("Later", "What changes later?"),
            ("Spouse", "If yes from them, do you move?"),
            ("Free", "What will free content solve?"),
            ("Work?", "HTK concern or past attempts?"),
        ]
        row_h = 13
        yy = y - 24
        c.setFont("Helvetica-Bold", 5.9)
        c.setFillColor(NAVY_DARK)
        for label, q in rows:
            c.setFillColor(FILL if rows.index((label, q)) % 2 else colors.white)
            c.rect(x + 6, yy - row_h + 4, w - 12, row_h, stroke=0, fill=1)
            c.setFillColor(NAVY_DARK)
            c.setFont("Helvetica-Bold", 5.85)
            c.drawString(x + 9, yy - 5, label)
            c.setFont("Helvetica", 5.85)
            c.drawString(x + 45, yy - 5, q)
            yy -= row_h
        return y - h

    flow = [
        "Open: set frame, fit call, no pressure.",
        "Rapport: relevant to training, sport, service, work, schedule.",
        "Goal: what is he trying to build?",
        "Current state: training now, strength, conditioning, mobility.",
        "Obstacle: what keeps blocking it?",
        "Consequence: what happens if nothing changes?",
        "Outcome: what would success look like?",
        "Commitment: train, communicate, be coached.",
        "Decision: can he decide today? who else involved?",
        "Offer only if fit is clear. Close. CRM immediately.",
    ]
    qual = [
        "Fits HTK market",
        "Performance goal",
        "Meaningful obstacle",
        "Wants progress now",
        "Open to coaching/accountability",
        "Will train consistently",
        "Understands not bodybuilding-only",
        "Can make/define decision",
    ]
    disq = [
        "Under 18.",
        "Bodybuilding-only and rejects performance.",
        "Quick fix or guaranteed result.",
        "Refuses accountability.",
        "Wants free coaching/full plan.",
        "Medical, injury, rehab, pain advice.",
        "Cannot train consistently and refuses change.",
        "Hostile, unsafe, explicit, abusive.",
    ]
    closing = [
        "Goal, obstacle, consequence, outcome clear.",
        "Prospect understands offer and commitment.",
        "No guarantees, no medical advice.",
        "Approved current terms only.",
        "Clear yes before payment.",
        "If unclear: fit, timing, investment, execution?",
        "If not fit: tell him straight and close respectfully.",
    ]
    crm = [
        "Stage and show status.",
        "Goal, current situation, obstacle, consequence, outcome.",
        "Commitment level and decision process.",
        "Offer presented yes/no and objections.",
        "Outcome and next action/date or closed-lost reason.",
        "Payment status if won; handoff status if enrolled.",
    ]
    brand = [
        "No guarantees.",
        "No medical advice.",
        "No false urgency.",
        "No invented discounts/refunds/bonuses/terms.",
        "No pressure after a clear no.",
        "Do not sell poor-fit prospects.",
        "When unsure, stop and escalate.",
    ]

    y = y_top
    y = box(x1, y, col_w, 177, "CALL FLOW", flow, numbered=True, size=5.95, leading=6.9)
    y -= 8
    box(x1, y, col_w, 201, "CLOSING CHECKLIST", closing, size=6.1, leading=7.15)

    y = y_top
    y = checks(x2, y, col_w, 127, "QUALIFICATION CHECKLIST", qual)
    y -= 8
    y = box(x2, y, col_w, 145, "DISQUALIFICATION CHECKLIST", disq, fill=RED_FILL, head=RED, size=6.0, leading=6.95)
    y -= 8
    mini_table(x2, y, col_w, 143)

    y = y_top
    y = box(x3, y, col_w, 145, "CRM REQUIREMENTS", crm, size=6.05, leading=7.0)
    y -= 8
    box(x3, y, col_w, 139, "BRAND RULES", brand, fill=FILL, head=NAVY, size=6.1, leading=7.15)

    c.setStrokeColor(LINE)
    c.line(margin, margin + 2, W - margin, margin + 2)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 6.2)
    c.drawString(margin, margin - 7, "HTK sales standard: clarity, commitment, fit. No pressure. No guarantees. Protect the brand.")
    c.drawRightString(W - margin, margin - 7, "Single-page closer command sheet")
    c.showPage()
    c.save()


def main():
    operating = ROOT / "HTK_SALES_OPERATING_SYSTEM.pdf"
    quickstart = ROOT / "HTK_SALES_QUICKSTART.pdf"
    command = ROOT / "HTK_CLOSER_COMMAND_SHEET.pdf"

    build_doc(
        operating,
        "HTK SALES OPERATING SYSTEM",
        "Hard To Kill Training",
        "Complete company manual for scalable closer execution, enrollment, CRM, and brand-safe sales.",
        read_sales_manual_md(),
        compact=False,
        major_breaks=False,
    )
    build_doc(
        quickstart,
        "HTK SALES QUICKSTART",
        "Closer Onboarding Guide",
        "Condensed onboarding manual for new HTK closers before certification and live calls.",
        QUICKSTART_MD,
        compact=True,
        major_breaks=False,
    )
    draw_command_sheet(command)
    print(operating)
    print(quickstart)
    print(command)


if __name__ == "__main__":
    main()
