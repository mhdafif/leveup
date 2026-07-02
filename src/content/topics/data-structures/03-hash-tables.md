---
title: Hash Tables
order: 3
estMinutes: 30
difficulty: medium
checklist:
  - Understand hashing and buckets
  - Know how collisions are handled
  - Reason about the load factor
  - Implement a tiny hash map
---

A **hash table** maps keys to values by running each key through a *hash
function* to pick a bucket. Done well, lookups, inserts, and deletes are all
`O(1)` on average.

```ts
function hash(key: string, buckets: number): number {
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) % buckets;
  return h;
}
```

> [!WARNING]
> Two different keys can hash to the same bucket — a **collision**. Every real
> hash table needs a strategy for them (chaining with linked lists, or open
> addressing). Ignore collisions and your map silently loses data.

> [!CAUTION]
> As the **load factor** (entries ÷ buckets) climbs past ~0.7, collisions pile
> up and `O(1)` quietly degrades toward `O(n)`. Production tables resize to keep
> it low.
