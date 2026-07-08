---
title: SQL Database Basics
order: 3
estMinutes: 12
difficulty: easy
checklist:
  - Model data with tables and relationships
  - Choose primary keys and foreign keys
  - Write basic SELECT and JOIN queries
  - Use transactions for multi-step writes
  - Enforce integrity with database constraints
---

A **SQL database** stores your data in **tables** — like a set of connected spreadsheets — and lets you ask questions about it with a special language (SQL). It's not just a storage bin; it actively enforces rules and connects related data for you.

## Tables and connecting them

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE
);

CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  title TEXT NOT NULL
);
```

- The **primary key** uniquely identifies each row (like a row ID).
- A **foreign key** (`user_id REFERENCES users(id)`) connects a task to its owner, and stops you from ever pointing to a user that doesn't exist.

## Reading connected data with JOIN

Instead of copying a user's email into every one of their tasks, store it once and combine tables when you need it:

```sql
SELECT tasks.title, users.email
FROM tasks
JOIN users ON users.id = tasks.user_id
```

This is one of SQL's superpowers — pulling related data together in one query.

## Transactions: all-or-nothing

Some operations need multiple writes to happen *together*, or not at all. Say you're transferring coins between two users — you never want money to leave one account without arriving in the other:

```ts
await db.transaction(async (tx) => {
  await tx.execute('UPDATE wallets SET coins = coins - ? WHERE user_id = ?', [amount, fromId])
  await tx.execute('UPDATE wallets SET coins = coins + ? WHERE user_id = ?', [amount, toId])
})
```

> [!WARNING]
> Never do related money, inventory, or important updates as separate writes. If the first succeeds and the second fails, your data is now wrong. Wrap them in one transaction so they succeed or fail *together*.

## In one sentence

SQL databases store data in connected tables (linked by primary/foreign keys), let you combine related data with `JOIN`, and wrap multi-step writes in a **transaction** so they either all succeed or all roll back.

## Want to go deeper?

Switch to **Expert** mode above for constraints, more join types, and ACID transaction guarantees.
