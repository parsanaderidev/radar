# Graph Report - Radar  (2026-10-08)

## Corpus Check
- 74 files · ~63,995 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 593 nodes · 1065 edges · 31 communities (22 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4c5354ce`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Icons.tsx
- pocketbase.ts
- voice-orb.tsx
- pipeline.ts
- package.json
- طرح کسب‌وکار جامع، مدل اقتصادی سازمانی و تحلیل مالی
- compilerOptions
- components.json
- مستندات فنی جامع سامانه رادار
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
- auth.ts
- راهنمای تفصیلی متن و سناریوی ارائه برای طراحان و ارائه‌دهندگان — PriCoders
- proxy.ts
- next.config.ts

## God Nodes (most connected - your core abstractions)
1. `getPocketBaseClient()` - 26 edges
2. `authenticateSuperuser()` - 25 edges
3. `getAuthSession()` - 23 edges
4. `triagePendingMessage()` - 20 edges
5. `Radar — Technical Reference (مرجع فنی جامع)` - 17 edges
6. `مستندات فنی جامع سامانه رادار` - 17 edges
7. `isAuthenticatedRequest()` - 16 edges
8. `compilerOptions` - 16 edges
9. `ProductRecord` - 15 edges
10. `getClientIp()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `isAuthenticatedRequest()`  [EXTRACTED]
  app/api/analyze/route.ts → lib/auth.ts
- `POST()` --calls--> `authenticateSuperuser()`  [EXTRACTED]
  app/api/analyze/route.ts → lib/pocketbase.ts
- `POST()` --calls--> `getPocketBaseClient()`  [EXTRACTED]
  app/api/analyze/route.ts → lib/pocketbase.ts
- `POST()` --calls--> `getClientIp()`  [EXTRACTED]
  app/api/analyze/route.ts → lib/rateLimit.ts
- `GET()` --calls--> `getAuthSession()`  [EXTRACTED]
  app/api/auth/session/route.ts → lib/auth.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **One-Shot Deploy and Production Checklist** — readme_deploy_sh, readme_public_pocketbase_url, readme_csp_connect_src, readme_next_public_baketime, readme_secure_cookies_https, readme_pb_data_backups [EXTRACTED 1.00]
- **3-Layer Triage Pipeline** — readme_triage_pipeline, readme_layer0_deterministic, readme_layer1_screen, readme_layer2_llm [EXTRACTED 1.00]
- **Telegram and Bale Webhook Ingest** — readme_telegram_ingest_endpoint, readme_bale_ingest_endpoint, readme_telegram_webhook_secret, readme_bale_webhook_secret, readme_setwebhook_registration [EXTRACTED 1.00]

## Communities (31 total, 9 thin omitted)

### Community 0 - "Icons.tsx"
Cohesion: 0.06
Nodes (57): LeadRadarDashboard(), dynamic, dynamic, dynamic, OnboardingPage(), COMPARISON_DIMENSIONS, PersianLandingPage(), PRICING_PLANS (+49 more)

### Community 1 - "pocketbase.ts"
Cohesion: 0.08
Nodes (44): dynamic, GET(), dynamic, GET(), POST(), dynamic, GET(), dynamic (+36 more)

### Community 2 - "voice-orb.tsx"
Cohesion: 0.07
Nodes (38): metadata, viewport, DEFAULT_COLORS, level(), createOrbRenderer(), OrbFrame, rgb(), VoiceOrb() (+30 more)

### Community 3 - "pipeline.ts"
Cohesion: 0.09
Nodes (39): dynamic, POST(), buildPrompt(), ensurePersianText(), escapeXml(), estimatePersianTokens(), EvaluateMessageInput, evaluateMessageWithLLM() (+31 more)

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

### Community 8 - "مستندات فنی جامع سامانه رادار"
Cohesion: 0.05
Nodes (43): استقرار خودکار با اسکریپت `DEPLOY.sh`, بات اسکنر خودکار ساعتی (`lib/botScheduler.ts`), جزئیات مراحل ارزیابی, حسابداری و مدیریت هزینه توکن‌ها (`lib/pricing.ts`), شاخص‌های کلیدی پیاده‌سازی, فهرست مطالب, محدودیت‌های نسخه فعلی, مستندات فنی جامع سامانه رادار (+35 more)

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

### Community 27 - "auth.ts"
Cohesion: 0.08
Nodes (49): dynamic, POST(), dynamic, POST(), dynamic, POST(), BaleMessage, checkSecret() (+41 more)

### Community 28 - "راهنمای تفصیلی متن و سناریوی ارائه برای طراحان و ارائه‌دهندگان — PriCoders"
Cohesion: 0.14
Nodes (13): اسلاید ۱: عنوان و هویت محصول (Cover Slide), اسلاید ۱۰: نقشه راه توسعه و مقیاس‌پذیری (Roadmap), اسلاید ۱۱: تیم، دستاوردها و پیشنهاد سرمایه‌گذاری (Team & The Ask), اسلاید ۲: مسئله بازار و واقعیت تلخ فروش (The Problem), اسلاید ۳: چرا راهکارهای فعلی شکست می‌خورند؟ (Why Existing Solutions Fail), اسلاید ۴: معرفی راه‌حل — رادار (The Solution: Radar), اسلاید ۵: چرخه کارکرد فنی و دمو زنده (How It Works & Live Demo), اسلاید ۶: خندق دفاعی و تمایز فناوری (Defensibility & Moats) (+5 more)

### Community 29 - "proxy.ts"
Cohesion: 0.50
Nodes (4): config, middleware, parseEdgeJwtPayload(), proxy()

## Knowledge Gaps
- **265 isolated node(s):** `DEBIAN_FRONTEND`, `dynamic`, `dynamic`, `dynamic`, `dynamic` (+260 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getPocketBaseClient()` connect `pocketbase.ts` to `auth.ts`, `Icons.tsx`, `pipeline.ts`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `RefreshIcon()` connect `Icons.tsx` to `voice-orb.tsx`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `ProductRecord` connect `pocketbase.ts` to `auth.ts`, `Icons.tsx`, `pipeline.ts`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `DEBIAN_FRONTEND`, `dynamic`, `dynamic` to the rest of the system?**
  _265 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Icons.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05642080517190714 - nodes in this community are weakly interconnected._
- **Should `pocketbase.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0847457627118644 - nodes in this community are weakly interconnected._
- **Should `voice-orb.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07020408163265306 - nodes in this community are weakly interconnected._