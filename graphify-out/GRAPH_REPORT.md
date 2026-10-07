# Graph Report - Radar  (2026-10-07)

## Corpus Check
- 53 files · ~32,387 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 368 nodes · 628 edges · 22 communities (13 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3fdba73d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Icons.tsx
- analyze/route.ts
- compilerOptions
- package.json
- auth.ts
- devDependencies
- Radar — AI Lead Radar
- AGENTS.md
- مستندات فنی و معماری سامانه رادار (Radar)
- InMemoryRateLimiter
- voice-orb.tsx
- next.config.ts
- next-env.d.ts
- postcss.config.mjs
- rules/graphify.md
- ponytail.md
- workflows/graphify.md
- ConcurrencyLimiter
- components.json
- ease.ts
- assistant/route.ts

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `isAuthenticatedRequest()` - 14 edges
3. `getPocketBaseClient()` - 14 edges
4. `Radar — AI Lead Radar` - 14 edges
5. `مستندات فنی و معماری سامانه رادار (Radar)` - 12 edges
6. `authenticateSuperuser()` - 11 edges
7. `toPersianDigits()` - 11 edges
8. `Quickstart` - 10 edges
9. `cn()` - 9 edges
10. `evaluateMessageWithLLM()` - 9 edges

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
Cohesion: 0.07
Nodes (49): LeadRadarDashboard(), dynamic, PersianLandingPage(), SAMPLE_SIGNALS, SampleSignal, ProductSettingsPage(), AssistantSuggestions(), AssistantSuggestionsProps (+41 more)

### Community 1 - "analyze/route.ts"
Cohesion: 0.10
Nodes (39): dynamic, POST(), dynamic, POST(), dynamic, POST(), dynamic, POST() (+31 more)

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

### Community 8 - "مستندات فنی و معماری سامانه رادار (Radar)"
Cohesion: 0.11
Nodes (17): Opportunity Intelligence Engine, توسعه داده شده توسط تیم PriCoders, سطوح نیت:, مستندات فنی و معماری سامانه رادار (Radar), ۱. معرفی و جایگاه محصول (Product Positioning), ۱۰. نقشه راه توسعه و مقیاس‌پذیری آینده (Future Scaling Roadmap), ۲. نمای کلی معماری سیستم (System Architecture), ۳. لایه‌های فناوری (Technology Stack) (+9 more)

### Community 10 - "voice-orb.tsx"
Cohesion: 0.09
Nodes (30): metadata, viewport, DEFAULT_COLORS, level(), createOrbRenderer(), OrbFrame, rgb(), VoiceOrb() (+22 more)

### Community 19 - "components.json"
Cohesion: 0.12
Nodes (15): aliases, components, hooks, lib, ui, utils, rsc, $schema (+7 more)

### Community 20 - "ease.ts"
Cohesion: 0.20
Nodes (9): EASE_DRAWER, EASE_IN_OUT, EASE_OUT, EASE_OUT_CSS, SPRING_LAYOUT, SPRING_MOUSE, SPRING_PANEL, SPRING_PRESS (+1 more)

### Community 21 - "assistant/route.ts"
Cohesion: 0.67
Nodes (3): cleanOutput(), dynamic, POST()

## Knowledge Gaps
- **152 isolated node(s):** `dynamic`, `dynamic`, `dynamic`, `dynamic`, `dynamic` (+147 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getPocketBaseClient()` connect `analyze/route.ts` to `Icons.tsx`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `ProductRecord` connect `analyze/route.ts` to `Icons.tsx`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `RefreshIcon()` connect `Icons.tsx` to `voice-orb.tsx`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `dynamic`, `dynamic`, `dynamic` to the rest of the system?**
  _152 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Icons.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06956521739130435 - nodes in this community are weakly interconnected._
- **Should `analyze/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10122448979591837 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._