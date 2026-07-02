---
title: Message Queues
order: 7
estMinutes: 30
difficulty: medium
checklist:
  - Explain producers consumers and brokers
  - Move slow work out of request handlers
  - Design idempotent background jobs
  - Retry failed jobs with backoff
  - Choose when queues are worth the complexity
---

Message queues let one part of a system publish work for another part to process later. They are useful when work is slow, unreliable, or does not need to block the user's request.

## Producers and Consumers

```ts
type EmailJob = {
  kind: "send_welcome_email";
  userId: string;
};

async function signup(email: string) {
  const user = await users.create({ email });
  await queue.publish<EmailJob>({ kind: "send_welcome_email", userId: user.id });
  return user;
}
```

The signup request can return quickly. A worker process consumes the job and sends the email separately.

## Idempotent Jobs

Queues usually provide at-least-once delivery, which means a job may run more than once. Job handlers must tolerate duplicates.

```ts
async function sendWelcomeEmail(job: EmailJob) {
  const alreadySent = await emails.wasSent(job.userId, "welcome");
  if (alreadySent) return;

  await emailProvider.sendWelcome(job.userId);
  await emails.markSent(job.userId, "welcome");
}
```

> [!WARNING]
> Retrying a non-idempotent job can double-charge a card, send duplicate notifications, or create repeated records.

## When to Use a Queue

Use queues for emails, image processing, imports, reports, webhooks, and third-party API calls. Avoid queues when the caller needs the result immediately or when the added operational complexity is not justified.

> [!TIP]
> Start with one queue and a small worker. Add routing, priorities, and dead-letter queues once real operational needs appear.

## Further Learning

Search these terms to go deeper:
- **"message queue producer consumer pattern"** — the core model
- **"idempotent background jobs"** — safe retries and duplicate handling
- **"dead letter queue explained"** — managing permanently failing jobs
- **"RabbitMQ vs SQS vs Redis queue"** — common queue choices
