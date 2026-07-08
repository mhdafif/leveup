---
title: Caching Rules
order: 4
estMinutes: 10
difficulty: easy
checklist:
  - Explain edge caching
  - Identify cacheable static assets
  - Configure browser TTL and edge TTL
  - Purge cache safely
  - Avoid caching private content
---

Cloudflare can store copies of your responses on its servers around the world (the "edge"), so repeat visitors get an instant response without ever reaching your actual server. The easiest wins: **static assets** — images, fonts, CSS, JS — since they rarely change.

## Cache the safe stuff aggressively

```
Cache-Control: public, max-age=31536000, immutable
```

For files with a hash in the name (like `app.4f3a91.js`), it's safe to cache them for a **very long time**, since a new version automatically gets a new filename. Regular HTML that changes often should use a much shorter cache time (or none).

## The one rule you must never break

> [!IMPORTANT]
> Never cache a page that shows **personal or private data** unless you're absolutely certain the cache key correctly separates each user. Accidentally caching one user's private dashboard and serving it to a different user is a severe, embarrassing production bug.

## Clearing the cache

If you need to force Cloudflare to drop a cached copy, you can **purge** it — ideally by specific URL rather than purging *everything*. A full cache purge is easy to do but can suddenly send a big wave of traffic straight to your actual server, since everything has to be re-fetched at once.

## In one sentence

Cloudflare caches responses at the edge for speed — cache static, hashed assets aggressively, keep HTML cache short, never cache personalized/private pages by mistake, and prefer purging specific URLs over a full cache wipe.

## Want to go deeper?

Switch to **Expert** mode above for full Cache-Control semantics and the purge cache API.
