---
title: Drizzle Queries & Joins
order: 7
estMinutes: 30
difficulty: medium
checklist:
  - Write a filtered select query using eq, and, and or helpers
  - Perform an inner join between two tables
  - Use the Drizzle relations API for ORM-style nested queries
  - Insert multiple rows in a single query
  - Update rows matching a filter and return the updated records
---

Drizzle queries are intentionally close to SQL while staying typed. You compose selects, filters, joins, inserts, updates, and deletes through builder methods. The result is readable for SQL-minded engineers and safer than string-building queries by hand.

## Filters

Filter helpers such as `eq`, `ne`, `gt`, `lt`, `and`, `or`, `like`, and `inArray` represent SQL predicates.

```ts
import { and, eq, or } from "drizzle-orm";
import { db } from "./db";
import { posts, users } from "./schema";

export async function findActiveUsers(search: string) {
  return db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(
      and(
        eq(users.active, true),
        or(eq(users.email, search), eq(users.name, search)),
      ),
    );
}
```

## Joins

Use joins when you need precise control over returned columns.

```ts
export async function listPostsWithAuthors() {
  return db
    .select({
      postId: posts.id,
      title: posts.title,
      authorEmail: users.email,
    })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id));
}
```

An inner join returns only rows with matches on both sides. A left join keeps rows from the left table even when the relation is missing.

## Writes

Batch inserts and returning updates keep round trips low.

```ts
export async function publishPosts(ids: string[]) {
  return db
    .update(posts)
    .set({ status: "published" })
    .where(or(...ids.map((id) => eq(posts.id, id))))
    .returning({ id: posts.id, status: posts.status });
}
```

The relations API gives Prisma-like nested reads through `db.query.users.findMany({ with: { posts: true } })`. Use it for ergonomic product code; use joins when payload shape or performance needs tighter control.

> [!TIP]
> Use the relations API when you want ergonomic nested fetches. Use raw joins when you need fine-grained control over what columns are returned.

## Further Learning

Search these terms to go deeper:
- **"Drizzle select where eq and or"** — typed predicate composition
- **"Drizzle innerJoin leftJoin"** — joining tables with explicit projections
- **"Drizzle relations API with posts"** — nested ORM-style reads
- **"Drizzle update returning"** — updating rows and receiving changed records
