---
title: Server Fundamentals
order: 1
estMinutes: 12
difficulty: easy
checklist:
  - Explain the request and response lifecycle
  - Route incoming HTTP requests to handlers
  - Validate request input before using it
  - Separate transport code from domain logic
  - Return consistent response shapes
---

A **backend server** is a program that sits and waits for requests (like a waiter waiting for orders), does some work, and sends back a response. Every server, no matter how fancy, follows the same basic loop.

## The loop

1. A request arrives ("give me user #5").
2. The server figures out which code should handle it (**routing**).
3. It reads the details of the request (path, query, body).
4. It checks the input makes sense (**validation**).
5. It does the actual work (talks to a database, etc).
6. It sends back a response.

```ts
function route(req) {
  if (req.method === 'GET' && req.path === '/health') {
    return { status: 200, body: { message: 'ok' } }
  }
  return { status: 404, body: { message: 'Not found' } }
}
```

## Keep the "web part" separate from the "business part"

A common mistake is cramming everything into one function — parsing the request, validating it, doing the database work, and formatting the reply, all mixed together. Better: keep the HTTP-handling thin, and hand off the real work to plain functions:

```ts
function createUser(input) {
  return { id: crypto.randomUUID(), email: input.email.toLowerCase() }
}
```

Now `createUser` doesn't know or care that it was called from an HTTP request — you could call it from a script, a test, or a queue job too.

## Never trust the input

> [!WARNING]
> Just because your own frontend sent a request doesn't mean it's safe. Anyone can send *any* data directly to your server (skipping the frontend entirely) — always validate on the server, no matter what the client already checked.

## In one sentence

A server's job is always the same loop — receive, route, validate, process, respond — and keeping the "handle the HTTP part" code separate from "do the actual work" code makes it much easier to test and reuse.

## Want to go deeper?

Switch to **Expert** mode above for the full request-context typing and thin-handler patterns.
