---
title: Server Fundamentals
order: 1
estMinutes: 25
difficulty: easy
checklist:
  - Explain the request and response lifecycle
  - Route incoming HTTP requests to handlers
  - Validate request input before using it
  - Separate transport code from domain logic
  - Return consistent response shapes
---

A backend server is a long-running process that listens for network requests, runs application code, and sends responses. The core loop is simple: parse the request, choose a route, run a handler, produce a response. Production quality comes from making each step explicit and predictable.

## The Request Lifecycle

Most web servers follow the same flow:

1. Accept an HTTP request from a client.
2. Match the method and path to a route.
3. Parse path params, query params, headers, and body.
4. Validate input.
5. Call domain or data access code.
6. Serialize the response.

```ts
type RequestContext = {
  method: "GET" | "POST";
  path: string;
  body?: unknown;
};

type HttpResponse<T> = {
  status: number;
  body: T;
};

function route(req: RequestContext): HttpResponse<{ message: string }> {
  if (req.method === "GET" && req.path === "/health") {
    return { status: 200, body: { message: "ok" } };
  }

  return { status: 404, body: { message: "Not found" } };
}
```

## Keep Handlers Thin

A route handler should translate HTTP concerns into application calls. It should not contain every business rule, database query, and response format in one function.

```ts
type CreateUserInput = { email: string; name: string };

function createUser(input: CreateUserInput) {
  return {
    id: crypto.randomUUID(),
    email: input.email.toLowerCase(),
    name: input.name.trim(),
  };
}
```

> [!TIP]
> Treat handlers as adapters. They adapt HTTP into your application's internal language and adapt results back into HTTP responses.

## Failure Paths Matter

Every server path needs a clear answer for invalid input, missing resources, permission failures, and unexpected exceptions. Consistent responses make client code easier to write and support teams easier to help.

> [!WARNING]
> Do not trust client input just because it came from your own frontend. Browsers, scripts, and API clients can send any payload they want.

## Further Learning

Search these terms to go deeper:
- **"HTTP request lifecycle backend"** — how servers receive, route, and respond to requests
- **"thin controllers service layer pattern"** — keeping route handlers small
- **"Node.js event loop server requests"** — how JavaScript servers handle concurrent work
- **"backend input validation patterns"** — validating unknown request data
