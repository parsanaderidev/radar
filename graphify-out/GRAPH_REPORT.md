# Graph Report - Radar  (2026-10-07)

## Corpus Check
- 50 files · ~26,136 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 339 nodes · 576 edges · 21 communities (12 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `afacfa2d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- app/page.tsx
- analyze/route.ts
- compilerOptions
- package.json
- auth.ts
- devDependencies
- Radar — AI Lead Radar
- AGENTS.md
- InMemoryRateLimiter
- Icons.tsx
- next.config.ts
- next-env.d.ts
- postcss.config.mjs
- rules/graphify.md
- ponytail.md
- workflows/graphify.md
- voice-orb.tsx
- components.json
- dependencies
- assistant/route.ts

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `isAuthenticatedRequest()` - 14 edges
3. `getPocketBaseClient()` - 14 edges
4. `Radar — AI Lead Radar` - 14 edges
5. `authenticateSuperuser()` - 11 edges
6. `toPersianDigits()` - 11 edges
7. `Quickstart` - 10 edges
8. `cn()` - 9 edges
9. `evaluateMessageWithLLM()` - 9 edges
10. `ProductRecord` - 9 edges

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

## Communities (21 total, 9 thin omitted)

### Community 0 - "app/page.tsx"
Cohesion: 0.14
Nodes (27): LeadRadarDashboard(), BaleIcon(), CopyIcon(), PlayIcon(), SearchIcon(), SparklesIcon(), TelegramIcon(), TwitterXIcon() (+19 more)

### Community 1 - "analyze/route.ts"
Cohesion: 0.09
Nodes (40): dynamic, POST(), dynamic, POST(), dynamic, POST(), dynamic, POST() (+32 more)

### Community 2 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 3 - "package.json"
Cohesion: 0.12
Nodes (17): description, ignoreScripts, name, packageManager, private, scripts, build, dev (+9 more)

### Community 4 - "auth.ts"
Cohesion: 0.18
Nodes (18): dynamic, POST(), dynamic, POST(), dynamic, GET(), createSessionToken(), formatSessionClearCookie() (+10 more)

### Community 5 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 6 - "Radar — AI Lead Radar"
Cohesion: 0.06
Nodes (30): 1. Prerequisites, 1. Zero Foreign Cloud Lock-in, 2. Install dependencies, 2. Vanilla TypeScript First, 3. Configure environment, 3. Zero External CDNs, 4. Native Persian / RTL Support, 4. Start PocketBase (+22 more)

### Community 10 - "Icons.tsx"
Cohesion: 0.07
Nodes (35): metadata, viewport, dynamic, ProductSettingsPage(), askRadarAssistant(), fallbackDomainAssistant(), AssistantInput(), AssistantInputProps (+27 more)

### Community 18 - "voice-orb.tsx"
Cohesion: 0.12
Nodes (18): DEFAULT_COLORS, level(), createOrbRenderer(), OrbFrame, rgb(), VoiceOrb(), VoiceOrbProps, EASE_DRAWER (+10 more)

### Community 19 - "components.json"
Cohesion: 0.12
Nodes (15): aliases, components, hooks, lib, ui, utils, rsc, $schema (+7 more)

### Community 20 - "dependencies"
Cohesion: 0.13
Nodes (15): clsx, motion, next, dependencies, clsx, motion, next, pocketbase (+7 more)

## Knowledge Gaps
- **137 isolated node(s):** `dynamic`, `dynamic`, `dynamic`, `dynamic`, `dynamic` (+132 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getPocketBaseClient()` connect `analyze/route.ts` to `app/page.tsx`, `Icons.tsx`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `RefreshIcon()` connect `Icons.tsx` to `app/page.tsx`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `ProductRecord` connect `analyze/route.ts` to `app/page.tsx`, `Icons.tsx`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `dynamic`, `dynamic`, `dynamic` to the rest of the system?**
  _137 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13903743315508021 - nodes in this community are weakly interconnected._
- **Should `analyze/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08686868686868687 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._