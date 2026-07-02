---
title: End-to-End Auth Flows
order: 2
estMinutes: 35
difficulty: medium
checklist:
  - Trace login from form submit to session creation
  - Store browser credentials safely
  - Load the current user on app startup
  - Protect server routes and client routes
  - Handle logout and session expiration
  - Distinguish identity from permissions
---

Authentication is a full-stack workflow. The frontend collects credentials and reflects identity state. The backend verifies credentials, creates sessions, and enforces access. Both sides must agree on how the current user is loaded and how expired sessions behave.

## Login Flow

```ts
type LoginPayload = { email: string; password: string };
type CurrentUser = { id: string; email: string; role: "user" | "admin" };

async function login(payload: LoginPayload): Promise<CurrentUser> {
  const res = await fetch("/api/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Invalid email or password");
  return (await res.json()) as CurrentUser;
}
```

With cookie sessions, the browser stores an HTTP-only cookie. JavaScript does not read the cookie directly; it asks `/api/me` for the current user.

## Route Protection

Client route guards improve experience, but server route guards provide security. Protected API routes must check authentication every time.

> [!WARNING]
> Never rely on client route guards as the only protection. Users can bypass the UI and call APIs directly.

## Session Expiration

When `/api/me` returns `401`, the frontend should clear local user state and move to an unauthenticated flow. Avoid infinite retry loops.

> [!TIP]
> Make auth state boring and centralized. Every screen should not invent its own way to determine whether the user is logged in.

## Further Learning

Search these terms to go deeper:
- **"cookie session authentication full stack"** — browser and server session flow
- **"CSRF SameSite cookies"** — protecting cookie-based auth
- **"current user endpoint API"** — loading identity on startup
- **"frontend route guards server authorization"** — UX vs security boundaries
