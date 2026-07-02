---
title: API Security Basics
order: 9
estMinutes: 35
difficulty: medium
checklist:
  - Validate and sanitize every request body
  - Enforce authorization on each protected resource
  - Protect APIs from injection attacks
  - Apply rate limits to sensitive endpoints
  - Store secrets outside source code
  - Return safe error messages
---

API security starts with a defensive assumption: every request is untrusted. Good security is layered. Authentication, authorization, validation, rate limiting, safe database access, and secret management all cover different failure modes.

## Validate Unknown Input

```ts
type ParsedProject = { name: string };

function parseProject(input: unknown): ParsedProject {
  if (
    typeof input !== "object" ||
    input === null ||
    typeof (input as { name?: unknown }).name !== "string"
  ) {
    throw new Error("Invalid project payload");
  }

  return { name: (input as { name: string }).name.trim() };
}
```

Validation should happen before business logic. Treat `unknown` as the default type at the edge of your system.

## Injection and Secrets

Use parameterized queries instead of string interpolation.

```ts
await db.query("SELECT * FROM users WHERE email = ?", [email]);
```

Secrets such as database passwords, signing keys, and API tokens belong in environment-specific secret stores, not committed files.

> [!WARNING]
> Error responses should help legitimate clients recover without revealing stack traces, SQL text, internal service names, or secret values.

## Rate Limiting

Rate limits protect login, password reset, signup, search, and expensive write endpoints. Limits can be per IP, per account, or per token depending on the abuse pattern.

> [!TIP]
> Security is strongest when boring defaults are automatic. Central middleware for auth, rate limits, and request size limits prevents missed routes.

## Further Learning

Search these terms to go deeper:
- **"OWASP API Security Top 10"** — common API vulnerabilities
- **"SQL injection parameterized queries"** — safe database access
- **"API rate limiting strategies"** — preventing abuse
- **"secret management twelve factor app"** — handling credentials by environment
