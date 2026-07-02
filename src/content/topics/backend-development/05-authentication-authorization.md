---
title: Authentication and Authorization
order: 5
estMinutes: 35
difficulty: medium
checklist:
  - Distinguish authentication from authorization
  - Compare cookie sessions and JWTs
  - Protect routes with server-side checks
  - Store password hashes safely
  - Model roles and resource permissions
  - Invalidate sessions when risk changes
---

Authentication answers who the user is. Authorization answers what that user is allowed to do. Mixing the two leads to serious bugs, like showing the right account but allowing access to the wrong resource.

## Sessions and JWTs

Cookie sessions keep the session record on the server and send the browser an opaque session id.

```ts
type Session = {
  id: string;
  userId: string;
  expiresAt: Date;
};
```

JWTs carry signed claims in the token itself.

```ts
type AccessTokenClaims = {
  sub: string;
  role: "user" | "admin";
  exp: number;
};
```

Sessions are easier to revoke. JWTs can be useful for distributed systems, but revocation, rotation, and claim freshness require careful design.

> [!TIP]
> For most web apps, start with secure, HTTP-only, same-site cookies backed by server-side sessions. It is simple, revocable, and fits browser security well.

## Authorization Checks

Check permissions close to the operation, not only in the UI.

```ts
function canEditProject(user: { id: string; role: string }, project: { ownerId: string }) {
  return user.role === "admin" || project.ownerId === user.id;
}

async function updateProject(userId: string, projectId: string, name: string) {
  const user = await users.findById(userId);
  const project = await projects.findById(projectId);

  if (!project || !user || !canEditProject(user, project)) {
    throw new Error("Forbidden");
  }

  return projects.update(projectId, { name });
}
```

> [!WARNING]
> Hiding a button in the frontend is not authorization. Attackers can still call the API directly.

## Further Learning

Search these terms to go deeper:
- **"session authentication vs JWT"** — trade-offs for browser apps
- **"OWASP password storage cheat sheet"** — hashing passwords safely
- **"role based access control vs attribute based access control"** — permission modeling options
- **"HTTP only secure same site cookies"** — browser session cookie protections
