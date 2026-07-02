---
title: Cross-Layer Performance
order: 10
estMinutes: 35
difficulty: hard
checklist:
  - Measure latency across browser server and database
  - Reduce unnecessary network round trips
  - Paginate and stream large data sets
  - Cache at the right layer for each response
  - Optimize payload size and rendering work
  - Track performance budgets over time
---

Full-stack performance is not a single metric. A slow screen may be caused by large JavaScript, serial API calls, slow database queries, missing indexes, oversized JSON, or expensive rendering. Measure before guessing.

## Trace the Whole Request

```ts
type Timing = {
  dnsMs?: number;
  requestMs: number;
  serverMs: number;
  databaseMs: number;
  renderMs: number;
};
```

Break latency into phases. If the database takes 40 ms but the page waits on six serial requests, the fix is not a database index.

## Reduce Round Trips

```ts
type DashboardResponse = {
  user: { id: string; name: string };
  projects: { id: string; name: string }[];
  notifications: { id: string; title: string }[];
};
```

Sometimes a purpose-built endpoint is better than forcing the frontend to assemble a screen from many generic endpoints.

## Payload and Rendering

Paginate large lists, avoid sending unused fields, compress responses, and render only what the user can inspect. Backend and frontend optimizations should support each other.

> [!NOTE]
> The fastest API response can still create a slow experience if it ships too much data and forces the browser to render thousands of nodes.

> [!TIP]
> Add performance budgets for key flows. Without a budget, performance usually degrades quietly as features accumulate.

## Further Learning

Search these terms to go deeper:
- **"web performance waterfall analysis"** — finding latency sources
- **"API request batching vs overfetching"** — reducing round trips
- **"database query performance tracing"** — finding backend bottlenecks
- **"Core Web Vitals full stack performance"** — connecting backend latency to UX
