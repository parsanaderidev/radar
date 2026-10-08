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
  s = s.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
  s = s.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*(.*?)\*/g, "<em>$1</em>");
  s = s.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="doc-link">$1</a>');
  s = s.replace(/⚠️/g, '<span class="icon-badge">⚠️</span>');
  s = s.replace(/✅/g, '<span class="icon-badge">✅</span>');
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

    if (trimmed.startsWith("# ")) {
      closeList();
      html += `<h1 class="doc-h1">${formatInline(trimmed.slice(2))}</h1>`;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      closeList();
      html += `<h2 class="doc-h2"><span class="h2-indicator"></span>${formatInline(trimmed.slice(3))}</h2>`;
      continue;
    }
    if (trimmed.startsWith("### ")) {
      closeList();
      html += `<h3 class="doc-h3">${formatInline(trimmed.slice(4))}</h3>`;
      continue;
    }
    if (trimmed.startsWith("#### ")) {
      closeList();
      html += `<h4 class="doc-h4">${formatInline(trimmed.slice(5))}</h4>`;
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

    :root {
      --primary: #0284c7;
      --primary-dark: #0369a1;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #0f172a;
      --text-muted: #475569;
      --border: #e2e8f0;
      --border-dark: #cbd5e1;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Ravi', Tahoma, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.85;
      font-size: 13.5px;
      direction: rtl;
      text-align: right;
    }

    .top-bar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border);
      padding: 12px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    }
    .top-bar-title {
      font-weight: 700;
      font-size: 14.5px;
      color: var(--primary-dark);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn {
      padding: 8px 18px;
      border-radius: 8px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      background: var(--primary);
      color: #fff;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 2px 6px rgba(2, 132, 199, 0.3);
    }
    .btn:hover {
      background: var(--primary-dark);
    }

    .doc-page {
      max-width: 880px;
      margin: 30px auto;
      background: var(--card-bg);
      padding: 45px 55px;
      border-radius: 12px;
      border: 1px solid var(--border);
      box-shadow: 0 4px 20px rgba(0,0,0,0.03);
    }

    .cover-card {
      border: 2px solid #bae6fd;
      background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%);
      padding: 40px;
      border-radius: 14px;
      margin-bottom: 35px;
      page-break-after: always;
    }
    .badge-row {
      display: flex;
      gap: 10px;
      margin-bottom: 18px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
    }
    .badge-blue { background: #e0f2fe; color: #0369a1; }
    .badge-green { background: #d1fae5; color: #047857; }
    .badge-purple { background: #ede9fe; color: #6d28d9; }

    .cover-title {
      font-size: 26px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.4;
      margin-bottom: 12px;
    }
    .cover-subtitle {
      font-size: 14px;
      color: #334155;
      line-height: 1.7;
      margin-bottom: 25px;
    }
    .cover-meta {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      border-top: 1px solid #cbd5e1;
      padding-top: 20px;
    }
    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .meta-label {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
    }
    .meta-val {
      font-size: 13px;
      color: #0f172a;
      font-weight: 700;
    }

    .doc-h1 {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 22px;
      border-bottom: 2px solid var(--primary);
      padding-bottom: 10px;
    }
    .doc-h2 {
      font-size: 18.5px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 38px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 8px;
      page-break-after: avoid;
    }
    .h2-indicator {
      display: inline-block;
      width: 4px;
      height: 20px;
      background: var(--primary);
      border-radius: 2px;
    }
    .doc-h3 {
      font-size: 15.5px;
      font-weight: 700;
      color: #1e293b;
      margin-top: 25px;
      margin-bottom: 12px;
      page-break-after: avoid;
    }
    .doc-h4 {
      font-size: 14px;
      font-weight: 700;
      color: #334155;
      margin-top: 18px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }
    .doc-p {
      margin-bottom: 14px;
      color: #334155;
      text-align: justify;
    }

    .section-divider {
      border: 0;
      height: 1px;
      background: linear-gradient(to left, transparent, var(--border), transparent);
      margin: 35px 0;
    }

    .doc-quote {
      border-right: 4px solid var(--primary);
      background: #f0f9ff;
      padding: 14px 18px;
      margin: 18px 0;
      border-radius: 6px 0 0 6px;
      color: #0369a1;
      font-size: 13px;
    }
    .callout {
      border-radius: 8px;
      padding: 14px 18px;
      margin: 18px 0;
      border-right: 4px solid;
    }
    .callout-warning {
      background: #fffbeb;
      border-color: #f59e0b;
      color: #92400e;
    }
    .callout-title {
      font-weight: 700;
      font-size: 13px;
      margin-bottom: 4px;
    }
    .callout-body {
      font-size: 12.5px;
      line-height: 1.7;
    }

    .doc-ul, .doc-ol {
      margin: 12px 0 16px 20px;
      padding-right: 15px;
    }
    .doc-ul li, .doc-ol li {
      margin-bottom: 7px;
      color: #334155;
    }

    .table-container {
      width: 100%;
      overflow-x: auto;
      margin: 18px 0 24px;
      border: 1px solid var(--border);
      border-radius: 8px;
      page-break-inside: avoid;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px;
      text-align: right;
    }
    th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      padding: 9px 12px;
      border-bottom: 2px solid var(--border);
      white-space: nowrap;
    }
    td {
      padding: 9px 12px;
      border-bottom: 1px solid var(--border);
      color: #334155;
    }
    tr.odd { background: #ffffff; }
    tr.even { background: #f8fafc; }
    tr:last-child td { border-bottom: none; }

    .inline-code {
      font-family: Consolas, Monaco, monospace;
      direction: ltr;
      display: inline-block;
      background: #f1f5f9;
      color: #0284c7;
      border: 1px solid #e2e8f0;
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 11.5px;
      font-weight: 600;
    }

    .code-container {
      margin: 18px 0 24px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #1e293b;
      background: #0b1120;
      page-break-inside: avoid;
    }
    .code-header {
      background: #1e293b;
      padding: 6px 14px;
      border-bottom: 1px solid #334155;
    }
    .code-lang {
      color: #94a3b8;
      font-size: 10.5px;
      font-weight: 700;
      text-transform: uppercase;
      font-family: monospace;
    }
    pre {
      direction: ltr;
      text-align: left;
      padding: 14px 18px;
      overflow-x: auto;
      font-family: Consolas, Monaco, monospace;
      font-size: 11.5px;
      line-height: 1.65;
      color: #e2e8f0;
    }

    .mermaid-box {
      margin: 20px 0;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      background: #f8fafc;
      overflow: hidden;
      page-break-inside: avoid;
    }
    .mermaid-badge {
      background: #e2e8f0;
      color: #334155;
      font-size: 11px;
      font-weight: 700;
      padding: 5px 12px;
      border-bottom: 1px solid #cbd5e1;
    }
    .mermaid-code {
      direction: ltr;
      text-align: left;
      padding: 12px 16px;
      font-size: 11px;
      background: #ffffff;
      color: #1e293b;
    }

    .doc-link {
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
    }

    @media print {
      @page {
        size: A4 portrait;
        margin: 14mm 10mm 14mm 10mm;
      }
      body {
        background: #ffffff !important;
        color: #000000 !important;
        font-size: 11.5pt;
        line-height: 1.55;
      }
      .top-bar { display: none !important; }
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
        padding: 35px !important;
        page-break-after: always !important;
      }
      .doc-h2 {
        page-break-before: always;
        break-before: page;
        margin-top: 25px;
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
      .code-lang { color: #0f172a !important; }
    }
  </style>
</head>
<body>
  <header class="top-bar">
    <div class="top-bar-title">
      <span>سامانه رادار (Radar) | ${escapeHtml(title)}</span>
    </div>
    <button onclick="window.print()" class="btn">
      چاپ و خروجی PDF
    </button>
  </header>

  <main class="doc-page">
    <section class="cover-card">
      <div class="badge-row">
        <span class="badge badge-blue">${escapeHtml(category)}</span>
        <span class="badge badge-green">پروژه رادار (Radar)</span>
        <span class="badge badge-purple">نسخه رسمی</span>
      </div>
      <h1 class="cover-title">${escapeHtml(title)}</h1>
      <p class="cover-subtitle">${escapeHtml(subtitle)}</p>
      <div class="cover-meta">
        <div class="meta-item">
          <span class="meta-label">محصول:</span>
          <span class="meta-val">رادار (موتور کشف نیت خرید B2B)</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">تاریخ بازبینی:</span>
          <span class="meta-val">بهمن ۱۴۰۳ / اکتبر ۲۰۲۶</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">سطح سند:</span>
          <span class="meta-val">رسمی و اختصاصی</span>
        </div>
      </div>
    </section>

    <article class="doc-content">
      ${bodyContent}
    </article>
  </main>
</body>
</html>
`;
}

// Convert each markdown in docs/
const mdFiles = [
  {
    file: "TECHNICAL_REFERENCE.md",
    title: "مرجع فنی جامع و راهنمای پیاده‌سازی سامانه رادار",
    subtitle: "مستندات معماری، ساختار داده‌ها، خط تریاژ سه‌لایه، احراز هویت چندمستأجری و اسکنر پس‌زمینه خودکار",
    category: "معماری فنی و مهندسی",
  },
  {
    file: "BusinessPlan.md",
    title: "طرح کسب‌وکار و مدل درآمدی سامانه رادار (Business Plan)",
    subtitle: "سند استراتژی بازار، تحلیل پرسونای مشتری، مدل قیمت‌گذاری و درآمدی، و اقتصاد واحد (Unit Economics)",
    category: "طرح تجاری و استراتژی",
  },
  {
    file: "PITCH_DECK_CONTENT.md",
    title: "محتوا و سناریوی ارائه سرمایه‌پذیری رادار (Pitch Deck)",
    subtitle: "سناریوی اسلایدبه‌اسلاید، پیام‌های محوری، آمار و ارقام بازار و سناریوی جذب سرمایه",
    category: "ارائه به سرمایه‌گذار",
  },
];

console.log("Processing docs directory...");

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

console.log("All markdown files converted to HTML and PDF!");
