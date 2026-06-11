const fs = require("fs");
const path = require("path");
const { marked } = require("marked");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const SOURCE = path.join(ROOT, "htk-coaching-operations-repository");
const BUILD = path.join(ROOT, "build", "htk-coaching-manual");
const OUTPUT = path.join(ROOT, "HTK_COACHING_OPERATIONS_MANUAL.pdf");
const HTML_OUTPUT = path.join(BUILD, "HTK_COACHING_OPERATIONS_MANUAL.html");

const manualTitle = "HTK Coaching Operations Manual";
const footerTitle = "Hard To Kill Training | Coaching Operations Manual";

const files = {
  readme: "README.md",
  positioning: "01_positioning/HTK_Positioning.md",
  role: "02_coach_role_responsibilities/Coach_Role_Responsibilities.md",
  philosophy: "03_coaching_philosophy/HTK_Coaching_Philosophy.md",
  lifecycle: "04_client_lifecycle/Client_Lifecycle.md",
  onboarding: "05_client_onboarding/Client_Onboarding_SOP.md",
  assessment: "06_initial_assessment/Initial_Assessment_Process.md",
  goals: "07_goal_setting/Goal_Setting_Framework.md",
  program: "08_program_design/Program_Design_Standards.md",
  exercise: "09_exercise_selection/Exercise_Selection_Guidelines.md",
  mobility: "10_mobility_standards/Mobility_Standards.md",
  endurance: "11_endurance_standards/Endurance_Standards.md",
  explosive: "12_explosive_performance/Explosive_Performance_Standards.md",
  communication: "13_client_communication/Client_Communication_Rules.md",
  checkin: "14_weekly_checkin/Weekly_Check_In_Process.md",
  progress: "15_progress_tracking/Progress_Tracking_System.md",
  accountability: "16_accountability/Client_Accountability_Framework.md",
  missed: "17_missed_checkin/Missed_Check_In_Protocol.md",
  noncompliant: "18_non_compliant_client/Non_Compliant_Client_Protocol.md",
  injury: "19_injury_escalation/Injury_Escalation_Policy.md",
  scope: "20_scope_of_practice/Scope_Of_Practice_Rules.md",
  testimonials: "21_testimonials_success/Testimonials_Success_Story_SOP.md",
  retention: "22_retention_renewal/Retention_Renewal_Process.md",
  crm: "23_crm/CRM_Requirements.md",
  kpis: "24_coach_kpis/Coach_KPIs.md",
  qa: "25_quality_assurance/Quality_Assurance_Standards.md",
  certification: "26_coach_certification/Coach_Certification_Program.md",
  brand: "27_brand_protection/HTK_Brand_Protection_Rules.md",
  references: "references/Scope_Practice_References.md",
};

const templateFiles = [
  "templates/Client_Intake_Form.md",
  "templates/Initial_Assessment_Scorecard.md",
  "templates/Goal_Setting_Worksheet.md",
  "templates/Weekly_Check_In_Template.md",
  "templates/Program_Review_Template.md",
  "templates/Progress_Tracker.csv",
  "templates/Coach_CRM_Template.csv",
  "templates/Incident_Escalation_Form.md",
  "templates/Testimonial_Request_Template.md",
  "templates/Renewal_Review_Template.md",
  "templates/Coach_QA_Scorecard.md",
];

const divisions = [
  {
    roman: "SECTION I",
    title: "FOUNDATION",
    subtitle: "Positioning, coach ownership, and the HTK coaching philosophy.",
    entries: [
      ["HTK Positioning", files.positioning],
      ["Coach Role & Responsibilities", files.role],
      ["HTK Coaching Philosophy", files.philosophy],
    ],
  },
  {
    roman: "SECTION II",
    title: "CLIENT DELIVERY",
    subtitle: "The operating standard for onboarding, assessment, programming, and client communication.",
    entries: [
      ["Client Lifecycle", files.lifecycle],
      ["Client Onboarding SOP", files.onboarding],
      ["Initial Assessment Process", files.assessment],
      ["Goal Setting Framework", files.goals],
      ["Program Design Standards", files.program],
      ["Exercise Selection Guidelines", files.exercise],
      ["Mobility Standards", files.mobility],
      ["Endurance Standards", files.endurance],
      ["Explosive Performance Standards", files.explosive],
      ["Client Communication Rules", files.communication],
    ],
  },
  {
    roman: "SECTION III",
    title: "CLIENT MANAGEMENT",
    subtitle: "The system for weekly check-ins, accountability, progress control, testimonials, and renewals.",
    entries: [
      ["Weekly Check-In Process", files.checkin],
      ["Progress Tracking System", files.progress],
      ["Client Accountability Framework", files.accountability],
      ["Missed Check-In Protocol", files.missed],
      ["Non-Compliant Client Protocol", files.noncompliant],
      ["Testimonials & Success Story SOP", files.testimonials],
      ["Retention & Renewal Process", files.retention],
    ],
  },
  {
    roman: "SECTION IV",
    title: "RISK MANAGEMENT",
    subtitle: "Safety, scope, brand protection, and reference standards for escalations and incident handling.",
    entries: [
      ["Injury Escalation Policy", files.injury],
      ["Scope Of Practice Rules", files.scope],
      ["HTK Brand Protection Rules", files.brand],
      ["Scope Practice References", files.references],
    ],
  },
  {
    roman: "SECTION V",
    title: "OPERATIONS",
    subtitle: "CRM requirements, coach scorecards, QA standards, and certification controls.",
    entries: [
      ["CRM Requirements", files.crm],
      ["Coach KPIs", files.kpis],
      ["Quality Assurance Standards", files.qa],
      ["Coach Certification Program", files.certification],
    ],
  },
  {
    roman: "SECTION VI",
    title: "TEMPLATES",
    subtitle: "Reusable operating forms for coaching delivery, QA, renewal, CRM, and incident reporting.",
    entries: templateFiles.map((file) => [templateTitle(file), file]),
  },
];

function readSource(relPath) {
  return fs.readFileSync(path.join(SOURCE, relPath), "utf8").trim();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function templateTitle(relPath) {
  const base = path.basename(relPath, path.extname(relPath));
  return base
    .replace(/^HTK_/, "HTK ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function normalizeReadme(md) {
  return md.replace(/^# HTK Coaching Operations Repository/m, "# Repository Overview");
}

function csvToHtml(relPath) {
  const raw = readSource(relPath);
  const rows = raw
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => parseCsvLine(line));
  const header = rows[0] || [];
  const bodyRows = rows.slice(1);
  const title = templateTitle(relPath);
  const fieldRows = header
    .map((field, index) => {
      const sample = bodyRows[0] && bodyRows[0][index] ? bodyRows[0][index] : "";
      return `<tr><td>${index + 1}</td><td><code>${escapeHtml(field)}</code></td><td>${escapeHtml(sample)}</td></tr>`;
    })
    .join("");

  return `
    <section class="doc" id="${slugify(title)}">
      <p class="source-label">${escapeHtml(relPath)}</p>
      <h1>${escapeHtml(title)}</h1>
      <h2>CSV Field Structure</h2>
      <p>This CSV template is reformatted as a field inventory for PDF readability. The source fields are preserved in order.</p>
      <table class="csv-fields">
        <thead><tr><th>#</th><th>Field</th><th>Sample / Value</th></tr></thead>
        <tbody>${fieldRows}</tbody>
      </table>
    </section>
  `;
}

function parseCsvLine(line) {
  const out = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    const next = line[i + 1];
    if (ch === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
    } else if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      out.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  out.push(current);
  return out;
}

function markdownToHtml(relPath, overrideMd = null) {
  const md = overrideMd ?? readSource(relPath);
  const titleMatch = md.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : templateTitle(relPath);
  const html = marked.parse(md, {
    gfm: true,
    breaks: false,
    mangle: false,
    headerIds: true,
  });

  return `
    <section class="doc" id="${slugify(title)}">
      <p class="source-label">${escapeHtml(relPath)}</p>
      ${html}
    </section>
  `;
}

function tocHtml() {
  const divisionItems = divisions
    .map((division) => {
      const entryItems = division.entries
        .map(([label]) => `<li><a href="#${slugify(label)}">${escapeHtml(label)}</a></li>`)
        .join("");
      return `
        <li>
          <a href="#${slugify(`${division.roman} ${division.title}`)}"><strong>${division.roman} — ${division.title}</strong></a>
          <ol>${entryItems}</ol>
        </li>
      `;
    })
    .join("");

  return `
    <section class="toc" id="table-of-contents">
      <h1>Table of Contents</h1>
      <ol>
        <li><a href="#repository-overview"><strong>Repository Overview</strong></a></li>
        ${divisionItems}
      </ol>
    </section>
  `;
}

function divisionHtml(division) {
  const items = division.entries.map(([label]) => `<li>${escapeHtml(label)}</li>`).join("");
  const docs = division.entries
    .map(([label, relPath]) => {
      if (relPath.endsWith(".csv")) return csvToHtml(relPath);
      return markdownToHtml(relPath);
    })
    .join("\n");

  return `
    <section class="section-divider" id="${slugify(`${division.roman} ${division.title}`)}">
      <div class="divider-rule"></div>
      <p class="eyebrow">${division.roman}</p>
      <h1>${escapeHtml(division.title)}</h1>
      <p>${escapeHtml(division.subtitle)}</p>
      <ul>${items}</ul>
    </section>
    ${docs}
  `;
}

function buildHtml() {
  const readme = markdownToHtml(files.readme, normalizeReadme(readSource(files.readme)));
  const body = `
    <section class="cover">
      <div class="cover-inner">
        <p class="cover-kicker">Hard To Kill Training</p>
        <h1>Coaching Operations Manual</h1>
        <p class="cover-subtitle">Company operating system for scalable client delivery, coach training, risk management, and quality assurance.</p>
        <div class="cover-meta">
          <span>Internal Staff Training</span>
          <span>Performance Coaching Operations</span>
          <span>Generated ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
      </div>
    </section>
    ${tocHtml()}
    ${readme}
    ${divisions.map(divisionHtml).join("\n")}
  `;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${manualTitle}</title>
  <style>${css()}</style>
</head>
<body>${body}</body>
</html>`;
}

function css() {
  return `
    :root {
      --navy: #142B45;
      --navy-2: #1F4A6F;
      --steel: #455364;
      --muted: #687382;
      --line: #D8E0EA;
      --soft: #F4F7FA;
      --soft-blue: #EAF1F8;
      --gold: #B58A34;
      --red: #7B2424;
      --green: #1F6B43;
      --text: #1F2933;
    }

    * { box-sizing: border-box; }

    html {
      font-family: Arial, Helvetica, sans-serif;
      color: var(--text);
      font-size: 10.2pt;
      line-height: 1.42;
    }

    body {
      margin: 0;
      background: white;
    }

    a {
      color: var(--navy-2);
      text-decoration: none;
    }

    .cover {
      break-after: page;
      min-height: 9.2in;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: var(--navy);
    }

    .cover-inner {
      max-width: 6.7in;
      margin: 0 auto;
      padding: 0.3in 0;
    }

    .cover-kicker {
      color: var(--gold);
      font-size: 11pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.8px;
      margin: 0 0 0.22in;
    }

    .cover h1 {
      font-size: 35pt;
      line-height: 1.04;
      margin: 0;
      color: var(--navy);
      background: transparent;
      border-left: 0;
      padding: 0;
      letter-spacing: 0;
    }

    .cover-subtitle {
      font-size: 13.3pt;
      line-height: 1.45;
      color: var(--steel);
      margin: 0.26in auto 0;
      max-width: 5.9in;
    }

    .cover-meta {
      border-top: 2px solid var(--gold);
      margin: 0.72in auto 0;
      padding-top: 0.2in;
      max-width: 5.4in;
      color: var(--muted);
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.07in;
      font-size: 9.2pt;
    }

    .toc {
      break-after: page;
    }

    .toc h1 {
      font-size: 23pt;
      color: var(--navy);
      margin: 0 0 0.25in;
      background: transparent;
      border-left: 0;
      padding: 0;
      padding-bottom: 0.1in;
      border-bottom: 2px solid var(--gold);
    }

    .toc ol {
      margin: 0;
      padding-left: 0.23in;
    }

    .toc > ol > li {
      margin-bottom: 0.11in;
      color: var(--navy);
      font-size: 10.4pt;
    }

    .toc li ol {
      margin-top: 0.05in;
      columns: 2;
      column-gap: 0.36in;
    }

    .toc li li {
      break-inside: avoid;
      margin-bottom: 0.025in;
      font-size: 8.9pt;
      color: var(--steel);
    }

    .section-divider {
      break-before: page;
      break-after: page;
      min-height: 8.7in;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .divider-rule {
      width: 1.2in;
      height: 0.055in;
      background: var(--gold);
      margin-bottom: 0.2in;
    }

    .section-divider .eyebrow {
      color: var(--gold);
      font-weight: 700;
      letter-spacing: 1.5px;
      font-size: 10pt;
      margin: 0 0 0.08in;
    }

    .section-divider h1 {
      font-size: 28pt;
      line-height: 1.05;
      color: var(--navy);
      margin: 0 0 0.14in;
      background: transparent;
      border-left: 0;
      padding: 0;
      letter-spacing: 0;
    }

    .section-divider p {
      max-width: 5.9in;
      font-size: 12pt;
      color: var(--steel);
      margin: 0 0 0.28in;
    }

    .section-divider ul {
      columns: 2;
      column-gap: 0.35in;
      margin: 0;
      padding-left: 0.2in;
      max-width: 6.7in;
      color: var(--steel);
      font-size: 9.2pt;
    }

    .section-divider li {
      break-inside: avoid;
      margin-bottom: 0.04in;
    }

    .doc {
      break-before: page;
    }

    .source-label {
      color: var(--muted);
      font-size: 7.3pt;
      margin: 0 0 0.04in;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    h1, h2, h3, h4 {
      color: var(--navy);
      letter-spacing: 0;
      line-height: 1.18;
      break-after: avoid;
    }

    h1 {
      font-size: 18pt;
      margin: 0 0 0.14in;
      padding: 0.12in 0.16in;
      color: white;
      background: var(--navy);
      border-left: 0.09in solid var(--gold);
    }

    h2 {
      font-size: 13pt;
      margin: 0.22in 0 0.07in;
      padding-bottom: 0.03in;
      border-bottom: 1px solid var(--line);
    }

    h3 {
      font-size: 11pt;
      margin: 0.16in 0 0.045in;
      color: var(--navy-2);
    }

    h4 {
      font-size: 9.8pt;
      margin: 0.12in 0 0.035in;
      color: var(--steel);
    }

    p {
      margin: 0 0 0.07in;
    }

    ul, ol {
      margin-top: 0.04in;
      margin-bottom: 0.1in;
      padding-left: 0.23in;
    }

    li {
      margin: 0 0 0.035in;
      break-inside: avoid;
    }

    li > p {
      margin: 0.02in 0;
    }

    blockquote {
      margin: 0.08in 0 0.12in;
      padding: 0.1in 0.14in;
      border-left: 4px solid var(--gold);
      background: #FBF8EF;
      color: var(--steel);
      break-inside: avoid;
    }

    code {
      font-family: "Courier New", Courier, monospace;
      color: var(--navy);
      background: var(--soft);
      padding: 0.01in 0.035in;
      border-radius: 2px;
      font-size: 8.8pt;
    }

    pre {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      background: var(--soft);
      border: 1px solid var(--line);
      padding: 0.1in 0.12in;
      font-size: 8pt;
      line-height: 1.35;
      break-inside: avoid;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 0.1in 0 0.16in;
      table-layout: fixed;
      font-size: 8.4pt;
      line-height: 1.34;
      break-inside: auto;
    }

    thead {
      display: table-header-group;
    }

    tr {
      break-inside: avoid;
      break-after: auto;
    }

    th {
      background: var(--navy);
      color: white;
      font-weight: 700;
      text-align: left;
      vertical-align: middle;
      padding: 0.065in 0.075in;
      border: 1px solid var(--navy);
    }

    td {
      border: 1px solid var(--line);
      padding: 0.06in 0.075in;
      vertical-align: middle;
      overflow-wrap: anywhere;
    }

    tbody tr:nth-child(even) td {
      background: var(--soft);
    }

    .csv-fields td:first-child,
    .csv-fields th:first-child {
      width: 0.44in;
      text-align: center;
    }

    .csv-fields td:nth-child(2),
    .csv-fields th:nth-child(2) {
      width: 2.7in;
    }

    input[type="checkbox"] {
      width: 0.12in;
      height: 0.12in;
      margin-right: 0.04in;
      vertical-align: -1px;
    }

    @media print {
      .doc:first-of-type {
        break-before: auto;
      }
    }
  `;
}

async function main() {
  fs.mkdirSync(BUILD, { recursive: true });
  fs.writeFileSync(HTML_OUTPUT, buildHtml(), "utf8");

  const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const launchOptions = fs.existsSync(chromePath)
    ? { headless: true, executablePath: chromePath }
    : { headless: true };
  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage({ viewport: { width: 1200, height: 1600 }, deviceScaleFactor: 1 });
  await page.goto(`file://${HTML_OUTPUT}`, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: OUTPUT,
    format: "Letter",
    printBackground: true,
    preferCSSPageSize: false,
    displayHeaderFooter: true,
    headerTemplate: `<div></div>`,
    footerTemplate: `
      <div style="width:100%; padding:0 0.55in; font-family:Arial, Helvetica, sans-serif; font-size:7.5px; color:#5F6B7A;">
        <div style="border-top:1px solid #D8E0EA; padding-top:5px; display:flex; justify-content:space-between; align-items:center;">
          <span>${footerTitle}</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      </div>`,
    margin: {
      top: "0.62in",
      right: "0.65in",
      bottom: "0.68in",
      left: "0.65in",
    },
  });
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
