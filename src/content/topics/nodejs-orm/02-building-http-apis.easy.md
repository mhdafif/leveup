---
title: Building HTTP APIs in Node
order: 2
estMinutes: 12
difficulty: easy
checklist:
  - Set up a minimal Express or Fastify HTTP server
  - "Implement the middleware chain: parse → validate → auth → handler"
  - Return consistent response shapes across all routes
  - Handle async errors so they reach the error middleware
  - Compare Express and Fastify on speed, schema validation, and TypeScript support
---

Building an API in Node usually means picking a small framework to handle the boring parts (routing, parsing) so you can focus on your actual logic. Two popular choices: **Express** (the classic, huge ecosystem) and **Fastify** (newer, faster, great TypeScript support).

## A minimal server

```ts
import Fastify from 'fastify'
const app = Fastify()

app.get('/health', async () => {
  return { data: { ok: true } }
})

app.get('/users/:id', async (request) => {
  const { id } = request.params
  return { data: { id, name: 'Ada' } }
})

await app.listen({ port: 3000 })
```

That's a working API: define routes, return data.

## The typical pipeline

A real request usually flows through the same steps every time: **parse the input → validate it → check who's making the request → run the actual logic → send a response.** Frameworks call this the "middleware chain" — each step passes the request along to the next.

## Keep response shapes consistent

Pick one shape for success and one for errors, and use it *everywhere*:

```ts
// success
{ data: { id: '1', name: 'Ada' } }

// error
{ error: { code: 'not_found', message: 'User not found' } }
```

This makes the frontend's job much easier — it can write one generic "handle the response" function instead of a different one per endpoint.

## Don't let async errors slip through

> [!TIP]
> If a route handler is `async` and throws, make sure your framework actually catches it and returns an error response (rather than crashing or hanging). Fastify does this by default; in Express, wrap your async handlers or use `try/catch` with `next(error)`.

## In one sentence

Building a Node API means routing requests through parse → validate → auth → handler, always returning a consistent success/error shape — Fastify is a strong modern default, especially for catching async errors automatically.

## Want to go deeper?

Switch to **Expert** mode above for the full middleware chain details and an Express-vs-Fastify comparison.
