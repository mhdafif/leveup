---
title: Database Migrations
order: 5
estMinutes: 35
difficulty: medium
checklist:
  - Explain schema migration purpose
  - Run migrations before app code needs new schema
  - Design backward-compatible migrations
  - Back up before destructive changes
  - Handle failed migrations
---

Migrations change database schema over time. Safe deploys consider both old and new app versions during rollout.

Safer sequence for a column rename:

1. Add new column.
2. Write to both columns.
3. Backfill data.
4. Read from new column.
5. Drop old column later.

> [!CAUTION]
> Destructive migrations need rollback and backup plans. Dropping data is not like reverting code.

## Further Learning

- **"expand contract database migrations"** — zero-downtime schema changes
- **"Prisma migrations production"** — ORM migration flow
- **"database migration rollback strategy"** — recovery planning
