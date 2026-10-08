# Graph Report - Radar  (2026-10-08)

## Corpus Check
- 73 files · ~59,988 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 584 nodes · 1057 edges · 31 communities (22 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `63ce227e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Icons.tsx
- auth.ts
- voice-orb.tsx
- pipeline.ts
- package.json
- طرح کسب‌وکار جامع، مدل اقتصادی سازمانی و تحلیل مالی
- compilerOptions
- components.json
- مستندات فنی جامع سامانه رادار (Radar)
- DEPLOY.sh
- Favicon SVG Image
- 3-Layer Triage Pipeline
- Radar Emblem
- Public PocketBase URL Constraint
- ConcurrencyLimiter
- InMemoryRateLimiter
- assistant/route.ts
- AGENTS.md
- rules/graphify.md
- ponytail.md
- workflows/graphify.md
- next-env.d.ts
- postcss.config.mjs
- Radar — Technical Reference (مرجع فنی جامع)
- devDependencies
- راهنمای تفصیلی متن و سناریوی ارائه برای طراحان و ارائه‌دهندگان — PriCoders
- ingest.ts
- logout/route.ts
- proxy.ts
- next.config.ts

## God Nodes (most connected - your core abstractions)
1. `getPocketBaseClient()` - 26 edges
2. `authenticateSuperuser()` - 25 edges
3. `getAuthSession()` - 23 edges
4. `triagePendingMessage()` - 20 edges
5. `Radar — Technical Reference (مرجع فنی جامع)` - 17 edges
6. `isAuthenticatedRequest()` - 16 edges
7. `compilerOptions` - 16 edges
8. `ProductRecord` - 15 edges
9. `getClientIp()` - 15 edges
10. `مستندات فنی جامع سامانه رادار (Radar)` - 14 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `triageAdHocMessage()`  [EXTRACTED]
  app/api/analyze/route.ts → lib/pipeline.ts
- `POST()` --calls--> `validateAnalyzeInput()`  [EXTRACTED]
  app/api/analyze/route.ts → lib/validation.ts
- `GET()` --calls--> `getAuthSession()`  [EXTRACTED]
  app/api/auth/session/route.ts → lib/auth.ts
- `POST()` --calls--> `ingestExternalMessage()`  [EXTRACTED]
  app/api/ingest/bale/route.ts → lib/ingest.ts
- `POST()` --calls--> `ingestExternalMessage()`  [EXTRACTED]
  app/api/ingest/telegram/route.ts → lib/ingest.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **One-Shot Deploy and Production Checklist** — readme_deploy_sh, readme_public_pocketbase_url, readme_csp_connect_src, readme_next_public_baketime, readme_secure_cookies_https, readme_pb_data_backups [EXTRACTED 1.00]
- **3-Layer Triage Pipeline** — readme_triage_pipeline, readme_layer0_deterministic, readme_layer1_screen, readme_layer2_llm [EXTRACTED 1.00]
- **Telegram and Bale Webhook Ingest** — readme_telegram_ingest_endpoint, readme_bale_ingest_endpoint, readme_telegram_webhook_secret, readme_bale_webhook_secret, readme_setwebhook_registration [EXTRACTED 1.00]

## Communities (31 total, 9 thin omitted)

### Community 0 - "Icons.tsx"
Cohesion: 0.05
Nodes (59): LeadRadarDashboard(), dynamic, dynamic, dynamic, OnboardingPage(), COMPARISON_DIMENSIONS, PersianLandingPage(), PRICING_PLANS (+51 more)

### Community 1 - "auth.ts"
Cohesion: 0.06
Nodes (78): dynamic, POST(), dynamic, POST(), dynamic, POST(), dynamic, GET() (+70 more)

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
Cohesion: 0.07
Nodes (27): ارزش پیشنهادی رادار:, ارزیابی صریح گزینه‌های قیمت‌گذاری:, الف. هزینه‌های متغیر و وابسته به حجم مصرف (Variable Costs), ب. هزینه‌های ثابت و سرشکن‌شده زیرساخت (Fixed / Shared Costs), تحلیل سناریوها:, جدول پیش‌بینی درآمدی:, جمع کل بهای تمام‌شده (COGS) به‌ازای هر مشترک:, سامانه هوش مصنوعی رادار (Radar AI) — PriCoders (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 7 - "components.json"
Cohesion: 0.12
Nodes (15): aliases, components, hooks, lib, ui, utils, rsc, $schema (+7 more)

### Community 8 - "مستندات فنی جامع سامانه رادار (Radar)"
Cohesion: 0.04
Nodes (48): اجرای محیط توسعه (Development), اجزای اصلی و ارتباطات, استقرار خودکار در محیط عملیاتی (Production Deployment), جایگاه محصول (Product Positioning), جریان داده (Data Flow), خط تریاژ سه‌لایه (Progressive Triage Pipeline), راه‌حل (Solution), روش سنجش توکن‌ها (اندازه‌گیری واقعی در برابر تخمین) (+40 more)

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

### Community 24 - "Radar — Technical Reference (مرجع فنی جامع)"
Cohesion: 0.07
Nodes (29): 10. Configuration — پیکربندی, 11. Frontend & Realtime — رابط کاربری و به‌روزرسانی زنده, 12. Deployment — استقرار, 13. Operations Runbook — دستورالعمل بهره‌برداری, 14. Project Structure — ساختار پروژه, 15. Known Limitations & Roadmap — محدودیت‌ها و نقشه راه, 1. Overview — نمای کلی, 2. System Architecture — معماری سیستم (+21 more)

### Community 25 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 26 - "راهنمای تفصیلی متن و سناریوی ارائه برای طراحان و ارائه‌دهندگان — PriCoders"
Cohesion: 0.14
Nodes (13): اسلاید ۱: عنوان و هویت محصول (Cover Slide), اسلاید ۱۰: نقشه راه توسعه و مقیاس‌پذیری (Roadmap), اسلاید ۱۱: تیم، دستاوردها و پیشنهاد سرمایه‌گذاری (Team & The Ask), اسلاید ۲: مسئله بازار و واقعیت تلخ فروش (The Problem), اسلاید ۳: چرا راهکارهای فعلی شکست می‌خورند؟ (Why Existing Solutions Fail), اسلاید ۴: معرفی راه‌حل — رادار (The Solution: Radar), اسلاید ۵: چرخه کارکرد فنی و دمو زنده (How It Works & Live Demo), اسلاید ۶: خندق دفاعی و تمایز فناوری (Defensibility & Moats) (+5 more)

### Community 27 - "ingest.ts"
Cohesion: 0.23
Nodes (13): escapeFilterValue(), findOrCreateSource(), ingestExternalMessage(), IngestMessageInput, IngestOutcome, IngestPlatform, sourceName(), sanitizeString() (+5 more)

### Community 28 - "logout/route.ts"
Cohesion: 0.60
Nodes (4): dynamic, POST(), formatOnboardedClearCookie(), formatSessionClearCookie()

### Community 29 - "proxy.ts"
Cohesion: 0.50
Nodes (4): config, middleware, parseEdgeJwtPayload(), proxy()

## Knowledge Gaps
- **258 isolated node(s):** `DEBIAN_FRONTEND`, `dynamic`, `dynamic`, `dynamic`, `dynamic` (+253 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getPocketBaseClient()` connect `auth.ts` to `Icons.tsx`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `RefreshIcon()` connect `Icons.tsx` to `voice-orb.tsx`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `ProductRecord` connect `auth.ts` to `Icons.tsx`, `pipeline.ts`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `DEBIAN_FRONTEND`, `dynamic`, `dynamic` to the rest of the system?**
  _258 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Icons.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.054901960784313725 - nodes in this community are weakly interconnected._
- **Should `auth.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06383838383838383 - nodes in this community are weakly interconnected._
- **Should `voice-orb.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07020408163265306 - nodes in this community are weakly interconnected._