---
title: Introduction to Prisma
order: 3
estMinutes: 25
difficulty: easy
checklist:
  - Define a data model in schema.prisma with fields and types
  - Run prisma generate to produce a typed client
  - Use PrismaClient to perform basic CRUD operations
  - Retrieve a record by unique field using findUnique
  - Create a record and handle unique-constraint violations
---

Prisma is an ORM built around a schema DSL and a generated TypeScript client. You define models in `schema.prisma`, run generation, and get strongly typed database operations for CRUD, relations, filtering, and transactions.

## Schema Shape

A Prisma schema contains a datasource, a generator, and models. Fields define scalar types, constraints, defaults, and database relationships.

```ts
const prismaSchemaExample = `
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`;
```

After changing the schema, run `prisma generate` so the client types match the models.

## Basic CRUD

```ts
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createUser(email: string, name?: string) {
  try {
    return await prisma.user.create({
      data: { email, name },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("Email is already registered.");
    }
    throw error;
  }
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}
```

Prisma exposes `findUnique`, `findMany`, `create`, `update`, `delete`, and `upsert`. Unique lookups require fields marked `@id` or `@unique`.

## Production Client Lifetime

Create one PrismaClient instance per long-running process. In development with hot reload, use a singleton pattern to avoid creating new clients on every module reload.

> [!NOTE]
> Always instantiate PrismaClient as a singleton in production. Multiple instances exhaust your connection pool.

## Further Learning

Search these terms to go deeper:
- **"Prisma schema model attributes"** — `@id`, `@unique`, defaults, and timestamps
- **"PrismaClient CRUD TypeScript"** — generated client query examples
- **"Prisma P2002 unique constraint"** — handling duplicate writes gracefully
- **"Prisma singleton Next.js hot reload"** — avoiding too many client instances in dev
