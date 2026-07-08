---
title: HTTP & REST APIs
order: 11
estMinutes: 18
difficulty: easy
checklist:
  - Name the five primary HTTP methods and describe when to use each
  - Read an HTTP status code and know what category it falls into
  - Explain the key constraints that make an API RESTful
  - Distinguish between a resource URL and an action URL
  - Read and write common HTTP request and response headers
  - Describe the core difference between REST and GraphQL
---

When your app talks to a server, it does so in a shared language called **HTTP**. **REST** is a popular, tidy convention for organizing that conversation. Think of it like ordering at a restaurant: there are standard verbs (order, change, cancel) and standard replies ("here you go," "we're out of that").

## The verbs: HTTP methods

Each request has a "verb" that says what you want to do:

| Method | Means | Example |
|--------|-------|---------|
| `GET` | Read something | `GET /users/42` — get user 42 |
| `POST` | Create something | `POST /users` — add a new user |
| `PUT` | Replace something | `PUT /users/42` — overwrite user 42 |
| `PATCH` | Update part of something | `PATCH /users/42` — change one field |
| `DELETE` | Remove something | `DELETE /users/42` — delete user 42 |

## The replies: status codes

Every response comes with a number. Just remember the first digit:

| Starts with | Means | Example |
|-------|----------|----------------|
| **2** | Success 🎉 | `200 OK`, `201 Created` |
| **3** | Go look elsewhere | `301 Moved`, `304 Not Modified` |
| **4** | *You* made a mistake | `404 Not Found`, `401 Unauthorized` |
| **5** | The *server* broke | `500 Server Error` |

Two easy ones to mix up: `401` means "you're not logged in," and `403` means "you're logged in, but you're not allowed."

## What makes an API "RESTful"?

Mostly two habits:

1. **URLs name things (nouns), not actions.** Good: `/articles/5`. Avoid: `/getArticle?id=5`.
2. **The verb carries the action.** Use `GET` to read, `DELETE` to delete — don't invent `/deleteArticle`.

```
GET  /articles       → the list
GET  /articles/5     → one article
POST /articles       → create one
```

> [!CAUTION]
> Never use `GET` to change or delete data. Browsers and caches assume `GET` is safe and might repeat it — a `GET /deleteUser?id=5` could fire twice or get cached with ugly results.

## Headers (the little labels on a request)

Requests and responses carry extra info in **headers**:

```http
Authorization: Bearer <token>   ← who you are (on the request)
Content-Type: application/json  ← "the body is JSON"
```

## REST vs GraphQL (in brief)

REST gives you one URL per thing, and each returns a fixed shape. **GraphQL** gives you a single URL where *you* ask for exactly the fields you want — handy for complex apps, but with more setup.

> [!TIP]
> Start with REST. It's simpler to build, debug, and cache. Reach for GraphQL later, only if you hit problems REST can't solve cleanly.

## In one sentence

HTTP requests use verbs (`GET`, `POST`, `PUT`, `DELETE`) on noun-based URLs, and responses come back with a status code whose first digit tells you if it worked (2), was your fault (4), or the server's fault (5).

## Want to go deeper?

Switch to **Expert** mode above for idempotency, the full status-code and header lists, the six REST constraints, and a deeper REST-vs-GraphQL comparison.
