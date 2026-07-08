---
title: ORMs and Data Access
order: 8
estMinutes: 10
difficulty: easy
checklist:
  - Explain what an ORM maps between
  - Keep data access behind focused functions
  - Avoid hidden N plus one queries
  - Use migrations to evolve schemas
  - Choose raw SQL when it is clearer
---

Writing raw SQL strings everywhere gets messy fast. An **ORM** (Object-Relational Mapper) lets you work with database rows as regular objects in your code, instead of writing SQL by hand every time:

```ts
async function listOpenTasks(userId) {
  return db.task.findMany({ where: { userId, completedAt: null } })
}
```

Same result as a `SELECT`, but reads like normal code.

## The classic gotcha: N+1 queries

ORMs make it *easy* to accidentally write a slow loop of queries without realizing it:

```ts
// ❌ one query for projects, THEN one more query PER project (slow!)
const projects = await db.project.findMany()
for (const p of projects) {
  p.tasks = await db.task.findMany({ where: { projectId: p.id } })
}
```

If you have 100 projects, that's 101 queries instead of 2. This is called the **N+1 problem** — a very common ORM trap.

> [!NOTE]
> Most ORMs let you "include" related data in the original query instead of looping — always check whether your ORM has a way to fetch related data in one shot before writing a loop like the above.

## Schema changes: use migrations

When you need to change your database's structure (add a column, etc.), write it as a **migration** file that's tracked and repeatable — never manually edit the production database by hand. Migrations let every environment (your laptop, staging, production) apply the exact same change consistently.

## When to skip the ORM

For complex reports or bulk updates, sometimes plain SQL is actually *clearer* than the ORM's version. It's fine to drop down to raw SQL when that's true.

## In one sentence

An ORM lets you query the database using regular code instead of SQL strings — just watch for the N+1 trap (a query-per-item loop), and always change the database schema through tracked migrations, not by hand.

## Want to go deeper?

Switch to **Expert** mode above for the repository pattern and inspecting an ORM's generated SQL.
