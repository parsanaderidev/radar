# Graph Report - Radar  (2026-10-08)

## Corpus Check
- 73 files · ~71,642 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 572 nodes · 1049 edges · 30 communities (21 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `37f5bd38`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Icons.tsx
- InMemoryRateLimiter
- voice-orb.tsx
- pipeline.ts
- package.json
- طرح کسب‌وکار جامع، مدل اقتصادی سازمانی و تحلیل مالی
- compilerOptions
- components.json
- سامانه رادار — مرجع فنی جامع و راهنمای پیاده‌سازی
- DEPLOY.sh
- Favicon SVG Image
- 3-Layer Triage Pipeline
- Radar Emblem
- Public PocketBase URL Constraint
- ConcurrencyLimiter
- assistant/route.ts
- AGENTS.md
- rules/graphify.md
- ponytail.md
- workflows/graphify.md
- next-env.d.ts
- postcss.config.mjs
- فهرست اسلایدهای ارائه بر اساس ترتیب مصوب
- devDependencies
- pdf_maker.ts
- pocketbase.ts
- auth.ts
- proxy.ts
- next.config.ts

## God Nodes (most connected - your core abstractions)
1. `getPocketBaseClient()` - 26 edges
2. `authenticateSuperuser()` - 25 edges
3. `getAuthSession()` - 23 edges
4. `triagePendingMessage()` - 20 edges
5. `سامانه رادار — مرجع فنی جامع و راهنمای پیاده‌سازی` - 18 edges
6. `isAuthenticatedRequest()` - 16 edges
7. `compilerOptions` - 16 edges
8. `ProductRecord` - 15 edges
9. `getClientIp()` - 15 edges
10. `toPersianDigits()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `getAuthSession()`  [EXTRACTED]
  app/api/auth/session/route.ts → lib/auth.ts
- `POST()` --calls--> `triageAdHocMessage()`  [EXTRACTED]
  app/api/analyze/route.ts → lib/pipeline.ts
- `POST()` --calls--> `timingSafeEqual()`  [EXTRACTED]
  app/api/auth/login/route.ts → lib/auth.ts
- `POST()` --calls--> `getClientIp()`  [EXTRACTED]
  app/api/auth/login/route.ts → lib/rateLimit.ts
- `POST()` --calls--> `getClientIp()`  [EXTRACTED]
  app/api/auth/register/route.ts → lib/rateLimit.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **One-Shot Deploy and Production Checklist** — readme_deploy_sh, readme_public_pocketbase_url, readme_csp_connect_src, readme_next_public_baketime, readme_secure_cookies_https, readme_pb_data_backups [EXTRACTED 1.00]
- **3-Layer Triage Pipeline** — readme_triage_pipeline, readme_layer0_deterministic, readme_layer1_screen, readme_layer2_llm [EXTRACTED 1.00]
- **Telegram and Bale Webhook Ingest** — readme_telegram_ingest_endpoint, readme_bale_ingest_endpoint, readme_telegram_webhook_secret, readme_bale_webhook_secret, readme_setwebhook_registration [EXTRACTED 1.00]

## Communities (30 total, 9 thin omitted)

### Community 0 - "Icons.tsx"
Cohesion: 0.05
Nodes (59): LeadRadarDashboard(), dynamic, dynamic, dynamic, OnboardingPage(), COMPARISON_DIMENSIONS, PersianLandingPage(), PRICING_PLANS (+51 more)

### Community 2 - "voice-orb.tsx"
Cohesion: 0.07
Nodes (38): metadata, viewport, DEFAULT_COLORS, level(), createOrbRenderer(), OrbFrame, rgb(), VoiceOrb() (+30 more)

### Community 3 - "pipeline.ts"
Cohesion: 0.09
Nodes (35): buildPrompt(), ensurePersianText(), escapeXml(), estimatePersianTokens(), EvaluateMessageInput, evaluateMessageWithLLM(), heuristicPersianEvaluator(), IntentEvaluationResult (+27 more)

### Community 4 - "package.json"
Cohesion: 0.06
Nodes (32): clsx, motion, next, dependencies, clsx, motion, next, pocketbase (+24 more)

### Community 5 - "طرح کسب‌وکار جامع، مدل اقتصادی سازمانی و تحلیل مالی"
Cohesion: 0.06
Nodes (35): بخش ۱: مسئله بازار و واقعیت فروش سازمانی (Problem), بخش ۲: راه‌حل رادار و نحوه کارکرد (Solution), بخش ۳: چرا رادار؟ و مزیت‌های رقابتی (Why Radar?), بخش ۴: اندازه بازار و سهم هدف (Market Size), بخش ۵: مدل کسب‌وکار، اقتصاد واحد و تحلیل مالی (Business Model), بخش ۶: استراتژی ورود به بازار و نقشه راه محصول (GTM Strategy & Roadmap), بخش ۷: تیم توسعه و رهبری سیستم (Team), بخش ۸: برنامه جذب سرمایه، تخصیص منابع و سپاسگزاری (Thank You) (+27 more)

### Community 6 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 7 - "components.json"
Cohesion: 0.12
Nodes (15): aliases, components, hooks, lib, ui, utils, rsc, $schema (+7 more)

### Community 8 - "سامانه رادار — مرجع فنی جامع و راهنمای پیاده‌سازی"
Cohesion: 0.05
Nodes (43): PriCoders — مهندسی نرم‌افزار و معماری سیستم‌های هوشمند, اجرای تک‌دستوری استقرار روی سرورهای دبیان و اوبونتو:, الف. پایگاه داده و آدرس‌های سیستمی, ب. امنیت و دسترسی‌های اجرایی, تحلیل مقایسه‌ای اقتصاد رادار با روش‌های سنتی:, تفکیک وظایف ماژول‌های اصلی:, ج. درگاه‌های وب‌هوک پیام‌رسان‌ها, د. مدل‌های هوش مصنوعی و نرخ توکن‌ها (+35 more)

### Community 9 - "DEPLOY.sh"
Cohesion: 0.36
Nodes (7): as_user(), DEBIAN_FRONTEND, die(), log(), prompt_secret(), DEPLOY.sh script, usage()

### Community 10 - "Favicon SVG Image"
Cohesion: 0.22
Nodes (9): App Brand Identity, Center Emitter Dot, Concentric Range Rings, Favicon SVG Image, Monochrome Palette Decision, Radar Emblem Glyph, Rounded Square Background, Sweep Arm With Blip (+1 more)

### Community 11 - "3-Layer Triage Pipeline"
Cohesion: 0.28
Nodes (9): Bale Webhook Ingest Endpoint (/api/ingest/bale), BALE_WEBHOOK_SECRET, Layer 0 Deterministic Rules (zero tokens), Layer 1 Keyword Screen (zero tokens), Layer 2 LLM Evaluation, setWebhook Registration, Telegram Webhook Ingest Endpoint (/api/ingest/telegram), TELEGRAM_WEBHOOK_SECRET (+1 more)

### Community 12 - "Radar Emblem"
Cohesion: 0.40
Nodes (6): Concentric Circles Motif, Monochrome Minimalism, Radar Emblem, Rounded Square Container, App Icon SVG File, Radar Sweep and Blip

### Community 13 - "Public PocketBase URL Constraint"
Cohesion: 0.40
Nodes (6): CSP connect-src Constraint, DEPLOY.sh One-Shot Production Deploy, NEXT_PUBLIC Bake Time Constraint, pb_data Nightly Backup, Public PocketBase URL Constraint, Secure Cookies HTTPS Requirement

### Community 16 - "assistant/route.ts"
Cohesion: 0.67
Nodes (3): cleanOutput(), dynamic, POST()

### Community 24 - "فهرست اسلایدهای ارائه بر اساس ترتیب مصوب"
Cohesion: 0.14
Nodes (13): اسلاید ۱: عنوان و کاور اصلی, اسلاید ۱۰: سپاسگزاریم و جذب سرمایه, اسلاید ۲: فهرست مطالب, اسلاید ۳: مسئله بازار, اسلاید ۴: راه‌حل رادار, اسلاید ۵: چرا رادار؟, اسلاید ۶: اندازه بازار, اسلاید ۷: مدل کسب‌وکار (+5 more)

### Community 25 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 26 - "pdf_maker.ts"
Cohesion: 0.17
Nodes (12): buildHtmlPage(), docsDir, escapeHtml(), fontsDir, formatInline(), mdFiles, parseMarkdown(), closeTable() (+4 more)

### Community 27 - "pocketbase.ts"
Cohesion: 0.07
Nodes (67): dynamic, POST(), dynamic, GET(), POST(), dynamic, GET(), dynamic (+59 more)

### Community 28 - "auth.ts"
Cohesion: 0.12
Nodes (28): dynamic, POST(), dynamic, POST(), dynamic, POST(), dynamic, GET() (+20 more)

### Community 29 - "proxy.ts"
Cohesion: 0.50
Nodes (4): config, middleware, parseEdgeJwtPayload(), proxy()

## Knowledge Gaps
- **245 isolated node(s):** `DEBIAN_FRONTEND`, `dynamic`, `dynamic`, `dynamic`, `dynamic` (+240 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getPocketBaseClient()` connect `pocketbase.ts` to `Icons.tsx`, `auth.ts`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `RefreshIcon()` connect `Icons.tsx` to `voice-orb.tsx`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `ProductRecord` connect `pocketbase.ts` to `Icons.tsx`, `pipeline.ts`, `auth.ts`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **What connects `DEBIAN_FRONTEND`, `dynamic`, `dynamic` to the rest of the system?**
  _245 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Icons.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.054901960784313725 - nodes in this community are weakly interconnected._
- **Should `voice-orb.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07020408163265306 - nodes in this community are weakly interconnected._
- **Should `pipeline.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09446693657219973 - nodes in this community are weakly interconnected._