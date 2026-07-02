---
title: Client Server State Sync
order: 3
estMinutes: 35
difficulty: medium
checklist:
  - Identify server state versus client state
  - Revalidate data after mutations
  - Apply optimistic updates with rollback
  - Avoid stale views after background changes
  - Resolve conflicts with clear product rules
---

Full-stack apps constantly synchronize state across the browser, API, database, and sometimes other users. The first design decision is knowing which state is authoritative.

## Server State and Client State

Server state comes from the backend and can change without the current browser knowing. Client state belongs to the current UI session.

```ts
type ServerTask = {
  id: string;
  title: string;
  completedAt: string | null;
};

type ClientPanelState = {
  selectedTaskId: string | null;
  isComposerOpen: boolean;
};
```

Tasks are server state. The open panel is client state.

## Optimistic Updates

```ts
async function toggleTask(task: ServerTask, checked: boolean) {
  const previous = task.completedAt;
  task.completedAt = checked ? new Date().toISOString() : null;

  const res = await fetch(`/api/tasks/${task.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: checked }),
  });

  if (!res.ok) {
    task.completedAt = previous;
  }
}
```

Optimism makes UIs feel fast, but rollback must be designed before it fails.

> [!NOTE]
> Every optimistic update should answer what happens if the request fails, the user navigates away, or another device changes the same record.

## Further Learning

Search these terms to go deeper:
- **"server state vs client state"** — choosing where data belongs
- **"optimistic UI rollback patterns"** — fast interactions with safety
- **"cache invalidation after mutations"** — keeping reads fresh
- **"data conflict resolution strategies"** — handling concurrent edits
