---
title: Message Queues
order: 7
estMinutes: 10
difficulty: easy
checklist:
  - Explain producers consumers and brokers
  - Move slow work out of request handlers
  - Design idempotent background jobs
  - Retry failed jobs with backoff
  - Choose when queues are worth the complexity
---

Some tasks are slow — sending an email, resizing an image, generating a report. If you make the user *wait* for these during their request, the app feels sluggish. A **message queue** lets you say "do this later" and immediately respond to the user.

## The idea

Instead of doing the slow work right away, drop a note in a queue describing what needs to happen. A separate worker picks it up and does it whenever it can:

```ts
async function signup(email) {
  const user = await createUser(email)
  await queue.publish({ kind: 'send_welcome_email', userId: user.id })
  return user  // returns immediately — email sends in the background
}
```

The signup request finishes fast; the email goes out a moment later.

## The must-know rule: expect duplicates

Queues sometimes deliver the same job **twice** (better safe than lost). So your job code must handle running twice safely — this is called being **idempotent**:

```ts
async function sendWelcomeEmail(job) {
  const alreadySent = await wasSent(job.userId, 'welcome')
  if (alreadySent) return   // skip if we already did this
  await sendEmail(job.userId)
  await markSent(job.userId, 'welcome')
}
```

> [!WARNING]
> If a job isn't designed to handle running twice, a retry could double-charge a card or send a duplicate email. Always check "have I already done this?" before acting.

## When to use one

Great for: emails, image processing, reports, third-party API calls — anything slow that doesn't need to finish before you respond to the user. Skip it when the caller genuinely needs the result immediately.

## In one sentence

A message queue lets slow work happen in the background instead of blocking the user's request — just make sure your background jobs handle running twice safely (idempotent), since queues can occasionally redeliver a job.

## Want to go deeper?

Switch to **Expert** mode above for retry backoff strategies and dead-letter queues.
