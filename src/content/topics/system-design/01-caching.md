---
title: Caching
order: 1
estMinutes: 25
difficulty: medium
checklist:
  - Understand why caches exist
  - Know cache hit vs miss
  - Compare write-through and write-back
  - Reason about eviction (LRU)
---

A **cache** keeps a copy of expensive-to-fetch data close to where it's needed,
so repeated reads are cheap. The whole game is maximizing the **hit rate** — the
fraction of reads the cache can answer without touching the slow source.

> [!NOTE]
> A cache **hit** is served from the fast layer. A **miss** falls through to the
> database, then usually populates the cache for next time.

## Write strategies

- **Write-through** — write to cache and database together. Safe, slightly
  slower writes.
- **Write-back** — write to cache now, flush to the database later. Fast, but
  risks data loss on crash.

```ts
async function getUser(id: string): Promise<User> {
  const cached = await cache.get(id);
  if (cached) return cached; // hit
  const user = await db.users.find(id); // miss
  await cache.set(id, user, { ttlSeconds: 300 });
  return user;
}
```
