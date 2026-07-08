---
title: Authentication and Authorization
order: 5
estMinutes: 12
difficulty: easy
checklist:
  - Distinguish authentication from authorization
  - Compare cookie sessions and JWTs
  - Protect routes with server-side checks
  - Store password hashes safely
  - Model roles and resource permissions
  - Invalidate sessions when risk changes
---

Two words that sound similar but mean different things:

- **Authentication** — *who are you?* (logging in)
- **Authorization** — *what are you allowed to do?* (permissions)

Mixing these up causes real bugs — like correctly recognizing who someone is, but letting them touch data that isn't theirs.

## How the server remembers you're logged in

The simplest, most common approach: after login, the server gives your browser a **session cookie** — a little id that says "you're user #42." The server keeps the actual session info on its side:

```ts
type Session = { id: string, userId: string, expiresAt: Date }
```

> [!TIP]
> For most web apps, start with secure, `HttpOnly` cookie sessions. They're simple, and — importantly — you can instantly cancel one (log someone out) just by deleting it server-side.

You'll also hear about **JWTs** (tokens that carry the info inside themselves, signed so they can't be faked). They're handy for some systems, but harder to instantly "cancel" — sessions are usually the simpler choice to start with.

## Checking permissions — always on the server

Never rely on hiding a button in the UI to protect something. Anyone can call your API directly, bypassing your frontend entirely:

```ts
function canEditProject(user, project) {
  return user.role === 'admin' || project.ownerId === user.id
}

async function updateProject(userId, projectId, name) {
  const user = await getUser(userId)
  const project = await getProject(projectId)
  if (!canEditProject(user, project)) throw new Error('Forbidden')
  // ...proceed
}
```

> [!WARNING]
> Hiding a button in the frontend is not security. Always check permissions again on the server, on every request.

## In one sentence

Authentication confirms *who* someone is (usually via a secure session cookie), authorization decides *what* they're allowed to do — and permission checks must always happen on the server, never just in the UI.

## Want to go deeper?

Switch to **Expert** mode above for JWT trade-offs, password hashing, and role-based access control.
