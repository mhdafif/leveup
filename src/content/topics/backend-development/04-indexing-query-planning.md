---
title: Indexing and Query Planning
order: 4
estMinutes: 30
difficulty: medium
checklist:
  - Explain why indexes speed up reads
  - Identify columns that benefit from indexes
  - Read a simple query plan
  - Avoid indexes that slow down writes without value
  - Design composite indexes for common filters
---

An index is a data structure the database maintains so it can find rows without scanning an entire table. Indexes make reads faster, but they are not free. Every insert, update, and delete must also update the relevant indexes.

## When an Index Helps

Indexes are useful for columns used in `WHERE`, `JOIN`, `ORDER BY`, and uniqueness checks.

```sql
CREATE INDEX tasks_user_status_idx
ON tasks (user_id, status);

SELECT *
FROM tasks
WHERE user_id = 'u_123' AND status = 'open';
```

The column order matters in composite indexes. An index on `(user_id, status)` helps queries filtering by `user_id`, or by both `user_id` and `status`. It does not help much for a query filtering only by `status`.

## Query Plans

Most databases can explain how they plan to run a query.

```sql
EXPLAIN ANALYZE
SELECT * FROM tasks WHERE user_id = 'u_123' AND status = 'open';
```

Look for whether the database uses an index scan or falls back to a sequential scan. A sequential scan is not always bad for small tables, but it becomes expensive as data grows.

> [!NOTE]
> Query performance is about the actual data shape. A query that is fast with 200 rows can be painfully slow with 20 million rows.

## Avoid Index Sprawl

Each index consumes storage and slows writes. Add indexes for real access patterns, not hypothetical ones.

> [!TIP]
> Start from the slow query, then design the index. Do not start from the table and add indexes to every column that looks important.

## Further Learning

Search these terms to go deeper:
- **"database index explained B tree"** — how common indexes work internally
- **"PostgreSQL EXPLAIN ANALYZE tutorial"** — reading real query plans
- **"composite index column order"** — designing multi-column indexes
- **"index write overhead database"** — trade-offs behind indexing
