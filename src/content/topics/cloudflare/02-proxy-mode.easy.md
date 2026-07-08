---
title: Proxy Mode
order: 2
estMinutes: 10
difficulty: easy
checklist:
  - Explain orange-cloud proxied mode
  - Explain DNS-only mode
  - Know when Cloudflare hides the origin IP
  - Understand request flow through the edge
  - Pick proxy mode for common use cases
---

In Cloudflare, each DNS record can be either **proxied** (the orange cloud icon) or **DNS-only** (gray cloud). This one toggle decides a lot about how your traffic is handled.

## Proxied: traffic goes through Cloudflare first

```
Visitor → Cloudflare (protection + caching) → Your server
```

With proxying **on**, Cloudflare sits in front of your server and adds a bunch of free benefits: caching (faster loads), a firewall against attacks, bot protection, and it **hides your server's real address** from the public internet.

## DNS-only: Cloudflare just answers "what's the address?"

With proxying **off**, Cloudflare only tells visitors your server's address — after that, they connect *directly* to it, with none of Cloudflare's protection in between.

## When to use each

- **Proxied (orange)** — the default choice for your website's traffic. Free CDN + security.
- **DNS-only (gray)** — for things Cloudflare can't proxy on a normal plan, or when another service needs to handle the connection directly (like some email or specific server protocols).

> [!WARNING]
> Turning on the proxy doesn't protect you if your server's real IP address is exposed somewhere else (an old DNS record, an email header, etc.). Lock your actual server's firewall down to only accept traffic from Cloudflare's known IP ranges for full protection.

## In one sentence

Proxied (orange cloud) routes traffic through Cloudflare for caching, security, and IP hiding; DNS-only (gray cloud) just resolves the address and connects directly — use proxied by default, and lock your server's firewall to Cloudflare's IPs for real protection.

## Want to go deeper?

Switch to **Expert** mode above for supported ports and origin IP protection in depth.
