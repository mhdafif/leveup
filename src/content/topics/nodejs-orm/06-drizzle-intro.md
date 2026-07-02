---
title: Introduction to Drizzle ORM
order: 6
estMinutes: 30
difficulty: medium
checklist:
  - Define a table schema using Drizzle's TypeScript table builder
  - Instantiate a Drizzle client with a database adapter
  - Perform basic insert, select, update, and delete operations
  - Explain the key differences between Drizzle and Prisma
  - Choose between Drizzle and Prisma based on project requirements
---

Drizzle is a TypeScript-first ORM and SQL-close query builder. Instead of a separate schema DSL, table definitions live in TypeScript. That makes Drizzle lightweight, friendly to edge runtimes, and comfortable for teams that want generated SQL to stay close to what they would write by hand.

## Table Schema

Drizzle exposes table builders for each database. PostgreSQL projects usually use `pgTable`; SQLite projects use `sqliteTable`.

```ts
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

Because the schema is TypeScript, inferred insert and select types stay close to the table declaration.

## Client Setup And CRUD

```ts
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users } from "./schema";

const client = postgres(process.env.DATABASE_URL ?? "");
export const db = drizzle(client);

export async function createAndReadUser(email: string) {
  const [created] = await db.insert(users).values({ email }).returning();
  if (!created) throw new Error("User was not created.");

  return db.select().from(users).where(eq(users.id, created.id));
}
```

The query builder is explicit: `select`, `insert`, `update`, and `delete` map closely to SQL operations.

## Drizzle Versus Prisma

Prisma has a larger ecosystem, a polished migration workflow, and an ergonomic generated client. Drizzle is lighter, SQL-close, and often easier to use in serverless or edge constraints. Choose Prisma when the team values ORM productivity and relation ergonomics. Choose Drizzle when the team values SQL control, small runtime footprint, and TypeScript-native schema definitions.

> [!NOTE]
> Drizzle's relations API is optional and separate from the core query builder — you can use joins directly without defining relations.

## Further Learning

Search these terms to go deeper:
- **"Drizzle ORM pgTable TypeScript"** — defining PostgreSQL schemas in code
- **"Drizzle postgres-js adapter"** — connecting Drizzle to PostgreSQL
- **"Drizzle vs Prisma comparison"** — trade-offs between SQL-close and generated-client ORMs
- **"Drizzle ORM edge runtime"** — using lightweight database access in constrained environments
