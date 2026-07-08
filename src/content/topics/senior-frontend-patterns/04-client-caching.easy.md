---
title: Client-Side Caching Strategies
order: 4
estMinutes: 12
difficulty: easy
checklist:
  - Implement an in-memory Map cache with a TTL expiry
  - Explain the stale-while-revalidate caching pattern
  - Use a library like TanStack Query or SWR to manage server state
  - Identify which data should be cached and for how long
  - Implement cache invalidation on a mutation
---

If your app fetches the same data over and over, you're wasting time and making the UI feel slow. **Client-side caching** keeps a copy of fetched data in the browser so repeat views are instant. The tricky part isn't *storing* it — it's knowing when the copy is out of date.

## A simple cache with an expiry

Store each value with a "best before" time. If it's still fresh, return it; if it's expired, forget it and refetch:

```ts
const cache = new Map()

function set(key, data, ttlMs) {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs })
}

function get(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) { cache.delete(key); return null }
  return entry.data
}
```

Use short expiry times for data that changes fast (notifications), longer for stable stuff (a list of countries).

## The nicest trick: stale-while-revalidate

This gives the best of both worlds: **show the cached copy instantly, then quietly refresh it in the background.** The user never sees a blank loading screen — they see slightly-old data immediately, and it updates the moment fresh data arrives.

## Don't build this yourself

> [!TIP]
> Libraries like **TanStack Query** and **SWR** do all of this for you — caching, background refresh, retries, and clearing stale data after you save something. For real apps, use one of these instead of hand-rolling a cache.

## One safety rule

> [!WARNING]
> Never store one user's private data in a cache that another user might read. Always tie the cache to the specific user.

## In one sentence

Client-side caching stores fetched data so repeat views are instant — give each entry an expiry, use "stale-while-revalidate" to show cached data while refreshing in the background, and reach for TanStack Query or SWR rather than building it yourself.

## Want to go deeper?

Switch to **Expert** mode above for the full TTL cache, the stale-while-revalidate implementation, and cache invalidation after mutations.
