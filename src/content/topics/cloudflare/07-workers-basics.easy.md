---
title: Workers Basics
order: 7
estMinutes: 10
difficulty: easy
checklist:
  - Explain edge functions
  - Read a Request and return a Response
  - Route logic by path
  - Understand runtime limits
  - Know when Workers fit better than a traditional server
---

**Cloudflare Workers** let you run a small piece of JavaScript at Cloudflare's edge locations worldwide — close to your users, without managing any server. It's similar in spirit to a serverless function, but it runs even closer to visitors.

## The shape of a Worker

A Worker receives a request and returns a response — that's the whole model:

```ts
export default {
  async fetch(request) {
    const url = new URL(request.url)
    if (url.pathname === '/health') return Response.json({ ok: true })
    return new Response('Not found', { status: 404 })
  }
}
```

## What Workers are great for

Lightweight tasks that benefit from running close to the user: quick API endpoints, redirects, rewriting requests, checking authentication before letting a request through, or personalizing content based on the visitor's location.

## What they're NOT

> [!WARNING]
> A Worker isn't a regular, always-on server like a Node.js app. It has its own runtime with specific APIs and limits (execution time, memory). Don't assume you can just copy-paste your existing backend code into a Worker — check what's supported first.

## In one sentence

Cloudflare Workers run small pieces of JavaScript at the edge (close to users) that receive a request and return a response — great for lightweight tasks like redirects and auth checks, but not a drop-in replacement for a full backend server.

## Want to go deeper?

Switch to **Expert** mode above for runtime limits and the Wrangler CLI for local development.
