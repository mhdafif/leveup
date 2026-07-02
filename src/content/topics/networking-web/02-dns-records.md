---
title: DNS Records
order: 2
estMinutes: 30
difficulty: easy
checklist:
  - Explain DNS resolution
  - Use A, AAAA, CNAME, MX, and TXT records
  - Understand TTL
  - Debug DNS with lookup tools
  - Avoid common CNAME mistakes
---

DNS turns names into routing information. For web apps, the most common records are `A`, `AAAA`, and `CNAME`.

```bash
dig example.com A
dig www.example.com CNAME
```

`CNAME` aliases one hostname to another. The apex domain often cannot be a raw CNAME, depending on provider behavior.

> [!WARNING]
> DNS changes are not always instant. Resolver caches may keep old values until TTL expires.

## Further Learning

- **"DNS record types A CNAME TXT MX"** — record guide
- **"dig command examples"** — DNS debugging
- **"DNS TTL propagation"** — cache behavior
