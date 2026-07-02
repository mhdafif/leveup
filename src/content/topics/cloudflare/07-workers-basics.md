---
title: Workers Basics
order: 7
estMinutes: 35
difficulty: medium
checklist:
  - Explain edge functions
  - Read a Request and return a Response
  - Route logic by path
  - Understand runtime limits
  - Know when Workers fit better than a traditional server
---

Cloudflare Workers run JavaScript or TypeScript at the edge. A Worker receives a `Request` and returns a `Response` using web-standard APIs.

```ts
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/health") return Response.json({ ok: true });
    return new Response("Not found", { status: 404 });
  },
};
```

Workers are strong for lightweight APIs, redirects, request rewriting, auth gates, and edge personalization.

> [!WARNING]
> Workers are not a normal long-running Node server. Check runtime APIs and limits before moving backend code directly.

## Further Learning

- **"Cloudflare Workers fetch handler"** — request/response basics
- **"Cloudflare Workers limits"** — CPU, memory, and runtime behavior
- **"Wrangler Cloudflare Workers"** — local dev and deploy CLI
