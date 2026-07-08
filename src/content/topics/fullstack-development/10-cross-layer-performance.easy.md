---
title: Cross-Layer Performance
order: 10
estMinutes: 12
difficulty: easy
checklist:
  - Measure latency across browser server and database
  - Reduce unnecessary network round trips
  - Paginate and stream large data sets
  - Cache at the right layer for each response
  - Optimize payload size and rendering work
  - Track performance budgets over time
---

"This page feels slow" can come from *any* layer — a huge JavaScript bundle, a slow database query, too many separate API calls, or the browser struggling to draw thousands of elements. The key rule: **measure before you guess**.

## Break down where the time actually goes

Instead of assuming, split the total time into stages:

```ts
type Timing = { requestMs, serverMs, databaseMs, renderMs }
```

If the database only takes 40ms but the *page* still feels slow, the fix probably isn't the database at all — maybe it's making six requests back-to-back when it could make one.

## Fewer round trips beats a faster single request

If your frontend has to call five different endpoints just to draw one screen, consider building a single endpoint tailored to that screen instead:

```ts
type DashboardResponse = { user, projects, notifications }
```

One well-designed request often beats five perfectly-optimized small ones.

## Don't ship more than you need

Send only the fields the UI actually uses, paginate long lists instead of returning everything, and compress responses. A blazing-fast API response can still create a *slow feeling page* if it sends way more data than the browser needs to render.

> [!NOTE]
> Performance is a full-stack problem — a fast backend and a slow frontend (or vice versa) both produce a slow-feeling app. Fix the layer that's actually the bottleneck, which means measuring first.

## Keep an eye on it over time

> [!TIP]
> Set a rough performance budget for your key flows (like "checkout should load in under 1 second") and check against it regularly. Without a budget, performance tends to quietly get worse as features pile up.

## In one sentence

Slowness can come from any layer (frontend, network, backend, database) — measure where time is actually spent before optimizing, reduce round trips with purpose-built endpoints, keep payloads lean, and track a performance budget so things don't quietly degrade.

## Want to go deeper?

Switch to **Expert** mode above for waterfall analysis and connecting backend latency to Core Web Vitals.
