---
title: Realtime Features
order: 5
estMinutes: 35
difficulty: medium
checklist:
  - Compare polling SSE and WebSockets
  - Send events with enough data to update UI
  - Reconnect safely after network loss
  - Authorize realtime channels per user
  - Keep realtime events consistent with database writes
---

Realtime features keep the UI updated without waiting for manual refresh. The right transport depends on direction, frequency, and complexity.

## Choosing a Transport

Polling is simple and works everywhere. Server-sent events stream server-to-client updates over HTTP. WebSockets support two-way communication over a persistent connection.

```ts
function subscribeToProject(projectId: string, onMessage: (event: MessageEvent) => void) {
  const source = new EventSource(`/api/projects/${projectId}/events`);
  source.onmessage = onMessage;
  source.onerror = () => {
    source.close();
  };
  return () => source.close();
}
```

SSE is often enough for notifications, dashboards, and collaborative read updates. WebSockets fit chat, multiplayer, and high-frequency bidirectional interactions.

## Event Shape

```ts
type ProjectEvent =
  | { type: "task.created"; taskId: string; title: string }
  | { type: "task.completed"; taskId: string; completedAt: string };
```

Events should be small but useful. The client can update local state or trigger a refetch based on the event.

> [!NOTE]
> Realtime does not replace persistence. Write to the database first, then publish events that reflect durable state.

> [!TIP]
> Always design reconnect behavior. Mobile networks sleep, tabs suspend, and proxies close idle connections.

## Further Learning

Search these terms to go deeper:
- **"server sent events vs websockets"** — transport trade-offs
- **"WebSocket authentication patterns"** — securing persistent connections
- **"realtime event ordering consistency"** — avoiding stale updates
- **"polling long polling SSE comparison"** — choosing the simplest useful option
