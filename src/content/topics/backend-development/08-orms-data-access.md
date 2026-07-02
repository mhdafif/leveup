---
title: ORMs and Data Access
order: 8
estMinutes: 30
difficulty: medium
checklist:
  - Explain what an ORM maps between
  - Keep data access behind focused functions
  - Avoid hidden N plus one queries
  - Use migrations to evolve schemas
  - Choose raw SQL when it is clearer
---

An object relational mapper helps application code work with database rows as typed objects. ORMs improve developer experience, but they do not remove the need to understand SQL, transactions, and query performance.

## Repository Style Functions

```ts
type Task = {
  id: string;
  userId: string;
  title: string;
  completedAt: Date | null;
};

async function listOpenTasks(userId: string): Promise<Task[]> {
  return db.task.findMany({
    where: { userId, completedAt: null },
    orderBy: { id: "desc" },
  });
}
```

Focused data access functions make the rest of the app less dependent on ORM details. If the query changes, callers do not need to know.

## N Plus One Queries

An N plus one query happens when code loads a list, then makes one query per item.

```ts
const projects = await db.project.findMany();
for (const project of projects) {
  project.tasks = await db.task.findMany({ where: { projectId: project.id } });
}
```

Prefer eager loading, batching, or a single explicit query.

> [!NOTE]
> ORMs can hide expensive database behavior behind simple property access. Always inspect generated queries when performance matters.

## Migrations

Schema changes should be tracked in migration files and applied consistently across environments. Never manually change production schema without a repeatable migration path.

> [!TIP]
> Use raw SQL for complex reporting, bulk updates, and performance-critical queries when the ORM expression is harder to read than the SQL.

## Further Learning

Search these terms to go deeper:
- **"ORM N plus one query problem"** — recognizing hidden query loops
- **"database migrations best practices"** — evolving schema safely
- **"repository pattern data access"** — isolating persistence details
- **"Prisma generated SQL logging"** — inspecting ORM behavior
