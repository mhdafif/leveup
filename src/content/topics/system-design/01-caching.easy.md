---
title: Caching
order: 1
difficulty: easy
estMinutes: 12
checklist:
  - Understand why caches exist
  - Know cache hit vs miss
  - Compare write-through and write-back
  - Reason about eviction (LRU)
---

A **cache** is a small, fast stash of data kept close by, so you don't have to fetch the slow original every time. It's like keeping your favorite snacks on the counter instead of walking to the store — same food, way faster to grab.

## Hit and miss

When you ask the cache for something:

- **Hit** — it's there! Return it instantly. 🎉
- **Miss** — not there. Go fetch it from the slow source (like a database), then *save a copy in the cache* so next time it's a hit.

```ts
async function getUser(id) {
  const cached = await cache.get(id)
  if (cached) return cached          // hit — fast!

  const user = await db.find(id)     // miss — slow lookup
  await cache.set(id, user)          // save for next time
  return user
}
```

The goal is a high **hit rate** — answering as many requests as possible from the fast cache.

## When to use one

Cache things that are **expensive to fetch** and **read often but change rarely** — a user's profile, a product listing, an API response. Don't cache things that must always be perfectly up-to-the-second.

## The tricky part: staleness

The hard question with caches is: *when does the copy get out of date?* If the real data changes but the cache still has the old copy, users see stale info. Common fixes:

- Give cached items a **time limit** (e.g. expire after 5 minutes).
- **Clear or update** the cache when the underlying data changes.

> [!NOTE]
> There's a famous joke: "There are only two hard things in computer science — cache invalidation and naming things." Deciding *when* to refresh a cache is genuinely one of the trickier parts.

## In one sentence

A cache keeps a fast copy of expensive data nearby so repeated reads are cheap (a "hit") — the main challenge is refreshing it before the copy goes stale.

## Want to go deeper?

Switch to **Expert** mode above for write-through vs write-back strategies and LRU eviction.
