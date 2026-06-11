const fs = require("fs");
const path = require("path");
const { marked } = require("marked");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const SOURCE = path.join(ROOT, "HTK_COACH_QUICKSTART.md");
const BUILD = path.join(ROOT, "build", "htk-coach-quickstart");
const OUTPUT = path.join(ROOT, "HTK_COACH_QUICKSTART.pdf");
const HTML_OUTPUT = path.join(BUILD, "HTK_COACH_QUICKSTART.html");

const docTitle = "HTK Coach Quickstart";
const footerTitle = "Hard To Kill Training | Coach Quickstart";

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

function getHeadings(markdown) {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.match(/^(#{1,3})\s+(.+)$/))
    .filter(Boolean)
    .map((match) => ({
      level: match[1].length,
      text: match[2].trim(),
      id: slugify(match[2].trim()),
    }))
    .filter((heading) => heading.level <= 2);
}

function tocHtml(headings) {
  const items = headings
    .filter((heading) => heading.level === 2)
    .map((heading) => `<li><a href="#${heading.id}">${escapeHtml(heading.text)}</a></li>`)
    .join("");
  return `
    <section class="toc" id="table-of-contents">
      <h1>Table of Contents</h1>
      <ul>${items}</ul>
    </section>
  `;
}

function markdownHtml(markdown) {
  const renderer = new marked.Renderer();
  renderer.heading = function heading(token) {
    const text = this.parser.parseInline(token.tokens);
    const id = slugify(token.text);
    return `<h${token.depth} id="${id}">${text}</h${token.depth}>`;
  };
  renderer.hr = function hr() {
    return '<div class="section-rule" aria-hidden="true"></div>';
  };
  marked.setOptions({
    renderer,
    gfm: true,
    breaks: false,
    mangle: false,
    headerIds: false,
  });
  return marked.parse(markdown);
}

function buildHtml() {
  const markdown = fs.readFileSync(SOURCE, "utf8").trim();
  const headings = getHeadings(markdown);
  const bodyHtml = markdownHtml(markdown);
  const generated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${docTitle}</title>
  <style>${css()}</style>
</head>
<body>
  <section class="cover">
    <div class="cover-inner">
      <p class="cover-kicker">Hard To Kill Training</p>
      <h1>Coach Quickstart</h1>
      <p class="cover-subtitle">15-minute operational guide for newly hired HTK coaches.</p>
      <div class="cover-meta">
        <span>Internal Training</span>
        <span>Performance Coaching Delivery</span>
        <span>Generated ${generated}</span>
      </div>
    </div>
  </section>
  ${tocHtml(headings)}
  <main class="content">
    ${bodyHtml}
  </main>
</body>
</html>`;
}

function css() {
  return `
    :root {
      --navy: #142B45;
      --navy-2: #1F4A6F;
      --steel: #415162;
      --muted: #687382;
      --line: #D8E0EA;
      --soft: #F4F7FA;
      --gold: #B58A34;
      --text: #1F2933;
    }

    * { box-sizing: border-box; }

    html {
      font-family: Arial, Helvetica, sans-serif;
      color: var(--text);
      font-size: 9.7pt;
      line-height: 1.36;
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
      min-height: 9.15in;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: var(--navy);
    }

    .cover-inner {
      max-width: 6.45in;
      margin: 0 auto;
      padding: 0.25in 0;
    }

    .cover-kicker {
      color: var(--gold);
      font-size: 10.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.7px;
      margin: 0 0 0.2in;
    }

    .cover h1 {
      font-size: 36pt;
      line-height: 1.03;
      margin: 0;
      color: var(--navy);
      background: transparent;
      border: 0;
      padding: 0;
      letter-spacing: 0;
    }

    .cover-subtitle {
      font-size: 13pt;
      line-height: 1.45;
      color: var(--steel);
      margin: 0.24in auto 0;
      max-width: 5.75in;
    }

    .cover-meta {
      border-top: 2px solid var(--gold);
      margin: 0.64in auto 0;
      padding-top: 0.19in;
      max-width: 5.25in;
      color: var(--muted);
      display: grid;
      gap: 0.055in;
      font-size: 9pt;
    }

    .toc {
      break-after: page;
    }

    .toc h1 {
      font-size: 22pt;
      color: var(--navy);
      margin: 0 0 0.22in;
      padding: 0 0 0.1in;
      background: transparent;
      border: 0;
      border-bottom: 2px solid var(--gold);
    }

    .toc ul {
      margin: 0;
      padding-left: 0;
      columns: 2;
      column-gap: 0.45in;
      list-style: none;
    }

    .toc li {
      break-inside: avoid;
      margin-bottom: 0.065in;
      font-size: 9.8pt;
      color: var(--navy);
    }

    .content h1 {
      font-size: 20pt;
      color: white;
      background: var(--navy);
      border-left: 0.08in solid var(--gold);
      padding: 0.12in 0.15in;
      margin: 0 0 0.12in;
      line-height: 1.15;
      letter-spacing: 0;
    }

    .content h2 {
      font-size: 13.8pt;
      line-height: 1.18;
      color: white;
      background: var(--navy);
      border-left: 0.07in solid var(--gold);
      padding: 0.085in 0.12in;
      margin: 0.18in 0 0.095in;
      break-after: avoid;
      letter-spacing: 0;
    }

    .content h3 {
      color: var(--navy);
      font-size: 11.1pt;
      line-height: 1.2;
      margin: 0.14in 0 0.045in;
      padding-bottom: 0.025in;
      border-bottom: 1px solid var(--line);
      break-after: avoid;
    }

    p {
      margin: 0 0 0.065in;
    }

    ul, ol {
      margin: 0.035in 0 0.1in;
      padding-left: 0.24in;
    }

    li {
      margin-bottom: 0.027in;
      break-inside: avoid;
    }

    blockquote {
      margin: 0.075in 0 0.115in;
      padding: 0.095in 0.13in;
      border-left: 4px solid var(--gold);
      background: #FBF8EF;
      color: var(--steel);
      break-inside: avoid;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      margin: 0.09in 0 0.14in;
      font-size: 8pt;
      line-height: 1.31;
      break-inside: auto;
    }

    thead {
      display: table-header-group;
    }

    tr {
      break-inside: avoid;
    }

    th {
      background: var(--navy);
      color: white;
      font-weight: 700;
      text-align: left;
      vertical-align: middle;
      padding: 0.06in 0.07in;
      border: 1px solid var(--navy);
    }

    td {
      border: 1px solid var(--line);
      padding: 0.055in 0.07in;
      vertical-align: middle;
      overflow-wrap: anywhere;
    }

    tbody tr:nth-child(even) td {
      background: var(--soft);
    }

    code {
      font-family: "Courier New", Courier, monospace;
      color: var(--navy);
      background: var(--soft);
      padding: 0.01in 0.035in;
      border-radius: 2px;
      font-size: 8.3pt;
    }

    input[type="checkbox"] {
      width: 0.12in;
      height: 0.12in;
      margin: 0 0.05in 0 0;
      vertical-align: -1px;
    }

    .task-list-item {
      list-style: none;
      margin-left: -0.18in;
    }

    li:has(> input[type="checkbox"]) {
      list-style: none;
      margin-left: -0.18in;
    }

    .section-rule {
      height: 0.02in;
      background: var(--line);
      margin: 0.12in 0 0.06in;
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
    displayHeaderFooter: true,
    preferCSSPageSize: false,
    headerTemplate: `<div></div>`,
    footerTemplate: `
      <div style="width:100%; padding:0 0.55in; font-family:Arial, Helvetica, sans-serif; font-size:7.5px; color:#5F6B7A;">
        <div style="border-top:1px solid #D8E0EA; padding-top:5px; display:flex; justify-content:space-between; align-items:center;">
          <span>${footerTitle}</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      </div>`,
    margin: {
      top: "0.58in",
      right: "0.62in",
      bottom: "0.66in",
      left: "0.62in",
    },
  });
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
