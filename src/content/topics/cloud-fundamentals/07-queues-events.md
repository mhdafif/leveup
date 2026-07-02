---
title: Queues and Events
order: 7
estMinutes: 35
difficulty: medium
checklist:
  - Explain async work queues
  - Use retries safely
  - Understand dead-letter queues
  - Design idempotent workers
  - Know when events decouple services
---

Queues let apps move slow or unreliable work out of the request path. A request can enqueue work, then a worker processes it later.

```txt
API request -> queue -> worker -> email provider
```

Retries are useful but dangerous if jobs are not idempotent. A payment job that runs twice can charge twice if not designed carefully.

> [!IMPORTANT]
> Idempotency means running the same job more than once has the same final result as running it once.

## Further Learning

- **"message queue retry dead letter queue"** — queue reliability
- **"idempotent worker design"** — safe retries
- **"event driven architecture basics"** — decoupled systems
