---
title: SQL Database Basics
order: 3
estMinutes: 35
difficulty: medium
checklist:
  - Model data with tables and relationships
  - Choose primary keys and foreign keys
  - Write basic SELECT and JOIN queries
  - Use transactions for multi-step writes
  - Enforce integrity with database constraints
---

SQL databases store structured data in tables and let you query it with a declarative language. The database is not just a storage bucket. It enforces relationships, protects consistency, and answers questions efficiently when modeled well.

## Tables and Relationships

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL
);

CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  completed_at TIMESTAMP
);
```

Primary keys identify rows. Foreign keys connect rows and prevent orphaned data. `NOT NULL` and `UNIQUE` constraints move important rules into the database, where every code path must respect them.

## Reading Related Data

```sql
SELECT
  tasks.id,
  tasks.title,
  users.email AS owner_email
FROM tasks
JOIN users ON users.id = tasks.user_id
WHERE tasks.completed_at IS NULL;
```

Joins are one of SQL's core strengths. Instead of duplicating user email into every task row, store it once and join when needed.

## Transactions

Transactions group several database changes into one all-or-nothing operation.

```ts
async function transferCoins(fromUserId: string, toUserId: string, amount: number) {
  await db.transaction(async (tx) => {
    await tx.execute("UPDATE wallets SET coins = coins - ? WHERE user_id = ?", [amount, fromUserId]);
    await tx.execute("UPDATE wallets SET coins = coins + ? WHERE user_id = ?", [amount, toUserId]);
  });
}
```

> [!WARNING]
> Never perform related money, inventory, or entitlement updates as separate independent writes. If one write succeeds and the next fails, your data becomes inconsistent.

## Further Learning

Search these terms to go deeper:
- **"SQL primary key foreign key constraints"** — database integrity fundamentals
- **"SQL joins visual explanation"** — inner, left, and outer joins
- **"database transactions ACID"** — guarantees behind reliable writes
- **"PostgreSQL data modeling basics"** — practical relational schema design
