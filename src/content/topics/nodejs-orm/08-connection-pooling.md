---
title: Connection Pooling & Performance
order: 8
estMinutes: 30
difficulty: hard
checklist:
  - Explain why opening a new database connection per request is expensive
  - Configure pool min and max sizes for a Node.js server
  - Recognize symptoms of pool exhaustion in logs and metrics
  - Use PgBouncer for connection pooling in a serverless environment
  - Configure Prisma's connection_limit and pool_timeout in the connection URL
---

Opening a database connection is expensive. It involves a TCP handshake, TLS negotiation in many deployments, authentication, memory allocation, and server bookkeeping. A connection pool keeps a bounded set of open connections and reuses them across requests.

## Pool Basics

A pool checks out a connection for a query, returns it when the query completes, and queues work when all connections are busy. For long-running Node servers, start with a conservative max such as CPU cores times two plus one, then tune from real metrics.

```ts
type PoolConfig = {
  min: number;
  max: number;
  idleTimeoutMs: number;
};

export function createPoolConfig(cpuCores: number): PoolConfig {
  return {
    min: 1,
    max: cpuCores * 2 + 1,
    idleTimeoutMs: 30_000,
  };
}
```

Too large a pool can overload the database. Too small a pool causes queueing and timeout errors under normal traffic.

## Exhaustion Symptoms

Pool exhaustion often appears as slow requests, rising queue time, `too many clients`, connection timeout errors, or CPU spikes on the database. Instrument pool wait time separately from query execution time so you can tell whether the database is slow or the application is waiting for a connection.

## Serverless Constraints

Serverless functions can scale horizontally fast. If every function instance opens its own Prisma pool, Postgres `max_connections` can be exhausted quickly. PgBouncer, Prisma Accelerate, or platform-native pooling sits between functions and the database to smooth connection spikes.

```ts
export function withPrismaPoolParams(databaseUrl: string): string {
  const url = new URL(databaseUrl);
  url.searchParams.set("connection_limit", "10");
  url.searchParams.set("pool_timeout", "30");
  return url.toString();
}
```

This controls Prisma client-side pool behavior, but it does not replace external pooling for highly elastic workloads.

> [!WARNING]
> Serverless functions running Prisma without PgBouncer will exhaust your Postgres max_connections under load. Use PgBouncer or Prisma Accelerate.

## Further Learning

Search these terms to go deeper:
- **"Postgres connection pooling Node.js"** — pool sizing and queue behavior
- **"PgBouncer serverless Prisma"** — external pooling for elastic compute
- **"Prisma connection_limit pool_timeout"** — tuning Prisma database URLs
- **"database pool exhaustion symptoms"** — logs and metrics that reveal connection pressure
