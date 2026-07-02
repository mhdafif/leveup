---
title: KV, D1, and Durable Objects
order: 9
estMinutes: 40
difficulty: hard
checklist:
  - Explain KV key-value storage
  - Explain D1 relational storage
  - Explain Durable Objects coordination
  - Pick storage based on consistency needs
  - Avoid using one storage product for every problem
---

Cloudflare has multiple storage products because edge applications need different data shapes.

| Product | Best for |
| --- | --- |
| KV | Global low-latency reads, config, cached data |
| D1 | SQL data and relational queries |
| Durable Objects | Strong coordination for one logical object |

KV is eventually consistent. D1 gives SQLite-style relational storage. Durable Objects are useful for stateful coordination like rooms, counters, queues, and rate-limited resources.

> [!TIP]
> Start from consistency needs. If stale reads break correctness, do not choose KV just because it is convenient.

## Further Learning

- **"Cloudflare KV eventual consistency"** — KV tradeoffs
- **"Cloudflare D1 SQLite"** — relational edge database
- **"Cloudflare Durable Objects"** — coordination model
