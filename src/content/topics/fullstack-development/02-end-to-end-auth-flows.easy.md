---
title: End-to-End Auth Flows
order: 2
estMinutes: 12
difficulty: easy
checklist:
  - Trace login from form submit to session creation
  - Store browser credentials safely
  - Load the current user on app startup
  - Protect server routes and client routes
  - Handle logout and session expiration
  - Distinguish identity from permissions
---

Login isn't just a frontend form or just a backend check — it's a **full-stack** conversation. The frontend collects credentials, sends them, and reflects "who's logged in" throughout the app; the backend verifies them and enforces access on every request.

## The login flow

```ts
async function login({ email, password }) {
  const res = await fetch('/api/login', {
    method: 'POST',
    credentials: 'include',   // lets the browser store the session cookie
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error('Invalid email or password')
  return res.json()   // the logged-in user's info
}
```

With cookie-based sessions, your JavaScript never touches the actual login cookie — the browser handles that automatically. Instead, your app asks a `/api/me` endpoint "who am I?" to figure out the current user.

## Checking "am I logged in?" when the app loads

When your app starts up, call something like `/api/me`. If it succeeds, you know who's logged in. If it returns a `401`, treat the user as logged out.

## Protecting pages — do it in TWO places

- **Client-side** (hide a page/menu item) — this is just for a nice user experience.
- **Server-side** (check the session on every API call) — this is the *actual* security.

> [!WARNING]
> Never rely on the frontend alone to protect a page. Anyone can call your API directly, skipping the UI entirely — the server must check permissions on every request, every time.

## Logging out and expired sessions

When a session expires (`/api/me` starts returning 401), clear the local "logged in" state and send the user back to login — cleanly, without endlessly retrying.

## In one sentence

Authentication spans the whole stack: the frontend collects credentials and reflects login state (checking `/api/me` on load), but real security lives on the server, which must verify the session on *every* protected request — never trust the frontend alone.

## Want to go deeper?

Switch to **Expert** mode above for CSRF protection with SameSite cookies and centralizing auth state.
