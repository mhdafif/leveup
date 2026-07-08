---
title: KV, D1, and Durable Objects
order: 9
estMinutes: 12
difficulty: easy
checklist:
  - Explain KV key-value storage
  - Explain D1 relational storage
  - Explain Durable Objects coordination
  - Pick storage based on consistency needs
  - Avoid using one storage product for every problem
---

Cloudflare offers a few different storage options because different apps need data stored in different shapes. Picking the right one saves a lot of headache later.

## Three options, three jobs

| Product | Best for |
|---|---|
| **KV** | Fast reads worldwide — config, cached values |
| **D1** | Real relational data (like a normal SQL database) |
| **Durable Objects** | Coordinating one specific thing precisely — a chat room, a counter, a rate limiter |

## KV: fast, but not instantly consistent

KV is built for reading the same value quickly from anywhere in the world — great for things like feature flags or cached config. The catch: it's **eventually consistent** — if you write a new value, it might take a moment to show up everywhere. Fine for config; not fine for something that needs to be exactly right the instant it changes.

## D1: a real database

If you need actual relational data — tables, rows, `SELECT`/`JOIN` queries — **D1** is Cloudflare's SQL database, built on SQLite. Use it exactly like you'd use any other SQL database.

## Durable Objects: exact coordination

Some things need to be handled by exactly one "instance" at a time — like counting votes precisely, or managing one chat room's state. **Durable Objects** give you that guarantee, which KV and D1 don't.

> [!TIP]
> Start from what your data actually needs (does it need to be instantly correct, or is "eventually correct" fine?) — don't just pick KV because it's the easiest to set up.

## In one sentence

Cloudflare offers KV (fast but eventually-consistent, good for config), D1 (a real SQL database), and Durable Objects (precise coordination for one thing at a time) — pick based on how strict your data's correctness needs to be, not convenience.

## Want to go deeper?

Switch to **Expert** mode above for the consistency model details of each.
