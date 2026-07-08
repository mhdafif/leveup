---
title: SSL and TLS Modes
order: 3
estMinutes: 10
difficulty: easy
checklist:
  - Explain Flexible, Full, and Full Strict modes
  - Choose Full Strict for production
  - Install an origin certificate
  - Understand edge certificate vs origin certificate
  - Avoid redirect loops
---

Cloudflare sits between visitors and your server, so there are actually **two** connections to secure: visitor→Cloudflare, and Cloudflare→your server. The **SSL/TLS mode** setting decides how strict the second connection is.

## The three modes

| Mode | Visitor ↔ Cloudflare | Cloudflare ↔ Your server |
|---|---|---|
| Flexible | Encrypted (HTTPS) | Not encrypted (HTTP) |
| Full | Encrypted | Encrypted, but doesn't verify the certificate |
| **Full Strict** | Encrypted | Encrypted **and verified** |

> [!IMPORTANT]
> For a real production site, always use **Full Strict**. It's the only mode that's genuinely secure end-to-end, with both legs encrypted and verified.

## The classic beginner trap

> [!CAUTION]
> "Flexible" mode commonly causes an infinite **redirect loop** if your own server also redirects HTTP to HTTPS. Cloudflare talks to your server over HTTP, your server sees that and redirects to HTTPS, Cloudflare follows it... and loops forever. Switching to **Full** or **Full Strict** fixes this.

## Getting a certificate for Full Strict

Cloudflare offers free **Origin Certificates** specifically for this — they're trusted by Cloudflare (which is all you need, since only Cloudflare talks directly to your server), even though a regular browser wouldn't trust them on their own.

## In one sentence

Cloudflare's SSL/TLS mode controls how secure the *second* connection (Cloudflare→your server) is — use **Full Strict** in production with a Cloudflare Origin Certificate, and avoid "Flexible" mode if your server already redirects to HTTPS (it causes redirect loops).

## Want to go deeper?

Switch to **Expert** mode above for installing an origin certificate and avoiding redirect loops in detail.
