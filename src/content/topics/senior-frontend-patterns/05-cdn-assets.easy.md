---
title: CDN & Asset Optimization
order: 5
estMinutes: 12
difficulty: easy
checklist:
  - Explain what a CDN edge node does and why it reduces latency
  - Configure correct Cache-Control headers for static assets
  - Implement cache-busting using content-hash filenames
  - Distinguish between CDN-suitable assets and origin-only resources
  - Identify when to use a CDN for API responses via edge caching
---

A **CDN** (Content Delivery Network) keeps copies of your files on servers all around the world, so users download them from a location *near them* instead of from one distant server. A visitor in Jakarta gets your app from a Jakarta server — much faster than reaching across the ocean.

## What to put on a CDN

Great for a CDN: your **static files** — JavaScript, CSS, images, fonts, videos. They're requested constantly and rarely change, so caching them near users is a huge win.

Be careful with: your **HTML page** — it's the file that points to everything else, so you don't want a stale copy stuck around (more on that below).

## Cache the files basically forever (safely)

Here's the neat part. Modern build tools give each file a **hashed name** like `app.4f3a91.js`. When the file's content changes, the name changes too. So you can tell browsers "cache this forever" without risk — a new version gets a brand-new filename:

```
/assets/app.4f3a91.js  →  cache for a year (name changes if content changes)
/index.html            →  don't cache aggressively
```

> [!NOTE]
> Never aggressively cache your HTML entry file. It's the map to all your other files — if it's stale, users load old versions of everything. Give HTML a short cache (or "no-cache").

## In one sentence

A CDN serves your files from a server near each user for speed — cache static assets (JS/CSS/images) for a long time using hashed filenames for safe updates, but keep your HTML on a short cache so users always get the latest map.

## Want to go deeper?

Switch to **Expert** mode above for exact `Cache-Control` headers, edge-caching API responses, and cache purging.
