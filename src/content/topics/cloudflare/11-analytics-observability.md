---
title: Analytics and Observability
order: 11
estMinutes: 25
difficulty: easy
checklist:
  - Read traffic and cache analytics
  - Inspect security events
  - Track error rates by path
  - Use logs for incident debugging
  - Separate edge problems from origin problems
---

Cloudflare analytics helps answer where requests went, whether they were cached, and whether security rules affected them. This is often the first place to check when a site behaves differently in production.

Useful signals:

- Request volume
- Cache hit ratio
- Response status codes
- Top paths
- Security events
- Origin error spikes

> [!TIP]
> Debug production issues by asking: did the request reach Cloudflare, did Cloudflare send it to origin, and what did origin return?

## Further Learning

- **"Cloudflare analytics cache hit ratio"** — delivery metrics
- **"Cloudflare security events"** — WAF/rate-limit visibility
- **"Cloudflare logs"** — detailed request data
