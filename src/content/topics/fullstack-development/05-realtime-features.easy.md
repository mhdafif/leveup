---
title: Realtime Features
order: 5
estMinutes: 12
difficulty: easy
checklist:
  - Compare polling SSE and WebSockets
  - Send events with enough data to update UI
  - Reconnect safely after network loss
  - Authorize realtime channels per user
  - Keep realtime events consistent with database writes
---

Some features need to update the UI *the moment something happens* — a chat message, a live dashboard, a notification. Building these well spans both the frontend and backend working together in real time.

## Picking the right approach

- **Polling** — repeatedly ask "anything new?" Simple, works everywhere, a bit wasteful.
- **Server-Sent Events (SSE)** — server pushes updates to the browser over a simple stream. Great for notifications and dashboards.
- **WebSockets** — a full two-way connection. Best for chat and anything needing instant replies both directions.

```ts
function subscribeToProject(projectId, onMessage) {
  const source = new EventSource(`/api/projects/${projectId}/events`)
  source.onmessage = onMessage
  return () => source.close()
}
```

For most "keep this dashboard updated" features, SSE is simpler than a full WebSocket and does the job well.

## Design small, useful events

Keep each realtime message small but meaningful, so the frontend knows exactly what changed:

```ts
type ProjectEvent =
  | { type: 'task.created', taskId: string, title: string }
  | { type: 'task.completed', taskId: string }
```

## The database is still the source of truth

> [!NOTE]
> Realtime events don't *replace* your database — always **write to the database first**, then send an event describing what changed. If you send the event before saving, and the save fails, clients see something that never actually happened.

## Always plan for disconnects

> [!TIP]
> Real-world networks drop connections constantly — phones sleep, WiFi hiccups. Any realtime feature needs to detect a dropped connection and reconnect automatically, or users will silently stop getting updates.

## In one sentence

Realtime features push updates instantly using polling (simple), SSE (one-way server push), or WebSockets (two-way) — always write to the database first before sending the event, and always handle reconnecting after a dropped connection.

## Want to go deeper?

Switch to **Expert** mode above for authorizing realtime channels per user and event-ordering consistency.
