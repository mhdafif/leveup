---
title: Transactions & Error Handling
order: 9
estMinutes: 30
difficulty: hard
checklist:
  - Use Prisma's batch transaction API to run multiple operations atomically
  - Use Prisma's interactive transaction to read then write based on the result
  - Implement a Drizzle transaction with rollback on error
  - Explain the default isolation level and when to change it
  - Identify and avoid a common deadlock pattern in concurrent transactions
---

A transaction groups database operations so they succeed or roll back together. Use transactions when partial success would corrupt business state: transferring balance, creating an order and line items, reserving inventory, or updating related counters.

## Prisma Batch Transactions

Use the batch form when operations are independent and do not need each other's results.

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function deleteUserAndSessions(userId: string) {
  return prisma.$transaction([
    prisma.session.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);
}
```

## Interactive Transactions

Use the interactive form when you must read, decide, then write.

```ts
export async function reserveSeats(showId: string, requested: number) {
  return prisma.$transaction(async (tx) => {
    const show = await tx.show.findUniqueOrThrow({ where: { id: showId } });
    if (show.availableSeats < requested) {
      throw new Error("Not enough seats available.");
    }

    return tx.show.update({
      where: { id: showId },
      data: { availableSeats: show.availableSeats - requested },
    });
  });
}
```

Throwing inside the callback rolls the transaction back.

## Drizzle Transactions And Isolation

```ts
import { db } from "./db";
import { accounts } from "./schema";
import { eq, sql } from "drizzle-orm";

export async function debitAccount(accountId: string, amount: number) {
  return db.transaction(async (tx) => {
    const [account] = await tx.select().from(accounts).where(eq(accounts.id, accountId));
    if (!account || account.balance < amount) throw new Error("Insufficient funds.");

    return tx
      .update(accounts)
      .set({ balance: sql`${accounts.balance} - ${amount}` })
      .where(eq(accounts.id, accountId))
      .returning();
  });
}
```

Most Postgres apps use read committed by default, which prevents dirty reads. Serializable is stricter and useful when concurrent reads and writes must behave as if they ran one at a time, but it can require retry logic. Avoid deadlocks by acquiring locks in the same order in every transaction.

> [!NOTE]
> Use the batch form when operations don't depend on each other's results. Use the interactive form when you need to read a value before writing based on it.

## Further Learning

Search these terms to go deeper:
- **"Prisma batch transaction interactive transaction"** — choosing the right transaction API
- **"Drizzle ORM transaction rollback"** — throw-to-rollback transaction handling
- **"Postgres isolation levels read committed serializable"** — consistency guarantees
- **"database deadlock lock ordering"** — avoiding circular waits in concurrent writes
