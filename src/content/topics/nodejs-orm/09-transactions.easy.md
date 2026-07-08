---
title: Transactions & Error Handling
order: 9
estMinutes: 12
difficulty: easy
checklist:
  - Use Prisma's batch transaction API to run multiple operations atomically
  - Use Prisma's interactive transaction to read then write based on the result
  - Implement a Drizzle transaction with rollback on error
  - Explain the default isolation level and when to change it
  - Identify and avoid a common deadlock pattern in concurrent transactions
---

Some operations only make sense if *all* their steps succeed together — deleting a user and all their sessions, or transferring money between two accounts. A **transaction** bundles several database changes into one all-or-nothing unit.

## When one step depends on another

Sometimes you need to *read* something first, decide based on it, then write — like checking there are enough seats before booking them:

```ts
await prisma.$transaction(async (tx) => {
  const show = await tx.show.findUniqueOrThrow({ where: { id: showId } })
  if (show.availableSeats < requested) {
    throw new Error('Not enough seats available.')  // this cancels everything
  }
  return tx.show.update({
    where: { id: showId },
    data: { availableSeats: show.availableSeats - requested }
  })
})
```

If you `throw` anywhere inside, **everything in the transaction rolls back** — as if none of it ever happened. That's the safety net: check-then-act without a race condition sneaking in between.

## Simple case: several independent steps

If your steps don't depend on each other's results, you can just list them together:

```ts
await prisma.$transaction([
  prisma.session.deleteMany({ where: { userId } }),
  prisma.user.delete({ where: { id: userId } }),
])
```

Either both succeed, or neither does.

## Avoid a common trap: deadlocks

If two transactions try to grab the same rows in a *different order*, they can end up waiting on each other forever (a deadlock). The fix is simple: always acquire locks/update rows in the **same order** across your codebase.

## In one sentence

A transaction groups multiple database changes into one all-or-nothing unit — throw inside it to roll everything back — use it whenever partial success would leave your data in a broken state (like money transfers or connected deletes).

## Want to go deeper?

Switch to **Expert** mode above for Drizzle transactions, isolation levels, and avoiding deadlocks in detail.
