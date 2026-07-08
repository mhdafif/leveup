---
title: HTTP and HTTPS Lifecycle
order: 3
estMinutes: 12
difficulty: easy
checklist:
  - Explain request and response structure
  - Read methods, paths, headers, and bodies
  - Understand status codes
  - Explain HTTPS encryption at a high level
  - Debug requests in browser devtools
---

Every time your browser talks to a server, it's a simple back-and-forth: the browser **asks** (a request), the server **answers** (a response). That conversation is **HTTP**.

## A request has four parts

```http
GET /api/profile HTTP/1.1     ← method + path
Host: example.com             ← headers (extra info)
Accept: application/json
```

- **Method** — what you want to do: `GET` (read), `POST` (create), etc.
- **Path** — which resource (`/api/profile`).
- **Headers** — extra details (what format you want, who you are).
- **Body** — data you're sending (only on some requests, like a form).

## The response answers back

The server replies with a **status code** (did it work?), headers, and usually a body (the actual content). Quick guide to status codes by first digit: **2xx** = success, **4xx** = you messed up (like 404 not found), **5xx** = the server messed up.

## The "S" in HTTPS = secure

HTTPS is just HTTP with a lock on it. It **encrypts** the conversation so nobody in between can read it, and it proves the server really is who it claims to be. Always use HTTPS — it's free and expected now.

> [!TIP]
> Open your browser's DevTools → **Network** tab and reload a page. You'll see every request, its status code, timing, and data — it's the fastest way to debug anything network-related.

## In one sentence

HTTP is a request→response conversation (method, path, headers, body → status code, headers, body), and HTTPS is the same thing encrypted so it's private and trustworthy.

## Want to go deeper?

Switch to **Expert** mode above for the full status-code classes and how TLS encryption works.
