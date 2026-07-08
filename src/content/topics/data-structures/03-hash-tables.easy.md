---
title: Hash Tables
order: 3
difficulty: easy
estMinutes: 12
checklist:
  - Understand hashing and buckets
  - Know how collisions are handled
  - Reason about the load factor
  - Implement a tiny hash map
---

A **hash table** is a super-fast lookup by name. Instead of searching through everything to find a value, it uses a trick to jump *straight* to where the value lives. In JavaScript you've already used one — it's how objects and `Map` work.

## The trick: hashing

You give the table a **key** (like `"alice"`). A **hash function** turns that key into a number, and that number picks a "bucket" (a slot) to store the value in. Later, the same key hashes to the same number, so it finds the value instantly:

```ts
map.set('alice', 30)
map.get('alice')   // instantly finds 30
```

Because the key always leads straight to its slot, lookups, inserts, and deletes are all **O(1) on average** — no searching required. That's why hash tables are everywhere.

## The catch: collisions

Sometimes two different keys land in the *same* bucket — a **collision**. Real hash tables have a plan for this (usually stacking the entries in that bucket), so no data is lost.

> [!WARNING]
> A hash table that ignores collisions would silently overwrite data. Thankfully, the built-in `Map` and objects handle this for you — you rarely build one by hand.

## Keeping it fast

If a table gets too full, collisions pile up and it slows down. So real tables quietly grow themselves to stay roomy. Again — the built-ins do this automatically.

## When to use one

Anytime you need to look something up *by a key*: counting things, remembering seen items, mapping ids to data. If you catch yourself searching a list over and over for matching items, a hash table (Map/object/Set) is usually the fast fix.

## In one sentence

A hash table turns a key into a slot number so it can jump straight to the value — giving instant (O(1)) lookups by key, which is exactly what JavaScript's `Map`, objects, and `Set` give you.

## Want to go deeper?

Switch to **Expert** mode above for how the hash function works, collision strategies, and the load factor.
