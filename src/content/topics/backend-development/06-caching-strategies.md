---
title: Caching Strategies
order: 6
estMinutes: 30
difficulty: medium
checklist:
  - Explain cache hits and misses
  - Choose cache keys that include all required inputs
  - Set expiration based on freshness requirements
  - Invalidate cached data after writes
  - Use HTTP caching for public responses
---

Caching stores a result so future reads can skip expensive work. It can reduce latency, database load, and infrastructure cost. It can also serve stale or incorrect data if keys and invalidation are careless.

## Cache Keys

A cache key must include every input that changes the result.

```ts
function projectListCacheKey(userId: string, status: "open" | "archived", page: number) {
  return `projects:${userId}:${status}:${page}`;
}
```

If the key omits `userId`, one user may see another user's projects. If it omits `status`, archived and open projects may mix.

## Expiration and Invalidation

```ts
async function getProjectSummary(projectId: string) {
  const key = `project-summary:${projectId}`;
  const cached = await cache.get<ProjectSummary>(key);
  if (cached) return cached;

  const summary = await buildProjectSummary(projectId);
  await cache.set(key, summary, { ttlSeconds: 300 });
  return summary;
}
```

Time-to-live expiration is simple and robust for data that can be a little stale. For user-facing writes, invalidate or update the cache immediately after the write succeeds.

> [!NOTE]
> Caching is a correctness problem before it is a performance problem. Know how stale each response is allowed to be.

## HTTP Caching

Public assets and anonymous API responses can use `Cache-Control`, `ETag`, and CDN caches. Private account data should be marked private or not cached by shared infrastructure.

> [!WARNING]
> Never put personalized data behind a shared public cache unless the cache key varies by the authenticated user in a proven way.

## Further Learning

Search these terms to go deeper:
- **"cache aside pattern"** — common application caching strategy
- **"HTTP Cache-Control ETag explained"** — browser and CDN caching
- **"Redis caching patterns"** — in-memory cache usage
- **"cache invalidation strategies"** — keeping cached data correct
