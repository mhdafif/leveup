---
title: Drizzle Queries & Joins
order: 7
estMinutes: 12
difficulty: easy
checklist:
  - Write a filtered select query using eq, and, and or helpers
  - Perform an inner join between two tables
  - Use the Drizzle relations API for ORM-style nested queries
  - Insert multiple rows in a single query
  - Update rows matching a filter and return the updated records
---

Drizzle queries read almost like SQL, but with type-safe helper functions instead of writing SQL strings by hand. Once you know the handful of helpers, filtering and joining feel very natural.

## Filtering with helpers

Instead of writing raw `WHERE` clauses, you compose small functions: `eq` (equals), `and`, `or`, and more:

```ts
import { and, eq, or } from 'drizzle-orm'

await db.select().from(users).where(
  and(
    eq(users.active, true),
    or(eq(users.email, search), eq(users.name, search))
  )
)
```

Read it like English: "where active is true, AND (email matches OR name matches)."

## Joining tables

When you need data from two connected tables, join them and pick exactly the columns you want:

```ts
await db
  .select({ postId: posts.id, title: posts.title, authorEmail: users.email })
  .from(posts)
  .innerJoin(users, eq(posts.authorId, users.id))
```

An **inner join** only returns rows that have a match on both sides — a post with no matching author wouldn't show up.

## Updating and getting the result back

```ts
await db
  .update(posts)
  .set({ status: 'published' })
  .where(eq(posts.id, postId))
  .returning()   // gives you back the updated row
```

`.returning()` is handy — you get the updated data immediately, without a second query.

## In one sentence

Drizzle queries chain small, typed helpers (`eq`, `and`, `or`) to build filters, use `.innerJoin()` for connected data, and `.returning()` to get updated rows back in one round trip.

## Want to go deeper?

Switch to **Expert** mode above for batch inserts, left joins, and Drizzle's Prisma-like relations API.
