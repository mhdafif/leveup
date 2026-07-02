---
title: CDN and Reverse Proxy
order: 5
estMinutes: 30
difficulty: medium
checklist:
  - Explain reverse proxy traffic flow
  - Explain CDN edge caching
  - Understand origin servers
  - Read forwarding headers
  - Separate edge errors from origin errors
---

A reverse proxy receives client traffic and forwards it to an origin. A CDN is a distributed reverse proxy that can cache content near users.

```txt
Browser -> CDN edge -> origin server
```

Forwarding headers such as `X-Forwarded-For` and `X-Forwarded-Proto` help the origin understand the original client and protocol.

> [!TIP]
> If a site fails behind a CDN, test both the public CDN URL and the origin path if safely available.

## Further Learning

- **"reverse proxy vs forward proxy"** — proxy roles
- **"CDN edge caching explained"** — performance model
- **"X-Forwarded headers"** — proxy metadata
