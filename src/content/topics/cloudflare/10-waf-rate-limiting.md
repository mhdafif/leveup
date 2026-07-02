---
title: WAF and Rate Limiting
order: 10
estMinutes: 30
difficulty: medium
checklist:
  - Explain WAF purpose
  - Create rate limits for sensitive paths
  - Challenge or block suspicious traffic
  - Protect login and API endpoints
  - Monitor false positives
---

Cloudflare security tools sit before your app. The WAF blocks known attack patterns. Rate limiting slows abusive traffic. Bot controls challenge suspicious clients.

Good paths to protect first:

- `/login`
- `/api/auth/*`
- `/api/upload/*`
- expensive search or export endpoints

```txt
if path starts_with "/api/auth/" and requests > 20 per minute then challenge
```

> [!WARNING]
> Security rules can block real users. Roll out carefully and watch logs before making rules too aggressive.

## Further Learning

- **"Cloudflare WAF custom rules"** — request filtering
- **"Cloudflare rate limiting rules"** — abuse control
- **"Cloudflare security events"** — reviewing blocks and challenges
