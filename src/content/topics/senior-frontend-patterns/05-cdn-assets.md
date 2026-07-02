---
title: CDN & Asset Optimization
order: 5
estMinutes: 25
difficulty: medium
checklist:
  - Explain what a CDN edge node does and why it reduces latency
  - Configure correct Cache-Control headers for static assets
  - Implement cache-busting using content-hash filenames
  - Distinguish between CDN-suitable assets and origin-only resources
  - Identify when to use a CDN for API responses via edge caching
---

A content delivery network places cached copies of responses on geographically distributed edge nodes. When a user in Jakarta requests a JavaScript bundle, the response can come from a nearby edge location instead of the origin server in another region. That reduces round-trip latency and protects the origin from repeated asset traffic.

## What Belongs On A CDN

Static assets are ideal: JavaScript, CSS, images, videos, fonts, and downloadable files. They are requested often, change rarely, and can be keyed by URL. HTML entry points need more care because they decide which hashed assets the browser loads.

```ts
type CachePolicy = {
  pathPattern: string;
  cacheControl: string;
};

export const assetPolicies: CachePolicy[] = [
  {
    pathPattern: "/assets/*",
    cacheControl: "public, max-age=31536000, immutable",
  },
  {
    pathPattern: "/*.html",
    cacheControl: "no-cache",
  },
];
```

Hashed filenames make long-lived caching safe. If `app.4f3a91.js` changes, the next build emits a different filename, so users never reuse stale code for a changed asset.

## API Edge Caching

Some API responses can also be cached at the edge, especially public `GET` responses keyed fully by URL. Product catalogs, docs navigation, exchange-rate snapshots, and unauthenticated search suggestions can work well. Per-user dashboards and mutation responses should stay origin-only unless your cache key includes the exact authorization and privacy boundaries.

```ts
export function buildPublicApiHeaders(seconds: number): HeadersInit {
  return {
    "Cache-Control": `public, max-age=${seconds}, s-maxage=${seconds}`,
    "Vary": "Accept-Encoding",
  };
}
```

Cache purging is the escape hatch when an object must be invalidated before its TTL expires. Prefer content hashes for build assets and targeted purge keys for dynamic CDN entries.

> [!NOTE]
> Your HTML entry point should never be aggressively cached — it's the file that loads everything else. Use Cache-Control: no-cache or short max-age for HTML.

## Further Learning

Search these terms to go deeper:
- **"Cache-Control immutable hashed assets"** — safe long-lived browser caching
- **"CDN edge caching API responses"** — when dynamic responses can live at the edge
- **"content hash cache busting"** — deployment-safe asset filename strategies
- **"CDN cache purge surrogate key"** — targeted invalidation for cached objects
