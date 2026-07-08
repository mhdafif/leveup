---
title: WebSockets and Realtime
order: 8
estMinutes: 10
difficulty: easy
checklist:
  - Explain persistent connections
  - Compare polling, SSE, and WebSockets
  - Understand connection lifecycle
  - Handle reconnects
  - Know proxy/CDN constraints
---

Normal HTTP is one-and-done: the browser asks, the server answers, the connection closes. But some things need *live* updates — chat messages, notifications, a collaborative doc where you see others typing. For those, you keep a connection **open**.

## Three ways to do "live"

- **Polling** — the browser keeps asking "anything new?" every few seconds. Simple, but wasteful and laggy.
- **Server-Sent Events (SSE)** — the server keeps a one-way stream open to push updates to the browser. Great for feeds and notifications.
- **WebSockets** — a persistent **two-way** connection. Both sides can send messages anytime. Best for chat, live cursors, and games.

## WebSockets in a nutshell

A WebSocket opens once and stays open, so messages fly both directions instantly without the overhead of new requests:

```txt
Browser ⟷ Server  (one open connection, messages both ways)
```

Perfect when the server needs to *push* things to you the moment they happen, not just when you ask.

## The must-do: handle disconnects

> [!TIP]
> Live connections *will* drop — WiFi hiccups, phones sleep, networks change, proxies close idle connections. Any realtime feature must detect a dropped connection and automatically reconnect. Don't assume the connection stays up forever.

## In one sentence

For live updates, keep a connection open: **polling** repeatedly asks (simple but wasteful), **SSE** streams one-way from server to browser, and **WebSockets** give an instant two-way channel — and all realtime code must handle reconnecting when the connection drops.

## Want to go deeper?

Switch to **Expert** mode above for the connection lifecycle, close codes, and running WebSockets behind proxies/CDNs.
