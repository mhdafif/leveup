---
title: Prisma Migrations
order: 5
estMinutes: 25
difficulty: medium
checklist:
  - Run prisma migrate dev to create and apply a migration locally
  - Inspect a generated migration SQL file before applying it
  - Run prisma migrate deploy in a CI/CD or production environment
  - Handle a destructive schema change without data loss
  - Use prisma db push for rapid prototyping without migration files
---

Migrations are the version history of a database schema. Prisma Migrate compares `schema.prisma` to the previous migration state, generates SQL, and applies it in order. Treat generated SQL as code: review it before production sees it.

## Local Development

`prisma migrate dev` creates a migration folder, writes SQL, applies it to the local database, and can rerun seed scripts. The generated migration file should be committed.

```ts
type MigrationCommand = {
  command: string;
  environment: "local" | "ci" | "production";
  purpose: string;
};

export const prismaMigrationCommands: MigrationCommand[] = [
  {
    command: "prisma migrate dev",
    environment: "local",
    purpose: "Create and apply a new migration interactively.",
  },
  {
    command: "prisma migrate deploy",
    environment: "production",
    purpose: "Apply pending committed migrations without prompts.",
  },
];
```

## Deployment

Use `prisma migrate deploy` in CI/CD or release jobs. It applies pending migrations and avoids interactive prompts, which makes it suitable for automated production workflows. Do not run `migrate dev` in production.

## Destructive Changes

Renaming a column can look like drop-and-create to migration tooling. That loses data unless you handle it deliberately. Use a multi-step migration: add the new column, backfill values, deploy code that reads the new column, then drop the old column later.

```ts
type SafeRenamePlan = [
  "add_new_column",
  "backfill_data",
  "deploy_code_using_new_column",
  "drop_old_column",
];

export const safeRenamePlan: SafeRenamePlan = [
  "add_new_column",
  "backfill_data",
  "deploy_code_using_new_column",
  "drop_old_column",
];
```

`prisma db push` is useful for rapid prototypes because it syncs schema without migration files. Avoid it for shared environments where you need reviewable, repeatable history.

> [!TIP]
> Commit all migration files to git. They are the database's version history and must run in order in production.

## Further Learning

Search these terms to go deeper:
- **"Prisma migrate dev workflow"** — local migration generation and seeding
- **"Prisma migrate deploy production"** — applying migrations in CI/CD
- **"zero downtime database migration column rename"** — safe destructive change patterns
- **"Prisma migrate resolve drift"** — repairing migration history mismatches
