# Graph Report - radar  (2026-10-08)

## Corpus Check
- Corpus is ~43,662 words - fits in a single context window. You may not need a graph.

## Summary
- 434 nodes · 802 edges · 24 communities (15 shown, 8 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- App Pages & Routes
- API Routes
- App Shell & Voice UI
- LLM Triage Engine
- App Config & Dependencies
- Business Plan & Strategy
- TypeScript Configuration
- UI Component Config
- Technical Documentation
- DEPLOY.sh Script
- Favicon Brand Assets
- Webhook Ingest & Pipeline Docs
- App Icon Brand Assets
- Production Deploy Checklist
- LLM Concurrency Limiter
- API Rate Limiting
- Assistant API Endpoint
- Agent Rules Index
- Graphify Agent Rules
- Ponytail Dev Principles
- Graphify Workflow
- Next.js Type Declarations
- CSS Build Config

## God Nodes (most connected - your core abstractions)
1. `isAuthenticatedRequest()` - 18 edges
2. `getPocketBaseClient()` - 18 edges
3. `triagePendingMessage()` - 16 edges
4. `compilerOptions` - 16 edges
5. `authenticateSuperuser()` - 15 edges
6. `react` - 15 edges
7. `getClientIp()` - 13 edges
8. `ProductRecord` - 12 edges
9. `toPersianDigits()` - 12 edges
10. `طرح کسب‌وکار جامع، مدل اقتصادی سازمانی و پرونده جذب سرمایه` - 12 edges

## Surprising Connections (you probably didn't know these)
- `LeadCardProps` --references--> `LeadRecord`  [EXTRACTED]
  components/LeadCard.tsx → lib/pocketbase.ts
- `LeadRadarDashboard()` --calls--> `getPocketBaseClient()`  [EXTRACTED]
  app/dashboard/page.tsx → lib/pocketbase.ts
- `ProductSettingsPage()` --calls--> `getPocketBaseClient()`  [EXTRACTED]
  app/settings/page.tsx → lib/pocketbase.ts
- `LeadCard()` --calls--> `ensurePersianText()`  [EXTRACTED]
  components/LeadCard.tsx → lib/llm.ts
- `AnimatedNumber()` --calls--> `toPersianDigits()`  [EXTRACTED]
  components/MetricsHeader.tsx → lib/pricing.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **3-Layer Triage Pipeline** — readme_triage_pipeline, readme_layer0_deterministic, readme_layer1_screen, readme_layer2_llm [EXTRACTED 1.00]
- **Telegram and Bale Webhook Ingest** — readme_telegram_ingest_endpoint, readme_bale_ingest_endpoint, readme_telegram_webhook_secret, readme_bale_webhook_secret, readme_setwebhook_registration [EXTRACTED 1.00]
- **One-Shot Deploy and Production Checklist** — readme_deploy_sh, readme_public_pocketbase_url, readme_csp_connect_src, readme_next_public_baketime, readme_secure_cookies_https, readme_pb_data_backups [EXTRACTED 1.00]

## Communities (24 total, 8 thin omitted)

### Community 0 - "App Pages & Routes"
Cohesion: 0.06
Nodes (55): LeadRadarDashboard(), dynamic, COMPARISON_DIMENSIONS, PersianLandingPage(), PRICING_PLANS, PricingPlan, SAMPLE_SIGNALS, SampleSignal (+47 more)

### Community 1 - "API Routes"
Cohesion: 0.07
Nodes (56): dynamic, POST(), dynamic, POST(), dynamic, POST(), dynamic, GET() (+48 more)

### Community 2 - "App Shell & Voice UI"
Cohesion: 0.07
Nodes (41): metadata, viewport, DEFAULT_COLORS, level(), createOrbRenderer(), OrbFrame, rgb(), VoiceOrb() (+33 more)

### Community 3 - "LLM Triage Engine"
Cohesion: 0.09
Nodes (42): buildPrompt(), ensurePersianText(), escapeXml(), estimatePersianTokens(), EvaluateMessageInput, evaluateMessageWithLLM(), heuristicPersianEvaluator(), IntentEvaluationResult (+34 more)

### Community 4 - "App Config & Dependencies"
Cohesion: 0.04
Nodes (45): nextConfig, securityHeaders, dependencies, clsx, motion, next, pocketbase, react (+37 more)

### Community 5 - "Business Plan & Strategy"
Cohesion: 0.09
Nodes (21): الف. تفکیک کامل لایه‌های هزینه واقعی یک مشترک در ایران:, ب. جدول اقتصاد واحد و حاشیه سود هر پلن (Unit Economics):, خندق دفاعی استراتژیک رادار (Strategic Moats):, سامانه هوش مصنوعی رادار (Radar AI) — PriCoders, شاخص‌های کلیدی اقتصاد کسب‌وکار در یک نگاه:, طرح کسب‌وکار جامع، مدل اقتصادی سازمانی و پرونده جذب سرمایه, واقعیت بی‌رحم بازار ایران و بازارهای نوظهور:, پرسونای ۱: «مهندس راد» — مدیرعامل / بنیان‌گذار شرکت نرم‌افزاری B2B SaaS (+13 more)

### Community 6 - "TypeScript Configuration"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 7 - "UI Component Config"
Cohesion: 0.12
Nodes (15): aliases, components, hooks, lib, ui, utils, rsc, $schema (+7 more)

### Community 8 - "Technical Documentation"
Cohesion: 0.12
Nodes (15): Opportunity Intelligence & Sales Automation Engine — PriCoders, استقرار سرور در شرایط اینترنت ایران:, مستندات فنی و معماری جامع سامانه رادار (Radar), ۱. بیانیه مأموریت فنی و رویکرد طراحی (Technical Philosophy), ۲. نمودار کلان جریان داده و خط پردازش (End-to-End System Architecture), ۳. پشته فناوری (Technology Stack), ۴. کالبدشکافی خط تریاژ سه‌لایه رادار (Progressive Triage Deep Dive), ۴.۱ لایه ۰: فیلتر قطعی و ترافیکی (Deterministic Rule Filter) (+7 more)

### Community 9 - "DEPLOY.sh Script"
Cohesion: 0.36
Nodes (7): as_user(), DEBIAN_FRONTEND, die(), log(), prompt_secret(), DEPLOY.sh script, usage()

### Community 10 - "Favicon Brand Assets"
Cohesion: 0.22
Nodes (9): App Brand Identity, Center Emitter Dot, Concentric Range Rings, Favicon SVG Image, Monochrome Palette Decision, Radar Emblem Glyph, Rounded Square Background, Sweep Arm With Blip (+1 more)

### Community 11 - "Webhook Ingest & Pipeline Docs"
Cohesion: 0.28
Nodes (9): Bale Webhook Ingest Endpoint (/api/ingest/bale), BALE_WEBHOOK_SECRET, Layer 0 Deterministic Rules (zero tokens), Layer 1 Keyword Screen (zero tokens), Layer 2 LLM Evaluation, setWebhook Registration, Telegram Webhook Ingest Endpoint (/api/ingest/telegram), TELEGRAM_WEBHOOK_SECRET (+1 more)

### Community 12 - "App Icon Brand Assets"
Cohesion: 0.40
Nodes (6): Concentric Circles Motif, Monochrome Minimalism, Radar Emblem, Rounded Square Container, App Icon SVG File, Radar Sweep and Blip

### Community 13 - "Production Deploy Checklist"
Cohesion: 0.40
Nodes (6): CSP connect-src Constraint, DEPLOY.sh One-Shot Production Deploy, NEXT_PUBLIC Bake Time Constraint, pb_data Nightly Backup, Public PocketBase URL Constraint, Secure Cookies HTTPS Requirement

### Community 16 - "Assistant API Endpoint"
Cohesion: 0.67
Nodes (3): cleanOutput(), dynamic, POST()

## Knowledge Gaps
- **185 isolated node(s):** `PricingPlan`, `SampleSignal`, `AssistantSuggestionsProps`, `IconProps`, `NavbarProps` (+180 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 214 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App Shell & Voice UI` to `App Pages & Routes`, `App Config & Dependencies`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Why does `pocketbase` connect `LLM Triage Engine` to `API Routes`, `App Config & Dependencies`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `getPocketBaseClient()` connect `API Routes` to `App Pages & Routes`, `LLM Triage Engine`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `PricingPlan`, `SampleSignal`, `AssistantSuggestionsProps` to the rest of the system?**
  _185 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Pages & Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.061754385964912284 - nodes in this community are weakly interconnected._
- **Should `API Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.07246376811594203 - nodes in this community are weakly interconnected._
- **Should `App Shell & Voice UI` be split into smaller, more focused modules?**
  _Cohesion score 0.06748911465892599 - nodes in this community are weakly interconnected._