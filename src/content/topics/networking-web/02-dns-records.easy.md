---
title: DNS Records
order: 2
estMinutes: 12
difficulty: easy
checklist:
  - Explain DNS resolution
  - Use A, AAAA, CNAME, MX, and TXT records
  - Understand TTL
  - Debug DNS with lookup tools
  - Avoid common CNAME mistakes
---

**DNS** is the internet's contacts app. You type a name (`example.com`), and DNS looks up the actual address to connect to. Behind a domain is a little list of **records** that tell the internet where different things live.

## The records you'll actually use

- **A record** — points a name to an IP address (`example.com → 142.250.80.46`).
- **CNAME** — points a name to *another name* (an alias, e.g. `www.example.com → example.com`).
- **MX** — where email for the domain goes.
- **TXT** — free-text notes, often used to prove you own the domain.

For hosting a website, you'll mostly set an **A** record (or a **CNAME** to your host, like Vercel).

## Changes aren't instant

When you change a DNS record, the whole internet doesn't update immediately. Computers cache the old answer for a while — that waiting period is set by the **TTL** (time-to-live).

> [!WARNING]
> After changing DNS, you might still see the old value for minutes or hours until the cache (TTL) expires. This is normal — it's not broken, just propagating.

## One common gotcha

> [!NOTE]
> Your root/apex domain (`example.com` with no `www`) often can't use a plain CNAME — many providers offer a special "ALIAS" or "flattened CNAME" for this. If a CNAME on the bare domain won't save, that's why.

## In one sentence

DNS translates a domain name into an address using records — mainly **A** (name → IP) and **CNAME** (name → another name) — and changes take time to spread because of caching (TTL).

## Want to go deeper?

Switch to **Expert** mode above for `dig` debugging commands and the full record-type details.
