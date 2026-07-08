---
title: Connection Pooling & Performance
order: 8
estMinutes: 12
difficulty: easy
checklist:
  - Explain why opening a new database connection per request is expensive
  - Configure pool min and max sizes for a Node.js server
  - Recognize symptoms of pool exhaustion in logs and metrics
  - Use PgBouncer for connection pooling in a serverless environment
  - Configure Prisma's connection_limit and pool_timeout in the connection URL
---

Opening a new database connection isn't free — it takes real time (a handshake, authentication, memory setup). If you opened a fresh connection for *every single request*, your app would slow to a crawl. A **connection pool** solves this by keeping a set of connections open and reusing them.

## How a pool works

Think of it like a small fleet of taxis waiting outside a building. A request "checks out" a connection, uses it, and returns it to the pool when done — rather than everyone hailing a brand-new taxi from scratch each time.

```ts
{ min: 1, max: 10, idleTimeoutMs: 30_000 }
```

Too **few** connections and requests queue up waiting for a free one. Too **many** and you overload the database itself. Start conservative and tune based on real traffic.

## Signs your pool is too small

If you see requests getting slower under load, or errors like "too many clients," that's often **pool exhaustion** — every connection is busy, and new requests are stuck waiting in line.

## The serverless trap

> [!WARNING]
> Serverless functions can spin up *many* instances at once, and if each one opens its own full connection pool, you can blow past your database's connection limit almost instantly. In serverless setups, use an external pooler (like PgBouncer) or a managed option (like Prisma Accelerate) that sits between your functions and the database.

## In one sentence

A connection pool reuses a limited set of open database connections instead of creating a new one per request — size it carefully (not too big, not too small), and in serverless environments, use an external pooler to avoid exhausting your database's connection limit.

## Want to go deeper?

Switch to **Expert** mode above for pool sizing formulas and Prisma's `connection_limit`/`pool_timeout` settings.
