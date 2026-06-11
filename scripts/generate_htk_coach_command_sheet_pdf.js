const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const SOURCE = path.join(ROOT, "HTK_COACH_COMMAND_SHEET.md");
const BUILD = path.join(ROOT, "build", "htk-coach-command-sheet");
const HTML_OUTPUT = path.join(BUILD, "HTK_COACH_COMMAND_SHEET.html");
const OUTPUT = path.join(ROOT, "HTK_COACH_COMMAND_SHEET.pdf");

const footerTitle = "Hard To Kill Training | Coach Command Sheet";

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function checklist(items) {
  return `<ul class="checklist">${items.map((item) => `<li><span class="box"></span>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function kpiRows(rows) {
  return rows.map(([kpi, target]) => `<tr><td>${escapeHtml(kpi)}</td><td>${escapeHtml(target)}</td></tr>`).join("");
}

function flow(items) {
  return `<div class="flow">${items.map((item, index) => `
    <span class="flow-chip">${escapeHtml(item)}</span>${index < items.length - 1 ? '<span class="arrow">→</span>' : ''}
  `).join("")}</div>`;
}

function buildHtml() {
  fs.readFileSync(SOURCE, "utf8");

  const lifecycle = ["Lead", "Sale", "Onboarding", "Assessment", "Program Delivery", "Weekly Check-Ins", "Progress Tracking", "Renewal"];
  const coachLifecycle = ["Onboarding", "Initial Assessment", "Goal Setting", "Program Build", "Weekly Coaching", "Progress Review", "Retention/Renewal"];

  const daily = [
    ["Check-ins reviewed", "100% within 1 business day"],
    ["Client messages handled", "100% within 1 business day"],
    ["Injury/safety escalations", "100% same business day"],
    ["CRM updates completed", "98%+"],
    ["Program changes documented", "100%"],
    ["Missed check-ins actioned", "100% same day identified"],
  ];

  const weekly = [
    ["Active client check-in completion", "85%+"],
    ["Coach response timeliness", "95%+ on time"],
    ["Program review completion", "100% due reviews"],
    ["Non-compliance interventions", "100% documented"],
    ["Retention-risk clients tagged", "100%"],
    ["Injury escalations handled correctly", "100%"],
    ["CRM completeness", "98%+"],
  ];

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>HTK Coach Command Sheet</title>
  <style>${css()}</style>
</head>
<body>
  <main class="page">
    <header class="masthead">
      <div>
        <p class="eyebrow">Hard To Kill Training</p>
        <h1>Coach Command Sheet</h1>
      </div>
      <p class="tagline">Keep this open during every coaching shift. Update CRM before you move on.</p>
    </header>

    <section class="card lifecycle">
      <div class="card-head"><h2>Client Lifecycle Flow</h2><span>Command path</span></div>
      ${flow(lifecycle)}
      <p class="micro"><strong>Coach operating version:</strong> ${coachLifecycle.join(" → ")}</p>
    </section>

    <section class="dashboard">
      <section class="card new-client">
        <div class="card-head"><h2>New Client Checklist</h2><span>Before delivery</span></div>
        ${checklist([
          "Assessment completed",
          "Goals identified",
          "Limitations identified",
          "Program assigned",
          "Communication channel confirmed",
          "CRM updated",
        ])}
        <p class="note">Do not start full active programming until intake, goals, schedule constraints, equipment access, and safety flags are reviewed.</p>
      </section>

      <section class="card weekly">
        <div class="card-head"><h2>Weekly Check-In Checklist</h2><span>Every review</span></div>
        ${checklist([
          "Review compliance",
          "Review progress",
          "Review obstacles",
          "Adjust plan if needed",
          "Document notes",
          "Update CRM",
        ])}
        <p class="note">Every check-in ends with one decision: continue, adjust, regress, escalate, or accountability intervention.</p>
      </section>

      <section class="card escalate">
        <div class="card-head danger"><h2>Escalate Immediately</h2><span>Same day</span></div>
        ${checklist([
          "Injury complaints",
          "Medical questions",
          "Refund requests",
          "Legal concerns",
          "Public complaints",
          "Brand-risk situations",
        ])}
        <p class="quote">I cannot give medical advice or diagnose that. Stop the movement that triggered it for now, and get guidance from a qualified healthcare professional if symptoms are concerning or continue. I am escalating this so we handle training appropriately.</p>
      </section>

      <section class="card scope">
        <div class="card-head danger"><h2>Scope Of Practice Rules</h2><span>Never do</span></div>
        ${checklist([
          "Diagnose injuries",
          "Prescribe medical treatment",
          "Guarantee results",
          "Ignore missed check-ins",
          "Skip CRM updates",
        ])}
        <p class="note">Also never tell a client to train through concerning pain, interpret medical tests, promise HTK can fix pain, or make unapproved refund/result promises.</p>
      </section>

      <section class="card kpis">
        <div class="card-head"><h2>Coach KPIs</h2><span>Repository targets</span></div>
        <div class="kpi-grid">
          <div>
            <h3>Daily</h3>
            <table><tbody>${kpiRows(daily)}</tbody></table>
          </div>
          <div>
            <h3>Weekly</h3>
            <table><tbody>${kpiRows(weekly)}</tbody></table>
          </div>
        </div>
      </section>

      <section class="card crm">
        <div class="card-head"><h2>CRM Requirements</h2><span>Shift closeout</span></div>
        ${checklist([
          "Urgent messages handled or escalated",
          "Due check-ins reviewed or marked missed",
          "Program changes documented with rationale",
          "Injury/safety flags escalated",
          "Every active client has next action if needed",
          "CRM reflects meaningful coaching actions",
        ])}
      </section>

      <section class="card rules">
        <div class="card-head"><h2>HTK Coaching Rules</h2><span>Live standard</span></div>
        <ol>
          <li>Coach performance, durability, and real-world readiness.</li>
          <li>Programming must match goals, limitations, adherence, and safety flags.</li>
          <li>Document notes and update CRM before moving on.</li>
          <li>When risk appears, escalate instead of guessing.</li>
        </ol>
      </section>
    </section>
  </main>
</body>
</html>`;
}

function css() {
  return `
    :root {
      --navy: #142B45;
      --navy-2: #1F4A6F;
      --gold: #B58A34;
      --text: #1F2933;
      --muted: #667382;
      --line: #D9E2EC;
      --soft: #F5F7FA;
      --danger: #8A2D2D;
      --danger-soft: #FBEEEE;
    }

    * { box-sizing: border-box; }

    html {
      font-family: Arial, Helvetica, sans-serif;
      color: var(--text);
      font-size: 7.45pt;
      line-height: 1.16;
    }

    body {
      margin: 0;
      background: white;
    }

    .page {
      width: 100%;
    }

    .masthead {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 2px solid var(--gold);
      padding-bottom: 0.07in;
      margin-bottom: 0.085in;
    }

    .eyebrow {
      margin: 0 0 0.02in;
      color: var(--gold);
      font-size: 7.2pt;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      color: var(--navy);
      font-size: 19pt;
      line-height: 1;
      letter-spacing: 0;
    }

    .tagline {
      margin: 0;
      color: var(--muted);
      font-size: 7.8pt;
      max-width: 3.4in;
      text-align: right;
    }

    .card {
      border: 1px solid var(--line);
      background: white;
      border-radius: 6px;
      padding: 0.06in 0.075in;
      break-inside: avoid;
      box-shadow: 0 1px 0 rgba(20, 43, 69, 0.04);
    }

    .card-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.08in;
      border-bottom: 1px solid var(--line);
      margin: -0.01in 0 0.045in;
      padding-bottom: 0.035in;
    }

    .card-head h2 {
      margin: 0;
      color: var(--navy);
      font-size: 8.8pt;
      line-height: 1.08;
      letter-spacing: 0;
      text-transform: uppercase;
    }

    .card-head span {
      color: var(--muted);
      font-size: 6.35pt;
      white-space: nowrap;
    }

    .card-head.danger h2 {
      color: var(--danger);
    }

    .lifecycle {
      padding: 0.06in 0.08in 0.05in;
      margin-bottom: 0.075in;
    }

    .flow {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.035in;
      margin: 0.045in 0 0.035in;
    }

    .flow-chip {
      color: white;
      background: var(--navy);
      border-left: 3px solid var(--gold);
      padding: 0.045in 0.06in;
      border-radius: 4px;
      text-align: center;
      font-weight: 700;
      font-size: 7.1pt;
      min-width: 0.72in;
      white-space: nowrap;
    }

    .arrow {
      color: var(--gold);
      font-size: 9pt;
      font-weight: 700;
      flex: 0 0 auto;
    }

    .micro {
      margin: 0;
      color: var(--muted);
      font-size: 6.7pt;
    }

    .dashboard {
      display: grid;
      grid-template-columns: 1.02fr 1.02fr 1.17fr;
      grid-template-rows: auto auto auto;
      gap: 0.07in;
    }

    .new-client { grid-column: 1; grid-row: 1; }
    .weekly { grid-column: 2; grid-row: 1; }
    .escalate { grid-column: 3; grid-row: 1 / span 2; }
    .scope { grid-column: 1; grid-row: 2; }
    .crm { grid-column: 2; grid-row: 2; }
    .kpis { grid-column: 1 / span 2; grid-row: 3; }
    .rules { grid-column: 3; grid-row: 3; }

    ul, ol {
      margin: 0;
      padding-left: 0.13in;
    }

    li {
      margin: 0 0 0.024in;
    }

    .checklist {
      list-style: none;
      padding-left: 0;
    }

    .checklist li {
      display: flex;
      align-items: flex-start;
      gap: 0.045in;
      margin-bottom: 0.028in;
    }

    .box {
      width: 0.085in;
      height: 0.085in;
      border: 1px solid #B8C2CE;
      border-radius: 2px;
      flex: 0 0 auto;
      margin-top: 0.01in;
      background: white;
    }

    .note {
      margin: 0.045in 0 0;
      padding: 0.045in 0.055in;
      background: var(--soft);
      border-left: 3px solid var(--gold);
      color: var(--text);
      font-size: 6.7pt;
    }

    .quote {
      margin: 0.05in 0 0;
      padding: 0.055in 0.06in;
      color: #3A4A5B;
      background: var(--danger-soft);
      border-left: 3px solid var(--danger);
      font-size: 6.55pt;
      line-height: 1.2;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.065in;
    }

    h3 {
      margin: 0 0 0.025in;
      color: var(--navy-2);
      font-size: 7.2pt;
      text-transform: uppercase;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      font-size: 6.25pt;
      line-height: 1.12;
    }

    td {
      border: 1px solid var(--line);
      padding: 0.025in 0.035in;
      vertical-align: middle;
    }

    td:first-child {
      width: 61%;
    }

    td:last-child {
      width: 39%;
      text-align: right;
      font-weight: 700;
      color: var(--navy);
    }

    tr:nth-child(even) td {
      background: var(--soft);
    }

    .rules ol {
      padding-left: 0.14in;
      font-size: 6.95pt;
    }
  `;
}

async function main() {
  fs.mkdirSync(BUILD, { recursive: true });
  fs.writeFileSync(HTML_OUTPUT, buildHtml(), "utf8");

  const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  const browser = await chromium.launch(
    fs.existsSync(chromePath) ? { headless: true, executablePath: chromePath } : { headless: true }
  );
  const page = await browser.newPage({ viewport: { width: 1600, height: 1050 }, deviceScaleFactor: 1 });
  await page.goto(`file://${HTML_OUTPUT}`, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: OUTPUT,
    format: "Letter",
    landscape: true,
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `<div></div>`,
    footerTemplate: `
      <div style="width:100%; padding:0 0.3in; font-family:Arial, Helvetica, sans-serif; font-size:7px; color:#5F6B7A;">
        <div style="border-top:1px solid #D8E0EA; padding-top:4px; display:flex; justify-content:space-between; align-items:center;">
          <span>${footerTitle}</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      </div>`,
    margin: {
      top: "0.25in",
      right: "0.27in",
      bottom: "0.38in",
      left: "0.27in",
    },
  });
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
