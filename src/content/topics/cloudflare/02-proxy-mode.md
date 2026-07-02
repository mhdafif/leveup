---
title: Proxy Mode
order: 2
estMinutes: 25
difficulty: easy
checklist:
  - Explain orange-cloud proxied mode
  - Explain DNS-only mode
  - Know when Cloudflare hides the origin IP
  - Understand request flow through the edge
  - Pick proxy mode for common use cases
---

Cloudflare records can be **proxied** or **DNS-only**. Proxied records send traffic through Cloudflare edge servers. DNS-only records only answer DNS and send traffic directly to the origin.

```txt
Visitor -> Cloudflare edge -> Origin server
```

Proxied mode enables CDN caching, WAF, bot protection, redirects, Workers, and TLS handling. It also hides the origin IP for HTTP traffic.

DNS-only mode is useful for protocols Cloudflare does not proxy on normal plans, direct service records, or when another provider must terminate traffic.

> [!WARNING]
> A proxied record does not protect your origin if the origin IP is exposed elsewhere. Lock origin firewall rules to Cloudflare IP ranges when possible.

## Further Learning

- **"Cloudflare proxied DNS records"** — orange cloud behavior
- **"Cloudflare origin IP protection"** — firewalling origins
- **"Cloudflare supported ports"** — which ports can be proxied
