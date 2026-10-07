# Graph Report - Radar  (2026-10-07)

## Corpus Check
- 54 files · ~38,624 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 395 nodes · 661 edges · 22 communities (13 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1494a540`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Icons.tsx
- llm.ts
- compilerOptions
- package.json
- auth.ts
- devDependencies
- Radar — AI Lead Radar
- AGENTS.md
- طرح کسب‌وکار جامع، مدل اقتصادی سازمانی و پرونده جذب سرمایه
- InMemoryRateLimiter
- voice-orb.tsx
- next.config.ts
- next-env.d.ts
- postcss.config.mjs
- rules/graphify.md
- ponytail.md
- workflows/graphify.md
- مستندات فنی و معماری جامع سامانه رادار (Radar)
- components.json
- ConcurrencyLimiter
- assistant/route.ts

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `isAuthenticatedRequest()` - 14 edges
3. `getPocketBaseClient()` - 14 edges
4. `Radar — AI Lead Radar` - 14 edges
5. `toPersianDigits()` - 12 edges
6. `طرح کسب‌وکار جامع، مدل اقتصادی سازمانی و پرونده جذب سرمایه` - 12 edges
7. `evaluateMessageWithLLM()` - 11 edges
8. `authenticateSuperuser()` - 11 edges
9. `مستندات فنی و معماری جامع سامانه رادار (Radar)` - 11 edges
10. `Quickstart` - 10 edges

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

## Communities (22 total, 9 thin omitted)

### Community 0 - "Icons.tsx"
Cohesion: 0.06
Nodes (54): LeadRadarDashboard(), dynamic, COMPARISON_DIMENSIONS, PersianLandingPage(), PRICING_PLANS, PricingPlan, SAMPLE_SIGNALS, SampleSignal (+46 more)

### Community 1 - "llm.ts"
Cohesion: 0.10
Nodes (41): dynamic, POST(), dynamic, POST(), dynamic, POST(), dynamic, POST() (+33 more)

### Community 2 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 3 - "package.json"
Cohesion: 0.06
Nodes (32): clsx, motion, next, dependencies, clsx, motion, next, pocketbase (+24 more)

### Community 4 - "auth.ts"
Cohesion: 0.18
Nodes (18): dynamic, POST(), dynamic, POST(), dynamic, GET(), createSessionToken(), formatSessionClearCookie() (+10 more)

### Community 5 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 6 - "Radar — AI Lead Radar"
Cohesion: 0.06
Nodes (30): 1. Prerequisites, 1. Zero Foreign Cloud Lock-in, 2. Install dependencies, 2. Vanilla TypeScript First, 3. Configure environment, 3. Zero External CDNs, 4. Native Persian / RTL Support, 4. Start PocketBase (+22 more)

### Community 8 - "طرح کسب‌وکار جامع، مدل اقتصادی سازمانی و پرونده جذب سرمایه"
Cohesion: 0.09
Nodes (21): الف. تفکیک کامل لایه‌های هزینه واقعی یک مشترک در ایران:, ب. جدول اقتصاد واحد و حاشیه سود هر پلن (Unit Economics):, خندق دفاعی استراتژیک رادار (Strategic Moats):, سامانه هوش مصنوعی رادار (Radar AI) — PriCoders, شاخص‌های کلیدی اقتصاد کسب‌وکار در یک نگاه:, طرح کسب‌وکار جامع، مدل اقتصادی سازمانی و پرونده جذب سرمایه, واقعیت بی‌رحم بازار ایران و بازارهای نوظهور:, پرسونای ۱: «مهندس راد» — مدیرعامل / بنیان‌گذار شرکت نرم‌افزاری B2B SaaS (+13 more)

### Community 10 - "voice-orb.tsx"
Cohesion: 0.07
Nodes (39): metadata, viewport, DEFAULT_COLORS, level(), createOrbRenderer(), OrbFrame, rgb(), VoiceOrb() (+31 more)

### Community 18 - "مستندات فنی و معماری جامع سامانه رادار (Radar)"
Cohesion: 0.12
Nodes (15): Opportunity Intelligence & Sales Automation Engine — PriCoders, استقرار سرور در شرایط اینترنت ایران:, مستندات فنی و معماری جامع سامانه رادار (Radar), ۱. بیانیه مأموریت فنی و رویکرد طراحی (Technical Philosophy), ۲. نمودار کلان جریان داده و خط پردازش (End-to-End System Architecture), ۳. پشته فناوری (Technology Stack), ۴. کالبدشکافی خط تریاژ سه‌لایه رادار (Progressive Triage Deep Dive), ۴.۱ لایه ۰: فیلتر قطعی و ترافیکی (Deterministic Rule Filter) (+7 more)

### Community 19 - "components.json"
Cohesion: 0.12
Nodes (15): aliases, components, hooks, lib, ui, utils, rsc, $schema (+7 more)

### Community 21 - "assistant/route.ts"
Cohesion: 0.67
Nodes (3): cleanOutput(), dynamic, POST()

## Knowledge Gaps
- **170 isolated node(s):** `dynamic`, `dynamic`, `dynamic`, `dynamic`, `dynamic` (+165 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getPocketBaseClient()` connect `llm.ts` to `Icons.tsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `ProductRecord` connect `llm.ts` to `Icons.tsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `RefreshIcon()` connect `Icons.tsx` to `voice-orb.tsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `dynamic`, `dynamic`, `dynamic` to the rest of the system?**
  _170 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Icons.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0627027027027027 - nodes in this community are weakly interconnected._
- **Should `llm.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09728506787330317 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._