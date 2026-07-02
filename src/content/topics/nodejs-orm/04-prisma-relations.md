---
title: Prisma Relations & Queries
order: 4
estMinutes: 30
difficulty: medium
checklist:
  - Define one-to-many and many-to-many relations in schema.prisma
  - Use include to fetch related records in one query
  - Use select to return only specific fields
  - Perform a nested create to create a parent and child in one operation
  - Use connect to link an existing record in a relation
---

Prisma relations model how records connect: users own posts, posts have tags, profiles belong to users. Relation fields make those connections type-safe in reads and writes, but you still need to control payload size and query shape.

## Relation Definitions

One-to-many relations use a foreign key on the child model. Many-to-many can be implicit for simple join tables or explicit when the join itself has fields.

```ts
const schema = `
model User {
  id    String @id @default(cuid())
  email String @unique
  posts Post[]
}

model Post {
  id       String @id @default(cuid())
  title    String
  authorId String
  author   User   @relation(fields: [authorId], references: [id])
}
`;
```

## Include And Select

Use `include` to eager-load relations. Use `select` to return only fields the client needs.

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      posts: {
        select: { id: true, title: true },
        take: 10,
      },
    },
  });
}
```

Projection keeps API responses smaller and makes accidental data exposure less likely.

## Nested Writes

Nested writes let you create or connect related records in one operation.

```ts
export async function createPostForUser(userId: string, title: string) {
  return prisma.post.create({
    data: {
      title,
      author: {
        connect: { id: userId },
      },
    },
  });
}
```

Use `connect` for existing records, `create` for new child records, and relation filters such as `some`, `every`, and `none` when querying based on related rows.

> [!WARNING]
> Avoid deeply nested include chains — they can generate N+1-style queries. Use select with explicit fields to keep response size predictable.

## Further Learning

Search these terms to go deeper:
- **"Prisma one to many relation"** — schema structure for foreign-key relationships
- **"Prisma include vs select"** — eager loading compared with field projection
- **"Prisma nested create connect"** — relation writes in a single operation
- **"Prisma relation filters some every none"** — filtering records by related data
