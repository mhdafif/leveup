---
title: Introduction to Drizzle ORM
order: 6
estMinutes: 12
difficulty: easy
checklist:
  - Define a table schema using Drizzle's TypeScript table builder
  - Instantiate a Drizzle client with a database adapter
  - Perform basic insert, select, update, and delete operations
  - Explain the key differences between Drizzle and Prisma
  - Choose between Drizzle and Prisma based on project requirements
---

**Drizzle** is another popular way to work with databases in TypeScript — like Prisma, but with a different philosophy: instead of a separate schema file, you define your tables as plain TypeScript, and queries stay very close to real SQL.

## Defining a table (in TypeScript, not a special file)

```ts
import { pgTable, text, uuid } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
})
```

Since it's regular TypeScript, your editor understands it immediately — no separate generation step needed like Prisma.

## Basic operations

```ts
// insert
const [created] = await db.insert(users).values({ email: 'a@b.com' }).returning()

// select
await db.select().from(users).where(eq(users.id, created.id))
```

Notice how close this reads to actual SQL (`select ... from ... where`) — that's intentional. If you already think in SQL, Drizzle feels very natural.

## Drizzle vs. Prisma

| | Prisma | Drizzle |
|---|---|---|
| Style | Its own schema language + generated client | Plain TypeScript, close to SQL |
| Feel | More "magic," polished | More explicit, lighter |
| Great for | Teams wanting productivity & ergonomics | Teams wanting SQL control & small footprint |

> [!NOTE]
> Neither is "better" — they're different philosophies. Prisma optimizes for convenience; Drizzle optimizes for staying close to SQL and being lightweight (which is handy in constrained environments like edge functions).

## In one sentence

Drizzle is a TypeScript-first way to query databases that stays close to real SQL (tables defined in plain TypeScript, no separate generation step) — pick it over Prisma when you want SQL control and a lighter footprint.

## Want to go deeper?

Switch to **Expert** mode above for the full client setup and a deeper Drizzle-vs-Prisma comparison.
