---
title: Building HTTP APIs in Node
order: 2
estMinutes: 30
difficulty: medium
checklist:
  - Set up a minimal Express or Fastify HTTP server
  - "Implement the middleware chain: parse → validate → auth → handler"
  - Return consistent response shapes across all routes
  - Handle async errors so they reach the error middleware
  - Compare Express and Fastify on speed, schema validation, and TypeScript support
---

Node HTTP APIs are mostly composition: parse input, validate it, authenticate the caller, delegate to a service, then return a consistent response. Express gives you a huge ecosystem and familiar middleware. Fastify gives you strong schema support, good TypeScript ergonomics, and high throughput.

## Minimal Fastify Server

Fastify is a strong default for new TypeScript services because request and response schemas are first-class.

```ts
import Fastify from "fastify";

const app = Fastify({ logger: true });

app.get("/health", async () => {
  return { data: { ok: true } };
});

app.get("/users/:id", async (request) => {
  const { id } = request.params as { id: string };
  return { data: { id, name: "Ada" } };
});

await app.listen({ port: 3000, host: "0.0.0.0" });
```

Express remains a practical choice when a team has existing middleware, legacy routes, or a migration path that must be incremental.

## Middleware Chain

A production route usually follows the same pipeline: body parser, validation, authentication, authorization, handler, and error middleware. Keep route handlers thin. They should translate HTTP details into service calls, not contain business logic.

```ts
type ApiError = {
  error: {
    code: string;
    message: string;
  };
};

export function toErrorResponse(code: string, message: string): ApiError {
  return { error: { code, message } };
}
```

Return a predictable shape for success and failure. Clients become simpler when every route returns `{ data }` for success and `{ error: { code, message } }` for failure.

## Async Errors

Unhandled async errors can bypass normal middleware if the framework does not capture rejected promises. Fastify handles async route rejection by default. In Express, use Express 5, an async wrapper, or `next(error)` inside `try/catch`.

> [!TIP]
> For new TypeScript projects, prefer Fastify. For migrating existing Express apps, add TypeScript incrementally.

## Further Learning

Search these terms to go deeper:
- **"Fastify schema validation TypeScript"** — typed request and response contracts
- **"Express async error handling"** — forwarding rejected promises to error middleware
- **"REST API response envelope"** — consistent success and error shapes
- **"thin controller service pattern Node"** — keeping HTTP handlers focused
