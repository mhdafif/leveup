---
title: Queues and Events
order: 7
estMinutes: 10
difficulty: easy
checklist:
  - Explain async work queues
  - Use retries safely
  - Understand dead-letter queues
  - Design idempotent workers
  - Know when events decouple services
---

Some work is too slow to make a user wait for — sending an email, processing an upload. A **queue** lets you drop that task in a line and have a separate worker handle it in the background, so your API can respond instantly.

```
API request → queue → worker → (e.g. email provider)
```

## The dangerous part: retries

Queues usually retry a job if it fails — which is helpful, but risky if the job *isn't* designed to handle running twice. Imagine a payment job that charges a card, then fails partway through and gets retried: without care, that could charge the customer **twice**.

> [!IMPORTANT]
> A job is **idempotent** if running it twice (or ten times) gives the exact same end result as running it once. Always design background jobs this way — check "did I already do this?" before acting, so a safe retry never causes duplicate side effects.

## When a job keeps failing

If a job fails repeatedly and just won't succeed, most queue systems move it to a **dead-letter queue** — a holding area for "jobs that keep failing" so you can look at them manually, instead of retrying forever and wasting resources.

## In one sentence

Queues move slow work out of the request path so users don't wait — but since queues often retry, every job must be idempotent (safe to run more than once), and persistently-failing jobs should land in a dead-letter queue for manual review.

## Want to go deeper?

Switch to **Expert** mode above for dead-letter queue configuration and event-driven architecture patterns.
