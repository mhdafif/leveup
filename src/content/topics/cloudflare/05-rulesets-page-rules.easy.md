---
title: Rulesets and Page Rules
order: 5
estMinutes: 10
difficulty: easy
checklist:
  - Explain Cloudflare Ruleset Engine
  - Know what Page Rules were used for
  - Create URL-based redirects
  - Apply cache or header behavior by path
  - Order rules from specific to general
---

Cloudflare **Rules** let you change how a request is handled based on things like its path, hostname, or country — all without touching your app's code. Think of them as "if this, then that" instructions applied at the edge, before the request even reaches your server.

## What people actually use rules for

- Redirect `www.example.com` to `example.com` (or the other way around)
- Force every visitor to use HTTPS
- Cache certain paths (like `/assets/`) more aggressively than others
- Add custom response headers

```
if path starts_with "/assets/" then cache for 1 month
```

## Keep them simple and clearly named

> [!TIP]
> Name each rule after what it *does*, and try to avoid rules that overlap in confusing ways. If two rules could both apply to the same request, you need to understand which one wins — keeping rules simple and specific avoids that headache entirely.

## In one sentence

Cloudflare Rules let you handle things like redirects, forced HTTPS, and path-based caching at the edge — without app code — just keep them simple, clearly named, and non-overlapping.

## Want to go deeper?

Switch to **Expert** mode above for the Ruleset Engine architecture and rule precedence.
