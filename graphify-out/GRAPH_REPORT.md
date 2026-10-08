# Graph Report - Radar  (2026-10-08)

## Corpus Check
- 73 files · ~76,257 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 621 nodes · 1098 edges · 44 communities (36 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 15 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d028d8f4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Icons.tsx
- getAuthSession
- voice-orb.tsx
- pipeline.ts
- dependencies
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
- pocketbase.ts
- assistant/route.ts
- AGENTS.md
- rules/graphify.md
- ponytail.md
- workflows/graphify.md
- next-env.d.ts
- postcss.config.mjs
- فهرست اسلایدهای ارائه
- devDependencies
- pdf_maker.ts
- telegram/route.ts
- auth.ts
- proxy.ts
- next.config.ts
- rateLimit.ts
- getClientIp
- package.json
- scripts
- اسلاید ۱۰: جمع‌بندی، پیشنهاد سرمایه‌گذاری و سپاسگزاری (08. Thank You)
- اسلاید ۶: چرخه کارکرد فنی و گام‌های پردازش (04. How Radar Works?)
- اسلاید ۸: ارزش اقتصادی، اقتصاد واحد و سودآوری (06. Business Value)
- اسلاید ۳: مسئله بازار و واقعیت تلخ فروش سازمانی (01. The Problem)
- اسلاید ۵: معرفی راه‌حل — سامانه هوشمند رادار (03. Radar)
- اسلاید ۷: پشته فناوری، زیرساخت و پایداری محلی (05. The Tech)
- اسلاید ۹: تیم توسعه و مهندسی سیستم (07. Our Team)
- اسلاید ۱: عنوان، هویت محصول و بیانیه ارزش (Cover Slide)
- اسلاید ۴: بینش بازار، ظرفیت تقاضا و اندازه مارکت (02. Market Insights)

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
10. `طرح کسب‌وکار جامع، مدل اقتصادی سازمانی و تحلیل مالی` - 14 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `isAuthenticatedRequest()`  [EXTRACTED]
  app/api/analyze/route.ts → lib/auth.ts
- `POST()` --calls--> `triageAdHocMessage()`  [EXTRACTED]
  app/api/analyze/route.ts → lib/pipeline.ts
- `POST()` --calls--> `triagePendingMessage()`  [EXTRACTED]
  app/api/analyze/route.ts → lib/pipeline.ts
- `POST()` --calls--> `getClientIp()`  [EXTRACTED]
  app/api/analyze/route.ts → lib/rateLimit.ts
- `POST()` --calls--> `timingSafeEqual()`  [EXTRACTED]
  app/api/auth/login/route.ts → lib/auth.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **One-Shot Deploy and Production Checklist** — readme_deploy_sh, readme_public_pocketbase_url, readme_csp_connect_src, readme_next_public_baketime, readme_secure_cookies_https, readme_pb_data_backups [EXTRACTED 1.00]
- **3-Layer Triage Pipeline** — readme_triage_pipeline, readme_layer0_deterministic, readme_layer1_screen, readme_layer2_llm [EXTRACTED 1.00]
- **Telegram and Bale Webhook Ingest** — readme_telegram_ingest_endpoint, readme_bale_ingest_endpoint, readme_telegram_webhook_secret, readme_bale_webhook_secret, readme_setwebhook_registration [EXTRACTED 1.00]

## Communities (44 total, 8 thin omitted)

### Community 0 - "Icons.tsx"
Cohesion: 0.06
Nodes (58): LeadRadarDashboard(), dynamic, dynamic, dynamic, OnboardingPage(), COMPARISON_DIMENSIONS, PersianLandingPage(), PRICING_PLANS (+50 more)

### Community 1 - "getAuthSession"
Cohesion: 0.16
Nodes (17): dynamic, GET(), dynamic, GET(), POST(), dynamic, GET(), register() (+9 more)

### Community 2 - "voice-orb.tsx"
Cohesion: 0.07
Nodes (39): metadata, viewport, DEFAULT_COLORS, level(), createOrbRenderer(), OrbFrame, rgb(), VoiceOrb() (+31 more)

### Community 3 - "pipeline.ts"
Cohesion: 0.10
Nodes (35): buildPrompt(), ensurePersianText(), escapeXml(), estimatePersianTokens(), EvaluateMessageInput, evaluateMessageWithLLM(), heuristicPersianEvaluator(), IntentEvaluationResult (+27 more)

### Community 4 - "dependencies"
Cohesion: 0.13
Nodes (15): clsx, motion, next, dependencies, clsx, motion, next, pocketbase (+7 more)

### Community 5 - "طرح کسب‌وکار جامع، مدل اقتصادی سازمانی و تحلیل مالی"
Cohesion: 0.06
Nodes (35): ارزش پیشنهادی رادار:, الف. هزینه‌های متغیر ماهانه, ب. هزینه‌های ثابت و سرشکن‌شده زیرساخت, برنامه تفصیلی تخصیص منابع جذب‌شده:, تحلیل اهرم عملیاتی در مراحل سه‌گانه مقیاس‌پذیری:, جمع‌بندی بهای تمام‌شده واقعی واحد:, دورنمای مالی ۳ ساله:, سامانه هوشمند رادار — PriCoders (+27 more)

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

### Community 15 - "pocketbase.ts"
Cohesion: 0.18
Nodes (18): dynamic, POST(), dynamic, POST(), dynamic, POST(), dynamic, dynamic (+10 more)

### Community 16 - "assistant/route.ts"
Cohesion: 0.67
Nodes (3): cleanOutput(), dynamic, POST()

### Community 24 - "فهرست اسلایدهای ارائه"
Cohesion: 0.25
Nodes (7): اسلاید ۲: فهرست مطالب ارائه (List of Contents), راهنمای تفصیلی سناریوی ارائه، پیام‌های محوری و چیدمان اسلایدها — PriCoders, عناوین بخش‌های ارائه:, فهرست اسلایدهای ارائه, محتوای اسلایدهای ارائه سرمایه‌پذیری رادار (Pitch Deck), چیدمان المان‌های قالب کانوا:, یادداشت گوینده:

### Community 25 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 26 - "pdf_maker.ts"
Cohesion: 0.17
Nodes (12): buildHtmlPage(), docsDir, escapeHtml(), fontsDir, formatInline(), mdFiles, parseMarkdown(), closeTable() (+4 more)

### Community 27 - "telegram/route.ts"
Cohesion: 0.16
Nodes (20): BaleMessage, checkSecret(), dynamic, POST(), checkSecret(), dynamic, POST(), TelegramChat (+12 more)

### Community 28 - "auth.ts"
Cohesion: 0.16
Nodes (15): dynamic, POST(), AuthSession, formatOnboardedClearCookie(), formatSessionClearCookie(), getCryptoKey(), getRadarApiKey(), getSessionTokenFromRequest() (+7 more)

### Community 29 - "proxy.ts"
Cohesion: 0.50
Nodes (4): config, middleware, parseEdgeJwtPayload(), proxy()

### Community 31 - "rateLimit.ts"
Cohesion: 0.17
Nodes (13): dynamic, POST(), dynamic, POST(), checkUserPlanLimit(), llmConcurrencyLimiter, PLAN_LIMITS, PlanRateLimitConfig (+5 more)

### Community 32 - "getClientIp"
Cohesion: 0.32
Nodes (12): dynamic, POST(), dynamic, POST(), POST(), createSessionToken(), formatOnboardedSetCookie(), formatSessionSetCookie() (+4 more)

### Community 33 - "package.json"
Cohesion: 0.24
Nodes (9): description, ignoreScripts, name, packageManager, private, trustedDependencies, version, sharp (+1 more)

### Community 34 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, pb, seed, setup:pb, start, worker

### Community 35 - "اسلاید ۱۰: جمع‌بندی، پیشنهاد سرمایه‌گذاری و سپاسگزاری (08. Thank You)"
Cohesion: 0.29
Nodes (7): اسلاید ۱۰: جمع‌بندی، پیشنهاد سرمایه‌گذاری و سپاسگزاری (08. Thank You), برنامه تخصیص دقیق منابع (۳.۵ میلیارد تومان):, درگاه‌های دسترسی و دمو:, متن انگلیسی باکس نهایی:, پیشنهاد سرمایه‌پذیری (Investment Ask):, چیدمان المان‌های قالب کانوا:, یادداشت گوینده:

### Community 36 - "اسلاید ۶: چرخه کارکرد فنی و گام‌های پردازش (04. How Radar Works?)"
Cohesion: 0.29
Nodes (7): اسلاید ۶: چرخه کارکرد فنی و گام‌های پردازش (04. How Radar Works?), متن انگلیسی گام‌ها:, چیدمان المان‌های قالب کانوا:, کارت گام اول (`01: Multi-Channel Ingest & Fast Filter`):, کارت گام دوم (`02: Deep LLM Analysis & Budget Match`):, کارت گام سوم (`03: Instant Alert & Lead Conversion`):, یادداشت گوینده:

### Community 37 - "اسلاید ۸: ارزش اقتصادی، اقتصاد واحد و سودآوری (06. Business Value)"
Cohesion: 0.29
Nodes (7): اسلاید ۸: ارزش اقتصادی، اقتصاد واحد و سودآوری (06. Business Value), ماتریس تعرفه‌ها و سطوح درآمدی:, متن انگلیسی اسلاید:, نمودار مقایسه‌ای روش سنتی در برابر رادار (Bar Chart):, چیدمان المان‌های قالب کانوا:, کالبدشکافی بهای تمام‌شده و حاشیه سود (پلن استارتر ۱,۸۹۰,۰۰۰ تومانی):, یادداشت گوینده:

### Community 38 - "اسلاید ۳: مسئله بازار و واقعیت تلخ فروش سازمانی (01. The Problem)"
Cohesion: 0.33
Nodes (6): اسلاید ۳: مسئله بازار و واقعیت تلخ فروش سازمانی (01. The Problem), شاخص‌های کلیدی اسلاید:, پاراگراف دوم: ناکارآمدی و بهای سنگین روش‌های دستی, پاراگراف نخست: نبض خرید در پیام‌رسان‌ها و چالش نویز فرساینده, چیدمان المان‌های قالب کانوا:, یادداشت گوینده:

### Community 39 - "اسلاید ۵: معرفی راه‌حل — سامانه هوشمند رادار (03. Radar)"
Cohesion: 0.33
Nodes (6): اسلاید ۵: معرفی راه‌حل — سامانه هوشمند رادار (03. Radar), متن انگلیسی کارت‌ها:, متن توصیفی سمت چپ:, چیدمان المان‌های قالب کانوا:, یادداشت گوینده:, ۳ کارت مشخصه در سمت راست:

### Community 40 - "اسلاید ۷: پشته فناوری، زیرساخت و پایداری محلی (05. The Tech)"
Cohesion: 0.33
Nodes (6): اسلاید ۷: پشته فناوری، زیرساخت و پایداری محلی (05. The Tech), متن انگلیسی کادرها:, چیدمان المان‌های قالب کانوا:, کادر دوم: هوش مصنوعی بومی و تاب‌آوری ۱۰۰ درصدی (Domestic Resilience), کادر نخست: هسته پرسرعت و پایگاه داده بلادرنگ (High-Performance Core), یادداشت گوینده:

### Community 41 - "اسلاید ۹: تیم توسعه و مهندسی سیستم (07. Our Team)"
Cohesion: 0.33
Nodes (6): اسلاید ۹: تیم توسعه و مهندسی سیستم (07. Our Team), مشخصات سروش بابایی (Soroush Babaei):, مشخصات پارسا نادری (Parsa Naderi):, پیام هویتی تیم:, چیدمان المان‌های قالب کانوا:, یادداشت گوینده:

### Community 42 - "اسلاید ۱: عنوان، هویت محصول و بیانیه ارزش (Cover Slide)"
Cohesion: 0.40
Nodes (5): اسلاید ۱: عنوان، هویت محصول و بیانیه ارزش (Cover Slide), متن کارت شاخص و بیانیه ارزش:, پیام محوری اسلاید:, چیدمان المان‌های قالب کانوا:, یادداشت گوینده:

### Community 43 - "اسلاید ۴: بینش بازار، ظرفیت تقاضا و اندازه مارکت (02. Market Insights)"
Cohesion: 0.40
Nodes (5): اسلاید ۴: بینش بازار، ظرفیت تقاضا و اندازه مارکت (02. Market Insights), تحلیل ابعاد بازار رادار در ایران:, متن انگلیسی قالب:, چیدمان المان‌های قالب کانوا:, یادداشت گوینده:

## Knowledge Gaps
- **283 isolated node(s):** `DEBIAN_FRONTEND`, `dynamic`, `dynamic`, `dynamic`, `dynamic` (+278 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getPocketBaseClient()` connect `pocketbase.ts` to `Icons.tsx`, `getAuthSession`, `getClientIp`, `telegram/route.ts`, `rateLimit.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `RefreshIcon()` connect `Icons.tsx` to `voice-orb.tsx`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `ProductRecord` connect `pocketbase.ts` to `Icons.tsx`, `getAuthSession`, `pipeline.ts`, `telegram/route.ts`, `rateLimit.ts`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `DEBIAN_FRONTEND`, `dynamic`, `dynamic` to the rest of the system?**
  _283 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Icons.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05593803786574871 - nodes in this community are weakly interconnected._
- **Should `voice-orb.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06823529411764706 - nodes in this community are weakly interconnected._
- **Should `pipeline.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1039136302294197 - nodes in this community are weakly interconnected._