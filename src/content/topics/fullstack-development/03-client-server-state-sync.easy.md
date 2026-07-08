---
title: Client Server State Sync
order: 3
estMinutes: 10
difficulty: easy
checklist:
  - Identify server state versus client state
  - Revalidate data after mutations
  - Apply optimistic updates with rollback
  - Avoid stale views after background changes
  - Resolve conflicts with clear product rules
---

In a full-stack app, some data lives on your server (and can change without your browser knowing) and some data is purely local to your current screen. Knowing which is which shapes how you write your app.

## Two kinds of state

- **Server state** — data from the backend (a list of tasks, a user's profile). It can change from *other* devices or people, not just yours.
- **Client state** — data that only matters to your current screen (is a panel open? what's selected right now?).

```ts
// server state — comes from the API, could change elsewhere
type ServerTask = { id: string, title: string, completedAt: string | null }

// client state — purely local to this screen
type PanelState = { selectedTaskId: string | null, isComposerOpen: boolean }
```

Treat them differently: server state needs fetching, caching, and refreshing; client state is just regular component state.

## Making updates feel instant (with a safety net)

When a user checks off a task, update the screen *immediately* (optimistic), then confirm with the server — and undo if it fails:

```ts
async function toggleTask(task, checked) {
  const previous = task.completedAt
  task.completedAt = checked ? new Date().toISOString() : null   // update now

  const res = await fetch(`/api/tasks/${task.id}`, { method: 'PATCH', ... })
  if (!res.ok) task.completedAt = previous   // failed? undo it
}
```

> [!NOTE]
> Before adding an optimistic update, ask: what happens if the request fails? If the user navigates away mid-request? Design the rollback *before* you need it, not after something breaks in production.

## In one sentence

Know the difference between server state (fetched, can change elsewhere) and client state (purely local) — update the screen optimistically for a snappy feel, but always design the rollback path for when the server request fails.

## Want to go deeper?

Switch to **Expert** mode above for cache invalidation after mutations and conflict resolution strategies.
