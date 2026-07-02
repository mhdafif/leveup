---
title: API Integration Patterns
order: 1
estMinutes: 30
difficulty: medium
checklist:
  - Define typed contracts between frontend and backend
  - Handle loading empty and error states
  - Normalize API responses for UI components
  - Centralize request behavior and headers
  - Avoid duplicating endpoint knowledge across views
---

API integration is where frontend and backend contracts become user experience. A good integration layer hides transport details from UI components while keeping data types, errors, and loading states explicit.

## Typed Fetch Wrappers

```ts
type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string };

async function getJson<T>(path: string): Promise<ApiResult<T>> {
  const res = await fetch(path, {
    headers: { Accept: "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    return { ok: false, status: res.status, message: "Request failed" };
  }

  return { ok: true, data: (await res.json()) as T };
}
```

UI code should not repeat `credentials`, headers, base URLs, and error parsing in every component.

## Data Shapes for Components

Backend models are often not the same as UI view models. Adapt them at the boundary.

```ts
type TaskResponse = { id: string; title: string; completed_at: string | null };
type TaskView = { id: string; title: string; isComplete: boolean };

function toTaskView(task: TaskResponse): TaskView {
  return {
    id: task.id,
    title: task.title,
    isComplete: task.completed_at !== null,
  };
}
```

> [!NOTE]
> Mapping API data into view models is not wasteful. It protects components from backend naming, nullable fields, and transport-specific details.

## Further Learning

Search these terms to go deeper:
- **"frontend API client layer patterns"** — structuring request code
- **"TypeScript API response types"** — safer client contracts
- **"loading error empty states UI"** — complete async interfaces
- **"OpenAPI generated TypeScript client"** — generating clients from API specs
