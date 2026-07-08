---
title: Indexing and Query Planning
order: 4
estMinutes: 10
difficulty: easy
checklist:
  - Explain why indexes speed up reads
  - Identify columns that benefit from indexes
  - Read a simple query plan
  - Avoid indexes that slow down writes without value
  - Design composite indexes for common filters
---

Imagine looking up a word in a book with no index — you'd have to read every page. A database **index** is exactly like a book's index: a shortcut that lets the database jump straight to the rows you want, instead of scanning the whole table.

## When an index helps

Add an index on columns you frequently **search by, filter by, or sort by**:

```sql
CREATE INDEX tasks_user_idx ON tasks (user_id);

SELECT * FROM tasks WHERE user_id = 'u_123';
```

Without the index, the database checks every row. With it, the database jumps straight there.

## Indexes aren't free

Every index speeds up *reads* but slows down *writes* a little — because every insert/update also has to update the index. So don't add indexes "just in case"; add them for columns you actually query often.

> [!TIP]
> Start from a slow query you actually have, then add an index for it — don't guess ahead of time and index everything.

## Checking what the database is doing

Most databases can show you *how* they plan to run a query:

```sql
EXPLAIN ANALYZE SELECT * FROM tasks WHERE user_id = 'u_123';
```

This tells you whether it used your index (fast) or scanned the whole table (slow on big tables). It's the go-to tool when a query feels sluggish.

## In one sentence

An index is a shortcut that lets the database find rows without scanning the whole table — add one for columns you filter/sort by often, but don't over-index, since each one costs a little on every write.

## Want to go deeper?

Switch to **Expert** mode above for composite index column ordering and reading full query plans.
