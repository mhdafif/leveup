---
title: Caching Rules
order: 4
estMinutes: 30
difficulty: medium
checklist:
  - Explain edge caching
  - Identify cacheable static assets
  - Configure browser TTL and edge TTL
  - Purge cache safely
  - Avoid caching private content
---

Cloudflare caching stores responses at edge locations so visitors do not always hit your origin. Static assets are the easiest win: images, fonts, scripts, stylesheets, and generated static HTML.

```txt
Cache-Control: public, max-age=31536000, immutable
```

Use long cache lifetimes for fingerprinted assets. Use shorter lifetimes or revalidation for HTML that changes often.

> [!IMPORTANT]
> Never cache personalized pages unless the cache key includes the user-specific dimension. Accidentally caching private content is a severe production bug.

Purge by URL when possible. Full cache purge is easy but heavy; it can create a sudden origin traffic spike.

## Further Learning

- **"Cloudflare cache rules"** — modern cache configuration
- **"Cache-Control header public private no-store"** — HTTP cache semantics
- **"Cloudflare purge cache API"** — safe invalidation workflows
