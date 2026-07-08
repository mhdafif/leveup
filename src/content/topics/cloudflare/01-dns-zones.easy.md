---
title: DNS Zones and Records
order: 1
estMinutes: 10
difficulty: easy
checklist:
  - Explain what a DNS zone is
  - Identify A, AAAA, CNAME, MX, and TXT records
  - Point a domain to an origin server
  - Understand TTL and propagation
  - Verify records with DNS lookup tools
---

When you add your domain to **Cloudflare**, it becomes a **zone** — one domain that Cloudflare now manages the DNS for. Inside that zone, you add **records** that tell the internet where different things live.

## The records you'll actually use

| Record | What it does |
|---|---|
| `A` | Points a name to a server's address (e.g. `example.com → 203.0.113.10`) |
| `CNAME` | Points a name to *another* name (an alias, e.g. `www` → the root domain) |
| `MX` | Where email for your domain goes |
| `TXT` | Free-text, often used to prove domain ownership |

```
example.com.     A      203.0.113.10
www.example.com. CNAME  example.com.
```

For a typical website, you'll mostly touch the root **A** record and a **www CNAME**.

## Changes take a moment to spread

> [!TIP]
> After changing a DNS record, it doesn't update *everywhere* instantly — the TTL (time-to-live) controls how long the old value is cached elsewhere. Give it a little time before assuming something's broken.

## In one sentence

A Cloudflare zone is your domain's DNS home — set an **A** record to point to your server and a **CNAME** for `www`, and remember changes take a little time to fully propagate.

## Want to go deeper?

Switch to **Expert** mode above for the full record type list and using `dig` to verify DNS.
