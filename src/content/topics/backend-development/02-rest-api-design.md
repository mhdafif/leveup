---
title: REST API Design
order: 2
estMinutes: 30
difficulty: medium
checklist:
  - Model API URLs around resources
  - Use HTTP methods with correct semantics
  - Return status codes that match outcomes
  - Design pagination and filtering for collections
  - Shape errors consistently for clients
  - Version APIs without breaking consumers
---

REST API design is about predictable contracts. Clients should be able to guess how to list, create, update, and delete resources because your API follows the same vocabulary throughout the product.

## Resource First URLs

Start from nouns, not actions.

```http
GET    /api/projects
POST   /api/projects
GET    /api/projects/p_123
PATCH  /api/projects/p_123
DELETE /api/projects/p_123
```

When an operation is not simple CRUD, model it as a sub-resource or state transition.

```http
POST /api/projects/p_123/archive
POST /api/invoices/i_456/payments
```

## Status Codes and Error Shapes

```ts
type ApiError = {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
};

const invalidProjectName: ApiError = {
  error: {
    code: "project_name_required",
    message: "Project name is required.",
    fields: { name: "Enter a project name." },
  },
};
```

Use `400` for malformed requests, `401` for unauthenticated clients, `403` for authenticated clients without permission, `404` for missing resources, and `422` when the request is syntactically valid but violates domain rules.

> [!NOTE]
> A consistent error shape matters more than a clever one. Frontends can build reusable form and toast behavior when every endpoint reports errors the same way.

## Collections

Large collections need pagination, sorting, and filters that can evolve.

```http
GET /api/tasks?status=open&limit=25&cursor=eyJpZCI6...
```

Cursor pagination is usually better than page numbers for frequently changing data because it is stable when rows are inserted or removed.

> [!TIP]
> Include the next cursor in the response body. The client should not need to construct cursors itself.

## Further Learning

Search these terms to go deeper:
- **"REST API resource naming conventions"** — practical URL design examples
- **"HTTP status codes API errors"** — mapping failures to status codes
- **"cursor pagination explained"** — stable pagination for changing datasets
- **"API versioning best practices"** — evolving contracts over time
