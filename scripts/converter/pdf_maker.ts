import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const docsDir = path.join(process.cwd(), "docs");
const fontsDir = path.join(process.cwd(), "public/fonts");

console.log("Reading font files for Base64 embedding...");
const raviRegularBase64 = fs.readFileSync(path.join(fontsDir, "Ravi-Regular.ttf")).toString("base64");
const raviMediumBase64 = fs.readFileSync(path.join(fontsDir, "Ravi-Medium.ttf")).toString("base64");
const raviBoldBase64 = fs.readFileSync(path.join(fontsDir, "Ravi-Bold.ttf")).toString("base64");
const raviExtraBoldBase64 = fs.readFileSync(path.join(fontsDir, "Ravi-ExtraBold.ttf")).toString("base64");

const fontStyles = `
@font-face {
  font-family: 'Ravi';
  src: url('data:font/truetype;charset=utf-8;base64,${raviRegularBase64}') format('truetype');
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: 'Ravi';
  src: url('data:font/truetype;charset=utf-8;base64,${raviMediumBase64}') format('truetype');
  font-weight: 500;
  font-style: normal;
}
@font-face {
  font-family: 'Ravi';
  src: url('data:font/truetype;charset=utf-8;base64,${raviBoldBase64}') format('truetype');
  font-weight: 700;
  font-style: normal;
}
@font-face {
  font-family: 'Ravi';
  src: url('data:font/truetype;charset=utf-8;base64,${raviExtraBoldBase64}') format('truetype');
  font-weight: 800;
  font-style: normal;
}
`;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatInline(text: string): string {
  let s = text;
  s = s.replace(/<br\s*\/?>/gi, "<br/>");
  s = s.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
  s = s.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*(.*?)\*/g, "<em>$1</em>");
  s = s.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="doc-link">$1</a>');
  s = s.replace(/⚠️/g, '<span class="icon-badge warn">⚠️</span>');
  s = s.replace(/✅/g, '<span class="icon-badge check">✅</span>');
  return s;
}

function parseMarkdown(md: string): string {
  const lines = md.split("\n");
  let html = "";
  let inCodeBlock = false;
  let codeBlockLang = "";
  let codeBlockContent: string[] = [];
  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];
  let inList = false;
  let listType: "ul" | "ol" = "ul";

  function closeTable() {
    if (!inTable) return;
    let t = `<div class="table-container"><table><thead><tr>`;
    tableHeaders.forEach((h) => {
      t += `<th>${formatInline(h.trim())}</th>`;
    });
    t += `</tr></thead><tbody>`;
    tableRows.forEach((row, idx) => {
      t += `<tr class="${idx % 2 === 0 ? "even" : "odd"}">`;
      row.forEach((cell) => {
        t += `<td>${formatInline(cell.trim())}</td>`;
      });
      t += `</tr>`;
    });
    t += `</tbody></table></div>`;
    html += t;
    inTable = false;
    tableHeaders = [];
    tableRows = [];
  }

  function closeList() {
    if (!inList) return;
    html += listType === "ul" ? `</ul>` : `</ol>`;
    inList = false;
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Code blocks
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        const codeText = codeBlockContent.join("\n");
        if (codeBlockLang === "mermaid") {
          html += `<div class="mermaid-box"><div class="mermaid-badge">نمودار معماری و جریان داده</div><pre class="mermaid-code"><code>${escapeHtml(codeText)}</code></pre></div>`;
        } else {
          html += `<div class="code-container"><div class="code-header"><span class="code-lang">${codeBlockLang || "code"}</span></div><pre><code class="language-${codeBlockLang}">${escapeHtml(codeText)}</code></pre></div>`;
        }
        inCodeBlock = false;
        codeBlockLang = "";
        codeBlockContent = [];
      } else {
        closeTable();
        closeList();
        inCodeBlock = true;
        codeBlockLang = trimmed.slice(3).trim();
        codeBlockContent = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(rawLine);
      continue;
    }

    // Tables
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      closeList();
      const cells = trimmed
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());

      if (cells.every((c) => /^:?-+:?$/.test(c))) {
        continue;
      }

      if (!inTable) {
        inTable = true;
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      closeTable();
    }

    if (trimmed === "") {
      closeList();
      continue;
    }

    if (trimmed === "---" || trimmed === "***") {
      closeList();
      html += `<hr class="section-divider" />`;
      continue;
    }

    if (trimmed.startsWith(">")) {
      closeList();
      const bqText = trimmed.replace(/^>\s*/, "");
      if (bqText.includes("هشدار") || bqText.startsWith("[!WARNING]") || bqText.startsWith("⚠️")) {
        html += `<div class="callout callout-warning"><div class="callout-title">⚠️ نکته مهم امنیتی / فنی</div><div class="callout-body">${formatInline(bqText.replace(/^\[!WARNING\]\s*/, ""))}</div></div>`;
      } else {
        html += `<blockquote class="doc-quote">${formatInline(bqText.replace(/^\[!(NOTE|TIP)\]\s*/, ""))}</blockquote>`;
      }
      continue;
    }

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\u0600-\u06FFa-zA-Z0-9\s-_]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

    if (trimmed.startsWith("# ")) {
      closeList();
      const title = trimmed.slice(2);
      html += `<h1 id="${slugify(title)}" class="doc-h1">${formatInline(title)}</h1>`;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      closeList();
      const title = trimmed.slice(3);
      html += `<h2 id="${slugify(title)}" class="doc-h2"><span class="h2-dot"></span>${formatInline(title)}</h2>`;
      continue;
    }
    if (trimmed.startsWith("### ")) {
      closeList();
      const title = trimmed.slice(4);
      html += `<h3 id="${slugify(title)}" class="doc-h3">${formatInline(title)}</h3>`;
      continue;
    }
    if (trimmed.startsWith("#### ")) {
      closeList();
      const title = trimmed.slice(5);
      html += `<h4 id="${slugify(title)}" class="doc-h4">${formatInline(title)}</h4>`;
      continue;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList || listType !== "ul") {
        closeList();
        inList = true;
        listType = "ul";
        html += `<ul class="doc-ul">`;
      }
      html += `<li>${formatInline(trimmed.slice(2))}</li>`;
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      if (!inList || listType !== "ol") {
        closeList();
        inList = true;
        listType = "ol";
        html += `<ol class="doc-ol">`;
      }
      const itemContent = trimmed.replace(/^\d+\.\s*/, "");
      html += `<li>${formatInline(itemContent)}</li>`;
      continue;
    }

    closeList();
    html += `<p class="doc-p">${formatInline(trimmed)}</p>`;
  }

  closeTable();
  closeList();
  return html;
}

function buildHtmlPage(title: string, subtitle: string, category: string, bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    ${fontStyles}

    /* 
      EXACT WEBSITE THEME: 
      Deep Black #000000, Zinc Cards #09090b / #121214, 
      Borders #27272a, White Headings #ffffff, Muted Text #a1a1aa 
    */
    :root {
      --bg: #000000;
      --card-bg: #09090b;
      --card-alt: #121215;
      --border: #27272a;
      --border-subtle: #1e1e24;
      --text: #ededed;
      --text-bright: #ffffff;
      --text-muted: #a1a1aa;
      --text-dim: #71717a;
      --code-bg: #050505;
      --accent-emerald: #10b981;
      --accent-amber: #f59e0b;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Ravi', Tahoma, sans-serif !important;
    }

    body {
      font-family: 'Ravi', Tahoma, sans-serif !important;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.75;
      font-size: 13px;
      direction: rtl;
      text-align: right;
      -webkit-font-smoothing: antialiased;
    }

    code, pre, .inline-code, .mermaid-code, .code-lang {
      font-family: 'Ravi', Consolas, 'JetBrains Mono', Monaco, monospace !important;
    }

    .doc-quote, .callout, .callout-body, .callout-title, blockquote {
      font-family: 'Ravi', Tahoma, sans-serif !important;
    }

    /* Floating Top Toolbar */
    .top-bar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(9, 9, 11, 0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 10px 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .top-bar-title {
      font-weight: 700;
      font-size: 13.5px;
      color: var(--text-bright);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      background: #ffffff;
      color: #000000;
      border-radius: 5px;
      font-weight: 900;
      font-size: 12px;
    }
    .btn {
      padding: 6px 16px;
      border-radius: 6px;
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
      border: 1px solid var(--border);
      background: #ffffff;
      color: #000000;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }
    .btn:hover {
      background: #e4e4e7;
    }

    /* Main Container */
    .doc-page {
      max-width: 900px;
      margin: 20px auto;
      background: var(--bg);
      padding: 25px 35px;
    }

    /* Executive Cover Card */
    .cover-card {
      border: 1px solid var(--border);
      background: linear-gradient(180deg, #121216 0%, #09090b 100%);
      padding: 30px 35px;
      border-radius: 12px;
      margin-bottom: 25px;
    }
    .badge-row {
      display: flex;
      gap: 8px;
      margin-bottom: 14px;
    }
    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 4px;
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }
    .badge-white {
      background: #ffffff;
      color: #000000;
    }
    .badge-zinc {
      background: #18181b;
      color: #d4d4d8;
      border: 1px solid var(--border);
    }
    .badge-emerald {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .cover-title {
      font-size: 24px;
      font-weight: 800;
      color: var(--text-bright);
      line-height: 1.35;
      margin-bottom: 8px;
    }
    .cover-subtitle {
      font-size: 13.5px;
      color: var(--text-muted);
      line-height: 1.65;
      margin-bottom: 20px;
    }
    .cover-meta {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      border-top: 1px solid var(--border);
      padding-top: 16px;
    }
    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .meta-label {
      font-size: 10.5px;
      color: var(--text-dim);
      font-weight: 600;
    }
    .meta-val {
      font-size: 12px;
      color: var(--text-bright);
      font-weight: 700;
    }

    /* Headings - High Contrast White & Zero Premature Page Breaks */
    .doc-h1 {
      font-size: 20px;
      font-weight: 800;
      color: var(--text-bright);
      margin-top: 25px;
      margin-bottom: 16px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 8px;
      break-after: avoid;
    }
    .doc-h2 {
      font-size: 17px;
      font-weight: 800;
      color: var(--text-bright);
      margin-top: 26px;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      gap: 8px;
      break-after: avoid;
    }
    .h2-dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      background: #ffffff;
      border-radius: 50%;
    }
    .doc-h3 {
      font-size: 14.5px;
      font-weight: 700;
      color: var(--text-bright);
      margin-top: 18px;
      margin-bottom: 8px;
      break-after: avoid;
    }
    .doc-h4 {
      font-size: 13.5px;
      font-weight: 700;
      color: #d4d4d8;
      margin-top: 14px;
      margin-bottom: 6px;
      break-after: avoid;
    }
    .doc-p {
      margin-bottom: 12px;
      color: var(--text);
      text-align: justify;
      line-height: 1.75;
    }

    .section-divider {
      border: 0;
      height: 1px;
      background: var(--border);
      margin: 22px 0;
    }

    /* Blockquotes & Callouts */
    .doc-quote {
      border-right: 3px solid #ffffff;
      background: #0e0e12;
      padding: 12px 16px;
      margin: 14px 0;
      border-radius: 4px 0 0 4px;
      color: #d4d4d8;
      font-size: 12.5px;
      border: 1px solid var(--border-subtle);
      border-right: 3px solid #ffffff;
      break-inside: avoid;
    }
    .callout {
      border-radius: 6px;
      padding: 12px 16px;
      margin: 14px 0;
      border: 1px solid var(--border);
      break-inside: avoid;
    }
    .callout-warning {
      background: #121008;
      border-right: 3px solid var(--accent-amber);
      color: #fef3c7;
    }
    .callout-title {
      font-weight: 700;
      font-size: 12.5px;
      margin-bottom: 4px;
      color: var(--text-bright);
    }
    .callout-body {
      font-size: 12px;
      line-height: 1.65;
    }

    /* Lists */
    .doc-ul, .doc-ol {
      margin: 8px 0 14px 18px;
      padding-right: 14px;
    }
    .doc-ul li, .doc-ol li {
      margin-bottom: 5px;
      color: var(--text);
    }

    /* High Density Monochrome Markdown Tables */
    .table-container {
      width: 100%;
      overflow-x: auto;
      margin: 12px 0 16px;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: var(--card-bg);
      break-inside: auto;
    }
    .table-container table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      text-align: right;
    }
    .table-container thead {
      display: table-header-group;
    }
    .table-container tr {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .table-container th {
      background: #141418;
      color: var(--text-bright);
      font-weight: 700;
      padding: 6px 9px;
      border-bottom: 1px solid var(--border);
      white-space: nowrap;
    }
    .table-container td {
      padding: 6px 9px;
      border-bottom: 1px solid #1a1a20;
      color: var(--text);
      vertical-align: middle;
      font-size: 11px;
    }
    .table-container tr.odd { background: #09090b; }
    .table-container tr.even { background: #0e0e12; }
    .table-container tr:last-child td { border-bottom: none; }

    /* Inline Code */
    .inline-code {
      font-family: Consolas, Monaco, monospace;
      direction: ltr;
      display: inline-block;
      background: #18181b;
      color: #ffffff;
      border: 1px solid #27272a;
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
    }

    /* Code Block Containers */
    .code-container {
      margin: 14px 0 18px;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid var(--border);
      background: var(--code-bg);
      break-inside: avoid;
    }
    .code-header {
      background: #111116;
      padding: 5px 12px;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
    }
    .code-lang {
      color: var(--text-dim);
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      font-family: monospace;
    }
    pre {
      direction: ltr;
      text-align: left;
      padding: 12px 15px;
      overflow-x: auto;
      font-family: Consolas, Monaco, monospace;
      font-size: 11.5px;
      line-height: 1.6;
      color: #f4f4f5;
    }

    /* Mermaid Architecture Diagrams */
    .mermaid-box {
      margin: 16px 0;
      border: 1px solid var(--border);
      border-radius: 6px;
      background: #0c0c10;
      overflow: hidden;
      break-inside: avoid;
    }
    .mermaid-badge {
      background: #16161c;
      color: var(--text-muted);
      font-size: 10.5px;
      font-weight: 700;
      padding: 5px 12px;
      border-bottom: 1px solid var(--border);
    }
    .mermaid-code {
      direction: ltr;
      text-align: left;
      padding: 12px 15px;
      font-size: 11px;
      background: #09090c;
      color: #e4e4e7;
    }

    .doc-link {
      color: #ffffff;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    .icon-badge {
      display: inline-block;
      margin-left: 3px;
    }

    /* =========================================================================
       PRINT & SCREEN STYLES: 100% Full Bleed Black & White with Perfect Alignment
    ========================================================================= */
    * {
      box-sizing: border-box !important;
      scrollbar-width: none !important; /* Firefox */
      -ms-overflow-style: none !important; /* IE/Edge */
    }
    *::-webkit-scrollbar {
      display: none !important; /* Chrome / Safari */
      width: 0 !important;
      height: 0 !important;
    }

    .print-page-table {
      width: 100%;
      max-width: 100%;
      border-collapse: collapse;
      margin: 0;
      padding: 0;
      background-color: var(--bg);
      border: none;
      table-layout: fixed;
    }
    .print-page-table > thead {
      display: table-header-group;
    }
    .print-page-table > tfoot {
      display: table-footer-group;
    }
    .print-page-table > thead > tr > td {
      height: 12mm;
      vertical-align: top;
      padding: 5mm 14mm 3mm 14mm;
      border: none !important;
      background: transparent !important;
    }
    .print-page-table > tfoot > tr > td {
      height: 12mm;
      vertical-align: bottom;
      padding: 3mm 14mm 5mm 14mm;
      border: none !important;
      background: transparent !important;
    }
    .print-page-table > tbody > tr > td {
      padding: 8mm 14mm 8mm 14mm;
      vertical-align: top;
      border: none !important;
      background: transparent !important;
      font-size: 13.5px;
      line-height: 1.8;
      width: 100%;
      max-width: 100%;
      overflow: hidden;
    }

    .running-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8pt;
      font-weight: 600;
      color: #71717a;
      border-bottom: 1px solid var(--border);
      padding-bottom: 2.5mm;
      width: 100%;
      direction: rtl;
    }
    .running-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.5pt;
      font-weight: 500;
      color: #71717a;
      border-top: 1px solid var(--border);
      padding-top: 2.5mm;
      width: 100%;
      direction: rtl;
    }

    @media screen {
      body {
        padding: 0;
        margin: 0;
      }
      .print-page-table {
        max-width: 900px;
        margin: 0 auto;
      }
      .print-page-table > thead > tr > td {
        padding: 16px 20px 0 20px;
        height: auto;
      }
      .print-page-table > tfoot > tr > td {
        padding: 0 20px 20px 20px;
        height: auto;
      }
      .print-page-table > tbody > tr > td {
        padding: 10px 20px;
      }
      .doc-page {
        width: 100%;
        max-width: 100%;
        margin: 15px auto;
        padding: 0;
      }
    }

    @media print {
      @page {
        size: A4 portrait;
        margin: 0 !important;
      }
      html {
        background-color: #000000 !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        height: 100% !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      body {
        background-color: #000000 !important;
        color: #ededed !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        font-size: 11pt !important;
        line-height: 1.8 !important;
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
      }
      .top-bar {
        display: none !important;
      }
      .print-page-table {
        width: 100% !important;
        max-width: 100% !important;
        table-layout: fixed !important;
        background-color: #000000 !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .print-page-table > thead > tr > td {
        height: 12mm !important;
        padding: 5mm 14mm 3mm 14mm !important;
      }
      .print-page-table > tfoot > tr > td {
        height: 12mm !important;
        padding: 3mm 14mm 5mm 14mm !important;
      }
      .print-page-table > tbody > tr > td {
        padding: 8mm 14mm 8mm 14mm !important;
        font-size: 11pt !important;
        line-height: 1.8 !important;
        width: 100% !important;
        max-width: 100% !important;
        overflow: hidden !important;
      }
      .doc-page {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
      }
      .doc-content {
        width: 100% !important;
        max-width: 100% !important;
        overflow: hidden !important;
      }
      .doc-p {
        font-size: 11pt !important;
        line-height: 1.8 !important;
        margin-bottom: 12px !important;
        word-break: break-word !important;
      }
      .doc-ul, .doc-ol {
        margin: 6px 0 12px 14px !important;
        padding-right: 14px !important;
      }
      .doc-ul li, .doc-ol li {
        font-size: 11pt !important;
        line-height: 1.75 !important;
        margin-bottom: 6px !important;
        word-break: break-word !important;
      }
      .doc-h1 {
        font-size: 17pt !important;
        margin-top: 22px !important;
        margin-bottom: 12px !important;
        padding-bottom: 6px !important;
      }
      .doc-h2 {
        font-size: 14pt !important;
        margin-top: 20px !important;
        margin-bottom: 10px !important;
        padding-bottom: 5px !important;
      }
      .doc-h3 {
        font-size: 12.5pt !important;
        margin-top: 16px !important;
        margin-bottom: 7px !important;
      }
      .doc-h4 {
        font-size: 11.5pt !important;
        margin-top: 13px !important;
        margin-bottom: 5px !important;
      }
      .cover-card {
        background: #09090b !important;
        border: 1px solid #27272a !important;
        padding: 20px 22px !important;
        break-after: auto !important;
        margin-bottom: 18px !important;
        width: 100% !important;
        box-sizing: border-box !important;
      }
      .cover-title {
        font-size: 22pt !important;
        line-height: 1.35 !important;
      }
      .cover-subtitle {
        font-size: 11.5pt !important;
        line-height: 1.6 !important;
      }
      .cover-meta {
        display: grid !important;
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 12px !important;
        align-items: center !important;
      }
      /* NO FORCED PAGE BREAKS ON HEADINGS - NATURAL FLOW */
      .doc-h1, .doc-h2, .doc-h3, .doc-h4 {
        break-before: auto !important;
        page-break-before: auto !important;
        break-after: avoid !important;
        page-break-after: avoid !important;
      }
      .table-container {
        break-inside: auto !important;
        page-break-inside: auto !important;
        margin: 10px 0 14px !important;
        width: 100% !important;
        max-width: 100% !important;
        overflow: hidden !important;
      }
      .table-container table {
        width: 100% !important;
        max-width: 100% !important;
        table-layout: fixed !important;
      }
      .table-container tr {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
      .table-container th {
        background-color: #18181b !important;
        color: #ffffff !important;
        font-size: 9.5pt !important;
        padding: 6px 8px !important;
        word-break: break-word !important;
      }
      .table-container td {
        font-size: 9.5pt !important;
        padding: 6px 8px !important;
        word-break: break-word !important;
        line-height: 1.5 !important;
      }
      .table-container tr.even { background-color: #0e0e12 !important; }
      .table-container tr.odd { background-color: #09090b !important; }
      .code-container, .mermaid-box, .callout, .doc-quote {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
      }
      pre {
        background-color: #050505 !important;
        color: #f4f4f5 !important;
        border: 1px solid #27272a !important;
        font-size: 9pt !important;
        white-space: pre-wrap !important;
        word-break: break-all !important;
        overflow-wrap: break-word !important;
        max-width: 100% !important;
        overflow: hidden !important;
        padding: 10px 12px !important;
      }
      code {
        word-break: break-word !important;
        overflow-wrap: break-word !important;
      }
      .callout {
        padding: 10px 14px !important;
        margin: 12px 0 !important;
      }
      .doc-quote {
        padding: 10px 14px !important;
        margin: 12px 0 !important;
      }
    }
  </style>
</head>
<body>
  <header class="top-bar">
    <div class="top-bar-title">
      <span class="logo-badge">R</span>
      <span>سامانه رادار (Radar) | ${escapeHtml(title)}</span>
    </div>
    <button onclick="window.print()" class="btn">
      چاپ و خروجی PDF (Black & White)
    </button>
  </header>

  <table class="print-page-table">
    <thead>
      <tr>
        <td>
          <div class="running-header">
            <span>سامانه هوشمند رادار (Radar) — PriCoders</span>
            <span>${escapeHtml(title)}</span>
          </div>
        </td>
      </tr>
    </thead>
    <tfoot>
      <tr>
        <td>
          <div class="running-footer">
            <span>سامانه رادار (Radar) — PriCoders</span>
            <span>سند رسمی محرمانه — پاییز ۱۴۰۵</span>
          </div>
        </td>
      </tr>
    </tfoot>
    <tbody>
      <tr>
        <td>
          <main class="doc-page">
            <section class="cover-card">
              <div class="badge-row">
                <span class="badge badge-white">${escapeHtml(category)}</span>
                <span class="badge badge-zinc">پروژه رادار (Radar)</span>
                <span class="badge badge-emerald">مستند سازمانی</span>
              </div>
              <h1 class="cover-title">${escapeHtml(title)}</h1>
              <p class="cover-subtitle">${escapeHtml(subtitle)}</p>
              <div class="cover-meta">
                <div class="meta-item">
                  <span class="meta-label">محصول:</span>
                  <span class="meta-val">رادار (Radar B2B Intent Engine)</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">تاریخ تدوین:</span>
                  <span class="meta-val">پاییز ۱۴۰۵</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">سطح دسترسی:</span>
                  <span class="meta-val">مستند رسمی و اجرایی</span>
                </div>
              </div>
            </section>

            <article class="doc-content">
              ${bodyContent}
            </article>
          </main>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>
`;
}

// Active documents in docs/
const mdFiles = [
  {
    file: "TechnicalDocumentation.md",
    title: "مرجع فنی و راهنمای پیاده‌سازی سامانه رادار",
    subtitle: "مستندات معماری نرم‌افزار، ساختار داده‌ها، خط تریاژ سه‌لایه، احراز هویت چندمستأجری و زمان‌بند خودکار پس‌زمینه",
    category: "معماری فنی و مهندسی",
  },
  {
    file: "BusinessPlan.md",
    title: "طرح کسب‌وکار و مدل اقتصادی سامانه رادار",
    subtitle: "استراتژی بازار، تحلیل پرسونای مشتری، مدل تعرفه‌گذاری، اقتصاد واحد و دورنمای مالی",
    category: "طرح تجاری و استراتژی",
  },
  {
    file: "Content.md",
    title: "محتوا و سناریوی ارائه سرمایه‌پذیری رادار",
    subtitle: "سناریوی اسلایدبه‌اسلاید، پیام‌های محوری، آمار بازار و برنامه جذب سرمایه",
    category: "ارائه به سرمایه‌گذار",
  },
];

console.log("Processing docs directory with Black & White Dark Aesthetic...");

for (const item of mdFiles) {
  const mdFilePath = path.join(docsDir, item.file);
  if (!fs.existsSync(mdFilePath)) {
    console.log(`Skipping ${item.file} (not found)`);
    continue;
  }

  const baseName = item.file.replace(/\.md$/, "");
  const htmlPath = path.join(docsDir, `${baseName}.html`);
  const pdfPath = path.join(docsDir, `${baseName}.pdf`);

  console.log(`Converting ${item.file} -> HTML...`);
  const mdText = fs.readFileSync(mdFilePath, "utf-8");
  const parsedBody = parseMarkdown(mdText);
  const fullHtml = buildHtmlPage(item.title, item.subtitle, item.category, parsedBody);

  fs.writeFileSync(htmlPath, fullHtml, "utf-8");
  console.log(`Wrote ${htmlPath} (${Math.round(fullHtml.length / 1024)} KB)`);

  console.log(`Compiling ${baseName}.html -> ${baseName}.pdf via headless Chrome...`);
  try {
    execSync(
      `google-chrome --headless --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${pdfPath}" "${htmlPath}"`,
      { stdio: "pipe" }
    );
    const pdfStat = fs.statSync(pdfPath);
    console.log(`SUCCESS: ${baseName}.pdf created (${Math.round(pdfStat.size / 1024)} KB)`);
  } catch (err: any) {
    console.error(`Failed to export PDF for ${baseName}:`, err.message);
  }
}

console.log("All markdown files converted to high-density Black & White HTML and PDF!");
