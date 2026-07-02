---
title: WebSockets and Realtime
order: 8
estMinutes: 30
difficulty: medium
checklist:
  - Explain persistent connections
  - Compare polling, SSE, and WebSockets
  - Understand connection lifecycle
  - Handle reconnects
  - Know proxy/CDN constraints
---

WebSockets keep a persistent two-way connection between client and server. They fit chat, collaborative presence, live dashboards, and multiplayer-style updates.

Alternatives:

- Polling: simple but inefficient
- Server-Sent Events: server-to-client stream
- WebSockets: bidirectional stream

> [!TIP]
> Realtime code must handle disconnects. Networks change, tabs sleep, and proxies close idle connections.

## Further Learning

- **"WebSocket lifecycle close codes"** — connection behavior
- **"Server-Sent Events vs WebSockets"** — choosing transport
- **"WebSocket reverse proxy nginx"** — proxy setup
