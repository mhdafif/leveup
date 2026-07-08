---
title: WAF and Rate Limiting
order: 10
estMinutes: 10
difficulty: easy
checklist:
  - Explain WAF purpose
  - Create rate limits for sensitive paths
  - Challenge or block suspicious traffic
  - Protect login and API endpoints
  - Monitor false positives
---

Cloudflare offers a couple of security tools that sit in front of your app, blocking bad traffic before it ever reaches your server: the **WAF** (Web Application Firewall) and **rate limiting**.

## What each does

- **WAF** — automatically blocks known attack patterns (like common exploit attempts) before they reach your app.
- **Rate limiting** — slows down or blocks anyone hammering an endpoint too fast (like someone trying to guess a thousand passwords per minute).

## What to protect first

The endpoints most worth protecting are the ones attackers actually target:

- `/login`
- `/api/auth/*`
- Upload endpoints
- Expensive search or export features

```
if path starts_with "/api/auth/" and requests > 20/minute then challenge
```

That rule says: if someone hits the auth API more than 20 times a minute, make them prove they're human (a "challenge") instead of letting them straight through.

## Be careful — these can block real users too

> [!WARNING]
> Security rules that are too aggressive can accidentally block legitimate users (a whole office sharing one IP address, for example). Roll out new rules carefully and watch your logs afterward to catch any false positives before they annoy real customers.

## In one sentence

Cloudflare's WAF blocks known attack patterns and rate limiting slows down abuse on sensitive endpoints (login, auth, uploads) — just roll out new rules carefully, since overly strict ones can block real users too.

## Want to go deeper?

Switch to **Expert** mode above for custom WAF rules and reviewing security events.
