---
title: Prisma Relations & Queries
order: 4
estMinutes: 12
difficulty: easy
checklist:
  - Define one-to-many and many-to-many relations in schema.prisma
  - Use include to fetch related records in one query
  - Use select to return only specific fields
  - Perform a nested create to create a parent and child in one operation
  - Use connect to link an existing record in a relation
---

Real data is connected — a user has posts, a post has tags. Prisma **relations** let you describe those connections once and then fetch related data together, in a type-safe way.

## Describing a connection

```
model User {
  id    String @id @default(cuid())
  posts Post[]           // one user has many posts
}

model Post {
  id       String @id @default(cuid())
  authorId String
  author   User   @relation(fields: [authorId], references: [id])
}
```

## Fetching related data together

Use `include` to grab related records in the same query — no separate lookups needed:

```ts
await prisma.user.findUnique({
  where: { id: userId },
  include: { posts: true }   // get the user AND their posts, one query
})
```

Or use `select` to only grab specific fields (keeps responses smaller and avoids accidentally leaking data you didn't mean to send):

```ts
await prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, email: true, posts: { select: { title: true } } }
})
```

## Creating connected records at once

You can create a new record *and* link it to an existing one, in a single call:

```ts
await prisma.post.create({
  data: {
    title: 'Hello world',
    author: { connect: { id: userId } }   // link to the existing user
  }
})
```

`connect` links to something that already exists; `create` (nested) makes a brand-new related record at the same time.

> [!WARNING]
> Be careful with deeply nested `include`s — pulling in relations of relations of relations can quietly turn into a slow query. Use `select` to keep the shape (and size) predictable.

## In one sentence

Prisma relations connect models (like a user to their posts) — use `include` to fetch related data in one query, `select` to grab only the fields you need, and `connect`/nested `create` to link or create related records in a single write.

## Want to go deeper?

Switch to **Expert** mode above for many-to-many relations and relation filters (`some`, `every`, `none`).
