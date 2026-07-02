---
title: SSL and TLS Modes
order: 3
estMinutes: 30
difficulty: medium
checklist:
  - Explain Flexible, Full, and Full Strict modes
  - Choose Full Strict for production
  - Install an origin certificate
  - Understand edge certificate vs origin certificate
  - Avoid redirect loops
---

Cloudflare terminates TLS at the edge, then connects to your origin. The SSL/TLS mode controls how secure that second leg is.

| Mode | Browser to Cloudflare | Cloudflare to origin |
| --- | --- | --- |
| Flexible | HTTPS | HTTP |
| Full | HTTPS | HTTPS, cert not strictly verified |
| Full Strict | HTTPS | HTTPS, valid cert required |

Production sites should use **Full Strict**. It gives encryption and validation on both legs.

> [!CAUTION]
> Flexible mode often causes redirect loops when your origin redirects HTTP to HTTPS.

Cloudflare Origin Certificates are trusted by Cloudflare, not normal browsers. They are good for origins that only receive traffic through Cloudflare.

## Further Learning

- **"Cloudflare SSL TLS modes"** — official mode guide
- **"Cloudflare origin certificate"** — installing origin certs
- **"Cloudflare redirect loop flexible SSL"** — common failure mode
