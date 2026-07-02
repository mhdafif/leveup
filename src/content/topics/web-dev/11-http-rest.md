---
title: HTTP & REST APIs
order: 11
estMinutes: 30
difficulty: medium
checklist:
  - Name the five primary HTTP methods and describe when to use each
  - Read an HTTP status code and know what category it falls into
  - Explain the key constraints that make an API RESTful
  - Distinguish between a resource URL and an action URL
  - Read and write common HTTP request and response headers
  - Describe the core difference between REST and GraphQL
---

HTTP is the language the web speaks, and REST is the most widely used convention for structuring that conversation between clients and servers. Understanding these deeply — not just copying patterns — lets you design APIs that are predictable, debuggable, and easy for other developers to consume.

## HTTP Methods (Verbs)

Each HTTP method signals the intended operation on a resource:

| Method | Idempotent? | Safe? | Use for |
|--------|------------|-------|---------|
| `GET` | Yes | Yes | Read a resource or collection |
| `POST` | No | No | Create a new resource |
| `PUT` | Yes | No | Replace a resource entirely |
| `PATCH` | No* | No | Partially update a resource |
| `DELETE` | Yes | No | Remove a resource |

- **Safe**: the request should not modify state (GET, HEAD, OPTIONS).
- **Idempotent**: making the same request multiple times produces the same result as making it once. DELETE is idempotent because deleting an already-deleted resource still leaves it deleted.

```http
GET    /users          → list all users
GET    /users/42       → get user with id 42
POST   /users          → create a new user
PUT    /users/42       → replace user 42 completely
PATCH  /users/42       → update specific fields of user 42
DELETE /users/42       → delete user 42
```

## HTTP Status Codes

Status codes are grouped by their first digit:

| Range | Category | Common examples |
|-------|----------|----------------|
| 1xx | Informational | `100 Continue`, `101 Switching Protocols` |
| 2xx | Success | `200 OK`, `201 Created`, `204 No Content` |
| 3xx | Redirection | `301 Moved Permanently`, `304 Not Modified` |
| 4xx | Client error | `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `422 Unprocessable Entity`, `429 Too Many Requests` |
| 5xx | Server error | `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable` |

Key distinctions:
- `401 Unauthorized` means the client is not authenticated (despite the name — "unauthenticated" would be more accurate).
- `403 Forbidden` means the client is authenticated but lacks permission.
- `404 Not Found` can also be used intentionally to avoid leaking whether a resource exists.

## Common Headers

```http
# Request headers
GET /api/users/42 HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
Accept: application/json
Content-Type: application/json   ← only on POST/PUT/PATCH with a body

# Response headers
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Cache-Control: max-age=300, private
ETag: "a1b2c3d4"
Location: /api/users/42          ← on 201 Created, points to the new resource
X-RateLimit-Remaining: 59
```

## REST Constraints

REST (Representational State Transfer) is an architectural style defined by six constraints:

1. **Client-server separation** — UI and data storage are decoupled; they evolve independently.
2. **Statelessness** — every request contains all information the server needs; no session stored on the server between requests.
3. **Cacheability** — responses declare whether they can be cached.
4. **Uniform interface** — resources are identified by URLs, representations are transferred (JSON/XML), self-descriptive messages, HATEOAS (links in responses).
5. **Layered system** — clients do not know if they are talking to the origin server or a proxy/load balancer.
6. **Code on demand** (optional) — servers can send executable code (JavaScript) to clients.

In practice, "RESTful" usually means: resource-based URLs, correct use of HTTP methods, and stateless communication.

```http
# RESTful URL design
GET  /articles            ← collection
GET  /articles/5          ← single resource
POST /articles/5/publish  ← acceptable: action as sub-resource

# Non-RESTful (RPC-style) — avoid
POST /getArticle
POST /publishArticle
GET  /deleteArticle?id=5  ← GET must never modify state
```

> [!NOTE]
> Pure REST with HATEOAS (links in every response) is rarely implemented fully. What most developers call a "REST API" is technically closer to an HTTP API. That is fine in practice — the important constraints are statelessness, correct HTTP semantics, and resource-based design.

## REST vs GraphQL

| | REST | GraphQL |
|--|------|---------|
| Data fetching | Fixed response shape per endpoint | Client specifies exact fields needed |
| Endpoints | One URL per resource type | Single `/graphql` endpoint |
| Over-fetching | Common (extra fields returned) | Eliminated |
| Under-fetching | Common (multiple requests for related data) | Solved with nested queries |
| Caching | HTTP cache works naturally | More complex (requires persisted queries) |
| Best for | Simple CRUD APIs, public APIs | Complex data graphs, mobile apps with bandwidth constraints |

> [!TIP]
> GraphQL solves real problems, but adds tooling complexity. Start with REST — it is simpler to implement, debug, and cache. Migrate to GraphQL when you have specific pain points that REST cannot solve cleanly.

> [!CAUTION]
> Never use `GET` requests for operations that change server state. Some browsers and intermediaries (proxies, CDNs) cache GET responses aggressively. A `GET /deleteUser?id=5` could be cached and replayed, or blocked entirely.

## Further Learning

Search these terms to go deeper:
- **"REST API design best practices"** — naming conventions, versioning, pagination, and error response shapes
- **"HTTP semantics RFC 9110"** — the authoritative specification for HTTP methods, status codes, and headers
- **"API versioning strategies"** — URL versioning (`/v1/`), header versioning, and their trade-offs
- **"OpenAPI Specification"** — the standard way to document REST APIs with machine-readable schemas
- **"GraphQL vs REST when to choose"** — balanced comparison with real-world use case examples
