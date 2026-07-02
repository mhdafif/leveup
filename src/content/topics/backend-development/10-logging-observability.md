---
title: Logging and Observability
order: 10
estMinutes: 30
difficulty: medium
checklist:
  - Write structured logs with request context
  - Track metrics for latency errors and throughput
  - Use traces to follow work across services
  - Alert on symptoms users would notice
  - Avoid logging secrets and personal data
---

Observability is how you understand a production system from the outside. Logs, metrics, and traces answer different questions. Together, they help you find failures, measure impact, and confirm fixes.

## Structured Logs

Structured logs are machine-readable objects, not only strings.

```ts
type LogEvent = {
  level: "info" | "warn" | "error";
  message: string;
  requestId: string;
  userId?: string;
  route?: string;
};

function log(event: LogEvent) {
  console.log(JSON.stringify(event));
}
```

Include request ids so one user action can be followed across handlers, workers, and downstream services.

## Metrics and Traces

Metrics answer aggregate questions:

- How many requests are failing?
- How slow is the checkout endpoint?
- How many jobs are waiting in the queue?

Traces answer path questions:

- Which service made the request slow?
- Did the database call or third-party API call dominate latency?

> [!NOTE]
> Alerts should fire on user-impacting symptoms, not every internal detail. A high error rate on login matters more than a single retryable job failure.

## Safe Logging

Never log passwords, session tokens, API keys, full payment data, or sensitive personal information. Redact aggressively at logging boundaries.

> [!TIP]
> Add request ids early in the stack. Every later log line becomes more useful when it carries the same correlation id.

## Further Learning

Search these terms to go deeper:
- **"structured logging best practices"** — searchable production logs
- **"RED metrics rate errors duration"** — service health metrics
- **"distributed tracing explained"** — following requests across services
- **"OpenTelemetry backend observability"** — common observability standard
