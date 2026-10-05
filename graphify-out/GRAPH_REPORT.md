# Graph Report - Radar  (2026-10-05)

## Corpus Check
- 37 files · ~20,544 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 266 nodes · 463 edges · 18 communities (8 shown, 10 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6103d0ab`
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
- ConcurrencyLimiter
- InMemoryRateLimiter
- layout.tsx
- next.config.ts
- next-env.d.ts
- postcss.config.mjs
- rules/graphify.md
- ponytail.md
- workflows/graphify.md

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

## Communities (18 total, 10 thin omitted)

### Community 0 - "Icons.tsx"
Cohesion: 0.08
Nodes (39): dynamic, LeadRadarDashboard(), ProductSettingsPage(), BaleIcon(), CheckCircleIcon(), CopyIcon(), CpuIcon(), EyeIcon() (+31 more)

### Community 1 - "analyze/route.ts"
Cohesion: 0.10
Nodes (39): dynamic, POST(), dynamic, POST(), dynamic, POST(), dynamic, POST() (+31 more)

### Community 2 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 3 - "package.json"
Cohesion: 0.08
Nodes (26): next, dependencies, next, pocketbase, react, react-dom, description, ignoreScripts (+18 more)

### Community 4 - "auth.ts"
Cohesion: 0.18
Nodes (18): dynamic, POST(), dynamic, POST(), dynamic, GET(), createSessionToken(), formatSessionClearCookie() (+10 more)

### Community 5 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 6 - "Radar — AI Lead Radar"
Cohesion: 0.06
Nodes (30): 1. Prerequisites, 1. Zero Foreign Cloud Lock-in, 2. Install dependencies, 2. Vanilla TypeScript First, 3. Configure environment, 3. Zero External CDNs, 4. Native Persian / RTL Support, 4. Start PocketBase (+22 more)

## Knowledge Gaps
- **102 isolated node(s):** `dynamic`, `dynamic`, `dynamic`, `dynamic`, `dynamic` (+97 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getPocketBaseClient()` connect `analyze/route.ts` to `Icons.tsx`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `ProductRecord` connect `analyze/route.ts` to `Icons.tsx`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `isAuthenticatedRequest()` connect `auth.ts` to `analyze/route.ts`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **What connects `dynamic`, `dynamic`, `dynamic` to the rest of the system?**
  _102 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Icons.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08182349503214495 - nodes in this community are weakly interconnected._
- **Should `analyze/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10122448979591837 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._