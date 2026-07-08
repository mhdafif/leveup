---
title: Caching Strategies
order: 6
estMinutes: 10
difficulty: easy
checklist:
  - Explain cache hits and misses
  - Choose cache keys that include all required inputs
  - Set expiration based on freshness requirements
  - Invalidate cached data after writes
  - Use HTTP caching for public responses
---

**Caching** means saving the answer to an expensive question so you don't have to work it out again next time. It can make your backend dramatically faster — but get it wrong and you'll serve stale (or even the wrong person's!) data.

## The cache key must include everything that matters

A cache key is the "label" you save a result under. If your key is missing something important, you'll accidentally show the wrong data:

```ts
function cacheKey(userId, status, page) {
  return `projects:${userId}:${status}:${page}`
}
```

> [!IMPORTANT]
> If the key left out `userId`, one user could see *another user's* cached data! Always include every input that changes the result in the key.

## How long to keep it

Give cached data an expiry time based on how "fresh" it needs to be:

```ts
const cached = await cache.get(key)
if (cached) return cached

const fresh = await computeExpensiveThing()
await cache.set(key, fresh, { ttlSeconds: 300 })  // good for 5 minutes
return fresh
```

For anything the user just changed (like their own profile), update or clear the cache **immediately** after the write — don't wait for the expiry.

## In one sentence

Caching saves expensive results under a key — make sure the key includes every input that affects the answer (or you'll leak data between users), give it a sensible expiry, and clear it right after a write that changes it.

## Want to go deeper?

Switch to **Expert** mode above for HTTP caching (`Cache-Control`, `ETag`) and cache invalidation patterns.
