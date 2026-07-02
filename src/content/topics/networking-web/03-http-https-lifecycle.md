---
title: HTTP and HTTPS Lifecycle
order: 3
estMinutes: 30
difficulty: easy
checklist:
  - Explain request and response structure
  - Read methods, paths, headers, and bodies
  - Understand status codes
  - Explain HTTPS encryption at a high level
  - Debug requests in browser devtools
---

HTTP is a request-response protocol. The browser sends a method, path, headers, and sometimes a body. The server returns status, headers, and body.

```http
GET /api/profile HTTP/1.1
Host: example.com
Accept: application/json
```

HTTPS is HTTP over TLS. TLS encrypts traffic and proves the server owns a valid certificate for the domain.

> [!TIP]
> Browser Network tab is the fastest place to inspect request headers, response status, timing, and payloads.

## Further Learning

- **"HTTP request response anatomy"** — protocol basics
- **"HTTP status codes 2xx 3xx 4xx 5xx"** — response classes
- **"TLS HTTPS explained"** — secure transport
