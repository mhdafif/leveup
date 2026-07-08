---
title: API Security Basics
order: 9
estMinutes: 12
difficulty: easy
checklist:
  - Validate and sanitize every request body
  - Enforce authorization on each protected resource
  - Protect APIs from injection attacks
  - Apply rate limits to sensitive endpoints
  - Store secrets outside source code
  - Return safe error messages
---

The golden rule of API security: **treat every request as untrusted**, even ones from your own app. Good security isn't one big trick — it's several small habits layered together.

## Always validate what comes in

Never assume the data you receive matches what you expect. Check it before using it:

```ts
function parseProject(input) {
  if (typeof input !== 'object' || typeof input.name !== 'string') {
    throw new Error('Invalid project payload')
  }
  return { name: input.name.trim() }
}
```

## Never build SQL by hand-mixing user input

Building a query by pasting user input directly into a string is how **SQL injection** attacks happen. Instead, always use parameterized queries (placeholders the database fills in safely):

```ts
// ✅ safe — the database handles the value safely
await db.query('SELECT * FROM users WHERE email = ?', [email])
```

## Keep secrets out of your code

API keys, database passwords, and signing secrets should live in environment variables (or a secrets manager) — never committed into your source code.

## Don't leak details in error messages

> [!WARNING]
> Error responses should help the client fix their request, but never leak stack traces, SQL text, or internal details. "Invalid request" is safe; a raw database error message is not.

## Rate limit the sensitive stuff

Login, signup, and password reset endpoints are prime targets for abuse. Add a rate limit (e.g. "max 5 attempts per minute") so attackers can't hammer them.

## In one sentence

Treat every request as untrusted: validate input at the door, use parameterized queries (never string-built SQL), keep secrets out of source code, avoid leaking internal errors, and rate-limit sensitive endpoints like login.

## Want to go deeper?

Switch to **Expert** mode above for the OWASP API Security Top 10 and detailed rate-limiting strategies.
