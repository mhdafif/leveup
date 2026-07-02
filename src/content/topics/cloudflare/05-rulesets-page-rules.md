---
title: Rulesets and Page Rules
order: 5
estMinutes: 25
difficulty: medium
checklist:
  - Explain Cloudflare Ruleset Engine
  - Know what Page Rules were used for
  - Create URL-based redirects
  - Apply cache or header behavior by path
  - Order rules from specific to general
---

Cloudflare Rules let you change behavior based on hostname, path, headers, IP, country, or other request attributes. Older Cloudflare setups often used Page Rules; newer setups use dedicated Rulesets.

Common use cases:

- Redirect `www` to apex or apex to `www`
- Force HTTPS
- Cache static paths more aggressively
- Add response headers
- Route traffic to Workers

```txt
if path starts_with "/assets/" then cache TTL = 1 month
```

> [!TIP]
> Keep rules boring. Write the purpose in the rule name, and avoid overlapping conditions unless you understand precedence.

## Further Learning

- **"Cloudflare Ruleset Engine"** — rules architecture
- **"Cloudflare Redirect Rules"** — URL redirects
- **"Cloudflare Transform Rules"** — header/path changes
