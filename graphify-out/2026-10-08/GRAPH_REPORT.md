# Graph Report - radar  (2026-10-07)

## Corpus Check
- Corpus is ~38,750 words - fits in a single context window. You may not need a graph.

## Summary
- 373 nodes · 658 edges · 23 communities (14 shown, 8 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- App Pages & Routes
- API Routes
- Assistant & Voice UI
- Dependencies & Package Config
- Authentication & Sessions
- Business Plan & Strategy
- TypeScript Configuration
- UI Component Config
- Technical Documentation
- Favicon Brand Assets
- App Shell & Security Headers
- App Icon Brand Assets
- Product Vision & Constraints
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
1. `compilerOptions` - 16 edges
2. `react` - 15 edges
3. `isAuthenticatedRequest()` - 14 edges
4. `getPocketBaseClient()` - 14 edges
5. `toPersianDigits()` - 12 edges
6. `طرح کسب‌وکار جامع، مدل اقتصادی سازمانی و پرونده جذب سرمایه` - 12 edges
7. `evaluateMessageWithLLM()` - 11 edges
8. `authenticateSuperuser()` - 11 edges
9. `مستندات فنی و معماری جامع سامانه رادار (Radar)` - 11 edges
10. `cn()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `isAuthenticatedRequest()`  [EXTRACTED]
  app/api/analyze/route.ts → lib/auth.ts
- `POST()` --calls--> `getClientIp()`  [EXTRACTED]
  app/api/auth/login/route.ts → lib/rateLimit.ts
- `GET()` --calls--> `isAuthenticatedRequest()`  [EXTRACTED]
  app/api/auth/session/route.ts → lib/auth.ts
- `POST()` --calls--> `isAuthenticatedRequest()`  [EXTRACTED]
  app/api/settings/route.ts → lib/auth.ts
- `POST()` --calls--> `isAuthenticatedRequest()`  [EXTRACTED]
  app/api/simulate/route.ts → lib/auth.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Radar triage from ingestion to lead action** — readme_radar, readme_triage_pipeline [EXTRACTED 0.75]
- **Radar Icon Composition** — app_icon_svgfile, app_icon_radar_emblem, app_icon_concentric_circles, app_icon_sweep_blip [EXTRACTED 1.00]
- **Radar glyph assembly** — public_favicon_concentric_rings, public_favicon_center_dot, public_favicon_sweep_arm [EXTRACTED 1.00]
- **Minimal monochrome brand system** — public_favicon_faviconimage, public_favicon_monochrome_palette, public_favicon_brand_identity [INFERRED 0.85]

## Communities (23 total, 8 thin omitted)

### Community 0 - "App Pages & Routes"
Cohesion: 0.06
Nodes (56): LeadRadarDashboard(), dynamic, COMPARISON_DIMENSIONS, PersianLandingPage(), PRICING_PLANS, PricingPlan, SAMPLE_SIGNALS, SampleSignal (+48 more)

### Community 1 - "API Routes"
Cohesion: 0.10
Nodes (42): dynamic, POST(), dynamic, POST(), dynamic, POST(), dynamic, POST() (+34 more)

### Community 2 - "Assistant & Voice UI"
Cohesion: 0.07
Nodes (38): DEFAULT_COLORS, level(), createOrbRenderer(), OrbFrame, rgb(), VoiceOrb(), VoiceOrbProps, askRadarAssistant() (+30 more)

### Community 3 - "Dependencies & Package Config"
Cohesion: 0.05
Nodes (42): dependencies, clsx, motion, next, pocketbase, react, react-dom, tailwind-merge (+34 more)

### Community 4 - "Authentication & Sessions"
Cohesion: 0.18
Nodes (18): dynamic, POST(), dynamic, POST(), dynamic, GET(), createSessionToken(), formatSessionClearCookie() (+10 more)

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

### Community 9 - "Favicon Brand Assets"
Cohesion: 0.22
Nodes (9): App Brand Identity, Center Emitter Dot, Concentric Range Rings, Favicon SVG Image, Monochrome Palette Decision, Radar Emblem Glyph, Rounded Square Background, Sweep Arm With Blip (+1 more)

### Community 10 - "App Shell & Security Headers"
Cohesion: 0.25
Nodes (5): metadata, viewport, nextConfig, securityHeaders, next

### Community 11 - "App Icon Brand Assets"
Cohesion: 0.40
Nodes (6): Concentric Circles Motif, Monochrome Minimalism, Radar Emblem, Rounded Square Container, App Icon SVG File, Radar Sweep and Blip

### Community 12 - "Product Vision & Constraints"
Cohesion: 0.33
Nodes (6): Four-Tier Intent Classification, Resilient LLM Gateway with Persian Heuristic Fallback, PocketBase SQLite Backend, Radar AI Lead Radar, Triage Scoring and Cost Accounting Pipeline, Zero Foreign Cloud Lock-in

### Community 15 - "Assistant API Endpoint"
Cohesion: 0.67
Nodes (3): cleanOutput(), dynamic, POST()

## Knowledge Gaps
- **157 isolated node(s):** `dynamic`, `dynamic`, `dynamic`, `dynamic`, `dynamic` (+152 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 189 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App Pages & Routes` to `Assistant & Voice UI`, `Dependencies & Package Config`?**
  _High betweenness centrality (0.169) - this node is a cross-community bridge._
- **Why does `pocketbase` connect `API Routes` to `Dependencies & Package Config`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Why does `getPocketBaseClient()` connect `API Routes` to `App Pages & Routes`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **What connects `dynamic`, `dynamic`, `dynamic` to the rest of the system?**
  _157 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App Pages & Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.06322624743677376 - nodes in this community are weakly interconnected._
- **Should `API Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.0965166908563135 - nodes in this community are weakly interconnected._
- **Should `Assistant & Voice UI` be split into smaller, more focused modules?**
  _Cohesion score 0.07358156028368794 - nodes in this community are weakly interconnected._