---
title: Prisma Migrations
order: 5
estMinutes: 12
difficulty: easy
checklist:
  - Run prisma migrate dev to create and apply a migration locally
  - Inspect a generated migration SQL file before applying it
  - Run prisma migrate deploy in a CI/CD or production environment
  - Handle a destructive schema change without data loss
  - Use prisma db push for rapid prototyping without migration files
---

When your data model changes (new field, renamed column), you need a repeatable way to apply that change to every environment — your laptop, staging, production. A **migration** is a saved, ordered record of exactly what changed, so nothing ever gets out of sync.

## Making a change locally

```bash
prisma migrate dev
```

This looks at your schema, figures out what changed, writes the SQL for it, and applies it to your local database. It saves that SQL as a file you commit to Git — that file *is* your database's version history.

## Applying it in production

```bash
prisma migrate deploy
```

This runs the already-created migrations without asking any questions — perfect for automated deployment pipelines. Use `migrate dev` only locally; use `migrate deploy` in production.

## The tricky part: renaming a column

If you just rename a column, migration tools can sometimes interpret that as "delete the old one, add a new empty one" — which **loses all the data** in it! The safe way is to do it in steps:

1. Add the new column.
2. Copy the data over (backfill).
3. Update your code to use the new column.
4. *Later*, once you're sure it's safe, drop the old column.

> [!WARNING]
> Never rename a column in one migration step without checking what SQL it actually generates — always review the generated SQL before it touches production data.

## For quick prototyping

`prisma db push` skips the migration files entirely and just syncs your schema directly — handy for early experimentation, but skip it for any shared/production database since it leaves no history.

## In one sentence

Migrations are a tracked, ordered history of schema changes — use `migrate dev` locally (commit the generated SQL) and `migrate deploy` in production, and handle risky changes like renames in safe multi-step stages so you never silently lose data.

## Want to go deeper?

Switch to **Expert** mode above for the full safe-rename plan and `db push` trade-offs.
