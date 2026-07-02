---
title: DNS Zones and Records
order: 1
estMinutes: 25
difficulty: easy
checklist:
  - Explain what a DNS zone is
  - Identify A, AAAA, CNAME, MX, and TXT records
  - Point a domain to an origin server
  - Understand TTL and propagation
  - Verify records with DNS lookup tools
---

Cloudflare DNS starts with a **zone**: one domain managed by Cloudflare nameservers. Inside the zone, records tell browsers and mail servers where to send traffic.

| Record | Purpose |
| --- | --- |
| `A` | Maps a name to an IPv4 address |
| `AAAA` | Maps a name to an IPv6 address |
| `CNAME` | Aliases one hostname to another |
| `MX` | Routes email for a domain |
| `TXT` | Stores verification and policy values |

```txt
example.com.     A      203.0.113.10
www.example.com. CNAME  example.com.
example.com.     TXT    "v=spf1 include:_spf.google.com ~all"
```

> [!TIP]
> For web apps, expect at least one root record (`example.com`) and often one `www` record.

TTL controls how long resolvers can cache a record. Lower TTL helps during migrations, but Cloudflare proxied records often hide origin changes behind the proxy.

## Further Learning

- **"Cloudflare DNS records"** — official record type docs
- **"dig command DNS lookup"** — terminal verification
- **"DNS propagation explained"** — why changes are not always instant
