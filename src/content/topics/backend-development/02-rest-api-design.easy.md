---
title: REST API Design
order: 2
estMinutes: 12
difficulty: easy
checklist:
  - Model API URLs around resources
  - Use HTTP methods with correct semantics
  - Return status codes that match outcomes
  - Design pagination and filtering for collections
  - Shape errors consistently for clients
  - Version APIs without breaking consumers
---

A well-designed API is predictable — once you learn the pattern for one endpoint, you can guess the rest. **REST** is the most common convention for this: name things (nouns) as URLs, and use HTTP verbs to say what you want to do to them.

## Name things, don't verb things

```http
GET    /api/projects          → list all
POST   /api/projects          → create one
GET    /api/projects/p_123    → get one
PATCH  /api/projects/p_123    → update one
DELETE /api/projects/p_123    → delete one
```

Notice the URL is always a **noun** (`/projects`), and the **HTTP method** carries the action. Avoid URLs like `/getProject` or `/deleteProject` — the verb belongs in the method, not the path.

For actions that aren't simple CRUD, model them as a sub-action:

```http
POST /api/projects/p_123/archive
```

## Consistent errors

Every endpoint should report failures the *same way*, so the frontend can handle them generically:

```ts
{
  error: {
    code: 'project_name_required',
    message: 'Project name is required.'
  }
}
```

Use the right status code for the situation: `400` (bad request), `401` (not logged in), `403` (logged in but not allowed), `404` (doesn't exist), `422` (looks fine but violates a rule).

## Handling long lists

Big collections need paging. Ask for a page and return a "cursor" (a marker) for the next one:

```http
GET /api/tasks?status=open&limit=25&cursor=eyJpZCI6...
```

> [!TIP]
> Have the server give you the "next page" cursor in the response — the client shouldn't have to construct it.

## In one sentence

Design REST APIs around nouns (resources) with HTTP verbs carrying the action, return consistent, structured error shapes, use the right status codes, and support pagination for big lists.

## Want to go deeper?

Switch to **Expert** mode above for cursor vs. offset pagination trade-offs and API versioning strategies.
