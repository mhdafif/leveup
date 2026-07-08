---
title: API Integration Patterns
order: 1
estMinutes: 12
difficulty: easy
checklist:
  - Define typed contracts between frontend and backend
  - Handle loading empty and error states
  - Normalize API responses for UI components
  - Centralize request behavior and headers
  - Avoid duplicating endpoint knowledge across views
---

Connecting your frontend to your backend API is more than just calling `fetch`. Good **API integration** means the messy parts of talking to a server (headers, errors, data shapes) live in *one* place, not scattered across every component.

## Wrap fetch once, use it everywhere

Instead of writing the same `fetch` boilerplate in every component, write one small helper and reuse it:

```ts
async function getJson(path) {
  const res = await fetch(path, { headers: { Accept: 'application/json' } })
  if (!res.ok) return { ok: false, message: 'Request failed' }
  return { ok: true, data: await res.json() }
}
```

Now every part of your app calling the API gets the same headers, same error handling, without repeating it.

## Reshape server data for your UI

The backend's data shape and what your UI actually wants to display are often slightly different — don't be afraid to convert one into the other:

```ts
// backend sends this
type TaskResponse = { id: string, completed_at: string | null }

// your UI wants this
function toTaskView(task) {
  return { id: task.id, isComplete: task.completed_at !== null }
}
```

> [!NOTE]
> This isn't wasted effort — it protects your components from backend naming quirks (like `snake_case`) and keeps your UI code clean and readable.

## Always plan for three states

Every piece of data from an API can be in one of three states, and your UI should handle all of them: **loading** (still fetching), **empty** (fetched, but nothing there), and **error** (something went wrong). Forgetting one of these is the most common source of "why is this component broken?" bugs.

## In one sentence

Centralize your API calls in one reusable helper (consistent headers and error handling), convert backend data shapes into clean view models for your UI, and always design for loading/empty/error states.

## Want to go deeper?

Switch to **Expert** mode above for typed `ApiResult` contracts and generating clients from OpenAPI specs.
