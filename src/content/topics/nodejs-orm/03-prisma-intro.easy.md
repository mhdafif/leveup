---
title: Introduction to Prisma
order: 3
estMinutes: 12
difficulty: easy
checklist:
  - Define a data model in schema.prisma with fields and types
  - Run prisma generate to produce a typed client
  - Use PrismaClient to perform basic CRUD operations
  - Retrieve a record by unique field using findUnique
  - Create a record and handle unique-constraint violations
---

**Prisma** is a popular tool that lets you talk to your database using regular, type-safe JavaScript/TypeScript instead of writing raw SQL. You describe your data once, and Prisma generates a client that knows exactly what fields and types you have.

## Describe your data once

You write your models in a schema file, in a simple format:

```
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}
```

After changing this file, run `prisma generate` — it builds a fully-typed client matching your schema exactly (autocomplete and all).

## Basic operations (CRUD)

```ts
const prisma = new PrismaClient()

// create
await prisma.user.create({ data: { email: 'alice@example.com' } })

// find one
await prisma.user.findUnique({ where: { email: 'alice@example.com' } })

// find many
await prisma.user.findMany()

// update
await prisma.user.update({ where: { id }, data: { name: 'Alice' } })
```

Your editor autocompletes every field, and TypeScript catches typos before you even run the code.

## Handling duplicate errors

If you try to create a user with an email that's already taken (marked `@unique`), Prisma throws a specific error you can catch and turn into a friendly message:

```ts
try {
  await prisma.user.create({ data: { email } })
} catch (error) {
  if (error.code === 'P2002') throw new Error('Email is already registered.')
  throw error
}
```

> [!NOTE]
> Create only **one** `PrismaClient` per running app (a singleton). Creating many instances can exhaust your database's connection limit.

## In one sentence

Prisma lets you define your data model once and get a fully-typed client for reading and writing — use `findUnique`/`findMany`/`create`/`update`, catch the `P2002` error code for duplicate values, and keep just one `PrismaClient` instance running.

## Want to go deeper?

Switch to **Expert** mode above for the full schema attributes and production client-lifetime patterns.
