---
title: Logging and Observability
order: 10
estMinutes: 10
difficulty: easy
checklist:
  - Write structured logs with request context
  - Track metrics for latency errors and throughput
  - Use traces to follow work across services
  - Alert on symptoms users would notice
  - Avoid logging secrets and personal data
---

Once your app is live, you can't just watch it run — you need it to tell you what's happening. **Observability** is the umbrella term for logs, metrics, and alerts that let you understand a running system from the outside.

## Log as structured data, not just text

Instead of a plain sentence, log an object with useful fields you can search and filter later:

```ts
function log(event) {
  console.log(JSON.stringify(event))
}

log({ level: 'error', message: 'Payment failed', requestId: 'abc123', userId: 'u_42' })
```

> [!TIP]
> Give every request a unique **request id**, and include it in every log line for that request. Later, you can pull every log related to one specific user action, even across different services.

## Track the big-picture numbers (metrics)

Metrics answer questions like "how many requests are failing right now?" or "how slow is checkout?" — aggregated numbers over time, not individual log lines.

## Alert on what users actually feel

> [!NOTE]
> Alerts should fire for things users would notice — like a spike in failed logins — not for every tiny internal hiccup. Too many noisy alerts and people start ignoring all of them.

## Never log secrets

> [!WARNING]
> Never write passwords, session tokens, API keys, or full payment details into logs. If in doubt, redact it before logging.

## In one sentence

Observability means logging structured, searchable events (with a shared request id), tracking aggregate metrics for the big picture, alerting only on user-facing problems, and never logging secrets or sensitive data.

## Want to go deeper?

Switch to **Expert** mode above for distributed tracing and the RED metrics framework (rate, errors, duration).
