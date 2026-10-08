import fs from "fs";
import path from "path";

const mdPath = path.join(process.cwd(), "docs/TechnicalDocumentation.md");
const outHtmlPath = path.join(process.cwd(), "docs/TechnicalDocumentation.html");

const mdContent = fs.readFileSync(mdPath, "utf-8");

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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
        // Close code block
        const codeText = codeBlockContent.join("\n");
        if (codeBlockLang === "mermaid") {
          html += `<div class="mermaid-box"><div class="mermaid-badge">نمودار فرآیند معماری</div><pre class="mermaid-code"><code>${escapeHtml(codeText)}</code></pre></div>`;
        } else {
          html += `<div class="code-container"><div class="code-header"><span class="code-lang">${codeBlockLang || "text"}</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText);this.innerText='کپی شد';setTimeout(()=>this.innerText='کپی',2000)">کپی</button></div><pre><code class="language-${codeBlockLang}">${escapeHtml(codeText)}</code></pre></div>`;
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

      // Check if separator line (| :--- | :---: |)
      if (cells.every((c) => /^:?-+:?$/.test(c))) {
        // Table separator row, ignore
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

    // Empty lines
    if (trimmed === "") {
      closeList();
      continue;
    }

    // Horizontal Rule
    if (trimmed === "---" || trimmed === "***") {
      closeList();
      html += `<hr class="section-divider" />`;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith(">")) {
      closeList();
      const bqText = trimmed.replace(/^>\s*/, "");
      if (bqText.startsWith("[!WARNING]") || bqText.startsWith("⚠️")) {
        html += `<div class="callout callout-warning"><div class="callout-title">⚠️ هشدار امنیتی</div><div class="callout-body">${formatInline(bqText.replace(/^\[!WARNING\]\s*/, ""))}</div></div>`;
      } else if (bqText.startsWith("[!NOTE]") || bqText.startsWith("[!TIP]")) {
        html += `<div class="callout callout-info"><div class="callout-title">ℹ️ یادداشت فنی</div><div class="callout-body">${formatInline(bqText.replace(/^\[!(NOTE|TIP)\]\s*/, ""))}</div></div>`;
      } else {
        html += `<blockquote class="doc-quote">${formatInline(bqText)}</blockquote>`;
      }
      continue;
    }

    // Headings
    if (trimmed.startsWith("# ")) {
      closeList();
      html += `<h1 class="doc-h1">${formatInline(trimmed.slice(2))}</h1>`;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      closeList();
      const h2Text = trimmed.slice(3);
      const id = slugify(h2Text);
      html += `<h2 id="${id}" class="doc-h2"><span class="h2-indicator"></span>${formatInline(h2Text)}</h2>`;
      continue;
    }
    if (trimmed.startsWith("### ")) {
      closeList();
      const h3Text = trimmed.slice(4);
      const id = slugify(h3Text);
      html += `<h3 id="${id}" class="doc-h3">${formatInline(h3Text)}</h3>`;
      continue;
    }
    if (trimmed.startsWith("#### ")) {
      closeList();
      html += `<h4 class="doc-h4">${formatInline(trimmed.slice(5))}</h4>`;
      continue;
    }

    // Lists
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

    // Regular paragraphs
    html += `<p class="doc-p">${formatInline(trimmed)}</p>`;
  }

  closeTable();
  closeList();

  return html;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\u0600-\u06FFa-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function formatInline(text: string): string {
  let s = text;

  // Bold & Italic
  s = s.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
  s = s.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Inline code with badge/mono
  s = s.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  // Links
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="doc-link">$1</a>');

  // Security badges
  s = s.replace(/⚠️/g, '<span class="warn-badge">⚠️</span>');
  s = s.replace(/✅/g, '<span class="check-badge">✅</span>');

  return s;
}

const htmlBody = parseMarkdown(mdContent);

const finalHtml = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>مستندات فنی جامع سامانه رادار | نسخه ۱.۰</title>
  <style>
    /* Font definitions matching application */
    @font-face {
      font-family: 'Ravi';
      src: url('../public/fonts/Ravi-Regular.ttf') format('truetype');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Ravi';
      src: url('../public/fonts/Ravi-Medium.ttf') format('truetype');
      font-weight: 500;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Ravi';
      src: url('../public/fonts/Ravi-SemiBold.ttf') format('truetype');
      font-weight: 600;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Ravi';
      src: url('../public/fonts/Ravi-Bold.ttf') format('truetype');
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Ravi';
      src: url('../public/fonts/Ravi-ExtraBold.ttf') format('truetype');
      font-weight: 800;
      font-style: normal;
      font-display: swap;
    }

    :root {
      --primary: #0284c7;
      --primary-dark: #0369a1;
      --primary-light: #e0f2fe;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #0f172a;
      --text-muted: #475569;
      --border: #e2e8f0;
      --code-bg: #0f172a;
      --code-text: #f1f5f9;
      --accent: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Ravi', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Tahoma, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.85;
      font-size: 14.5px;
      direction: rtl;
      text-align: right;
      padding: 0;
    }

    /* Floating control bar (hidden in print) */
    .top-bar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      padding: 10px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.04);
    }
    .top-bar-title {
      font-weight: 700;
      font-size: 15px;
      color: var(--primary-dark);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .top-bar-actions {
      display: flex;
      gap: 12px;
    }
    .btn {
      padding: 7px 18px;
      border-radius: 8px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
    }
    .btn-primary {
      background: var(--primary);
      color: #fff;
      box-shadow: 0 2px 6px rgba(2, 132, 199, 0.25);
    }
    .btn-primary:hover {
      background: var(--primary-dark);
    }
    .btn-outline {
      background: #fff;
      color: var(--text-muted);
      border: 1px solid var(--border);
    }
    .btn-outline:hover {
      background: #f1f5f9;
      color: var(--text);
    }

    /* Document wrapper */
    .doc-page {
      max-width: 900px;
      margin: 30px auto;
      background: var(--card-bg);
      padding: 50px 65px;
      border-radius: 14px;
      border: 1px solid var(--border);
      box-shadow: 0 4px 25px rgba(0,0,0,0.04);
    }

    /* Cover Page */
    .cover-card {
      border: 2px solid #e0f2fe;
      background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
      padding: 45px 40px;
      border-radius: 16px;
      margin-bottom: 40px;
      position: relative;
      overflow: hidden;
      page-break-after: always;
    }
    .cover-badge-row {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11.5px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }
    .badge-primary { background: #bae6fd; color: #0369a1; }
    .badge-emerald { background: #d1fae5; color: #047857; }
    .badge-purple { background: #ede9fe; color: #6d28d9; }

    .cover-title {
      font-size: 28px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.4;
      margin-bottom: 12px;
    }
    .cover-subtitle {
      font-size: 15px;
      color: #334155;
      line-height: 1.7;
      margin-bottom: 30px;
      max-width: 780px;
    }
    .cover-meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      border-top: 1px solid #cbd5e1;
      padding-top: 25px;
    }
    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .meta-label {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
    }
    .meta-value {
      font-size: 13px;
      color: #0f172a;
      font-weight: 700;
    }

    /* Headings */
    .doc-h1 {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 25px;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 12px;
    }
    .doc-h2 {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 45px;
      margin-bottom: 18px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 10px;
      page-break-after: avoid;
    }
    .h2-indicator {
      display: inline-block;
      width: 5px;
      height: 22px;
      background: var(--primary);
      border-radius: 3px;
    }
    .doc-h3 {
      font-size: 16.5px;
      font-weight: 700;
      color: #1e293b;
      margin-top: 30px;
      margin-bottom: 14px;
      page-break-after: avoid;
    }
    .doc-h4 {
      font-size: 14.5px;
      font-weight: 700;
      color: #334155;
      margin-top: 20px;
      margin-bottom: 10px;
      page-break-after: avoid;
    }

    .doc-p {
      margin-bottom: 16px;
      color: #334155;
      text-align: justify;
    }

    .section-divider {
      border: 0;
      height: 1px;
      background: linear-gradient(to left, transparent, var(--border), transparent);
      margin: 40px 0;
    }

    /* Blockquote & Callouts */
    .doc-quote {
      border-right: 4px solid var(--primary);
      background: #f0f9ff;
      padding: 16px 20px;
      margin: 20px 0;
      border-radius: 8px 0 0 8px;
      color: #0369a1;
      font-size: 13.5px;
      line-height: 1.8;
    }

    .callout {
      border-radius: 8px;
      padding: 16px 20px;
      margin: 22px 0;
      border-right: 4px solid;
    }
    .callout-warning {
      background: #fffbeb;
      border-color: #f59e0b;
      color: #92400e;
    }
    .callout-info {
      background: #eff6ff;
      border-color: #3b82f6;
      color: #1e40af;
    }
    .callout-title {
      font-weight: 700;
      font-size: 13.5px;
      margin-bottom: 6px;
    }
    .callout-body {
      font-size: 13px;
      line-height: 1.7;
    }

    /* Lists */
    .doc-ul, .doc-ol {
      margin: 15px 0 20px 25px;
      padding-right: 15px;
    }
    .doc-ul li, .doc-ol li {
      margin-bottom: 8px;
      color: #334155;
    }

    /* Tables */
    .table-container {
      width: 100%;
      overflow-x: auto;
      margin: 22px 0 30px;
      border: 1px solid var(--border);
      border-radius: 10px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
      page-break-inside: avoid;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      text-align: right;
    }
    th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      padding: 11px 14px;
      border-bottom: 2px solid var(--border);
      white-space: nowrap;
    }
    td {
      padding: 10px 14px;
      border-bottom: 1px solid var(--border);
      color: #334155;
      vertical-align: middle;
    }
    tr.odd {
      background: #ffffff;
    }
    tr.even {
      background: #f8fafc;
    }
    tr:last-child td {
      border-bottom: none;
    }

    /* Code styling */
    .inline-code {
      font-family: 'JetBrains Mono', Consolas, Monaco, monospace;
      direction: ltr;
      display: inline-block;
      background: #f1f5f9;
      color: #0284c7;
      border: 1px solid #e2e8f0;
      padding: 1px 6px;
      border-radius: 5px;
      font-size: 12px;
      font-weight: 600;
    }

    .code-container {
      margin: 22px 0 28px;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #1e293b;
      background: #090d16;
      page-break-inside: avoid;
    }
    .code-header {
      background: #131b2e;
      padding: 8px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #1e293b;
    }
    .code-lang {
      color: #94a3b8;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      font-family: monospace;
      letter-spacing: 0.5px;
    }
    .copy-btn {
      background: #1e293b;
      color: #cbd5e1;
      border: none;
      padding: 3px 10px;
      border-radius: 5px;
      font-size: 11px;
      cursor: pointer;
      font-family: inherit;
    }
    .copy-btn:hover {
      background: #334155;
      color: #fff;
    }

    pre {
      direction: ltr;
      text-align: left;
      padding: 16px 20px;
      overflow-x: auto;
      font-family: 'JetBrains Mono', Consolas, Monaco, monospace;
      font-size: 12px;
      line-height: 1.7;
      color: #e2e8f0;
    }

    /* Mermaid flowchart box */
    .mermaid-box {
      margin: 25px 0;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      background: #f8fafc;
      overflow: hidden;
      page-break-inside: avoid;
    }
    .mermaid-badge {
      background: #e2e8f0;
      color: #334155;
      font-size: 11px;
      font-weight: 700;
      padding: 6px 14px;
      border-bottom: 1px solid #cbd5e1;
    }
    .mermaid-code {
      direction: ltr;
      text-align: left;
      padding: 14px 18px;
      font-size: 11.5px;
      background: #ffffff;
      color: #1e293b;
    }

    .doc-link {
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
    }
    .doc-link:hover {
      text-decoration: underline;
    }

    .warn-badge {
      display: inline-block;
      margin-left: 4px;
    }
    .check-badge {
      display: inline-block;
      margin-left: 4px;
    }

    /* ===================================================
       PRINT STYLES FOR PDF EXPORT
       Optimized for crisp A4 page rendering & page breaks
    =================================================== */
    @media print {
      @page {
        size: A4 portrait;
        margin: 15mm 12mm 15mm 12mm;
      }
      body {
        background: #ffffff !important;
        color: #000000 !important;
        font-size: 12pt;
        line-height: 1.6;
      }
      .top-bar {
        display: none !important;
      }
      .doc-page {
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        box-shadow: none !important;
      }
      .cover-card {
        border: 2px solid #0284c7 !important;
        background: #ffffff !important;
        padding: 40px !important;
        page-break-after: always !important;
      }
      .doc-h2 {
        page-break-before: always;
        break-before: page;
        margin-top: 30px;
      }
      .table-container, .code-container, .mermaid-box, .callout {
        page-break-inside: avoid;
        break-inside: avoid;
      }
      table th {
        background-color: #f1f5f9 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      pre {
        color: #0f172a !important;
        background: #f8fafc !important;
        border: 1px solid #cbd5e1 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      .code-container {
        border-color: #cbd5e1 !important;
      }
      .code-header {
        background: #f1f5f9 !important;
        color: #0f172a !important;
        border-color: #cbd5e1 !important;
      }
      .code-lang {
        color: #0f172a !important;
      }
      .copy-btn {
        display: none !important;
      }
      a {
        text-decoration: none !important;
        color: #0284c7 !important;
      }
    }
  </style>
</head>
<body>

  <!-- Sticky Print/Export Toolbar -->
  <header class="top-bar">
    <div class="top-bar-title">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4M12 16V8"/></svg>
      <span>مستندات فنی سامانه رادار (Radar Technical Architecture)</span>
    </div>
    <div class="top-bar-actions">
      <button onclick="window.print()" class="btn btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
        <span>چاپ و خروجی PDF</span>
      </button>
      <a href="TechnicalDocumentation.md" class="btn btn-outline">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        <span>مشاهده فایل Markdown</span>
      </a>
    </div>
  </header>

  <main class="doc-page">

    <!-- Cover Page -->
    <section class="cover-card">
      <div class="cover-badge-row">
        <span class="badge badge-primary">نسخه ۱.۰ عملیاتی</span>
        <span class="badge badge-emerald">معماری نرم‌افزار B2B</span>
        <span class="badge badge-purple">محرمانه مهندسی</span>
      </div>
      <h1 class="cover-title">مستندات فنی جامع و راهنمای معماری سامانه رادار</h1>
      <p class="cover-subtitle">
        مرجع کامل پیاده‌سازی، ساختار داده‌ها، فرآیند ارزیابی سه‌مرحله‌ای، رابط‌های برنامه‌نویسی، احراز هویت چندمستأجری، پایش هوشمند بازار و راهنمای استقرار مستقل.
      </p>
      <div class="cover-meta-grid">
        <div class="meta-item">
          <span class="meta-label">طراحی و معماری:</span>
          <span class="meta-value">تیم مهندسی و هوش مصنوعی رادار</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">بسترهای پایش:</span>
          <span class="meta-value">تلگرام، بله، انجمن‌ها و ایکس</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">پشته نرم‌افزاری:</span>
          <span class="meta-value">Next.js 16 · Bun · PocketBase</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">وضعیت پیاده‌سازی:</span>
          <span class="meta-value">۱۰۰٪ تست‌شده و آماده عملیات</span>
        </div>
      </div>
    </section>

    <!-- Document Content parsed from Markdown -->
    <article class="doc-content">
      ${htmlBody}
    </article>

  </main>

</body>
</html>
`;

fs.writeFileSync(outHtmlPath, finalHtml, "utf-8");
console.log("Generated docs/TechnicalDocumentation.html successfully! Size:", finalHtml.length);
