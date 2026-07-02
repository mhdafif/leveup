---
title: Optimistic UI Updates
order: 7
estMinutes: 30
difficulty: medium
checklist:
  - Update local state immediately before the server responds
  - Roll back state to its previous value on server error
  - Show pending, success, and error visual states distinctly
  - Generate a temporary ID for optimistically added items
  - Apply idempotency keys to prevent duplicate server-side actions
---

Optimistic UI updates the interface as if a request succeeded before the server confirms it. It makes low-risk actions feel instant: starring a repository, toggling a task, reacting to a post, or adding a draft item. The pattern works only when failure can be explained and safely rolled back.

## Three State Pattern

Track `pending`, `success`, and `error` separately from the entity itself. The user should be able to tell whether an item is saved or still waiting.

```ts
type Todo = {
  id: string;
  title: string;
  status: "pending" | "saved" | "error";
};

export async function addTodoOptimistically(
  todos: Todo[],
  title: string,
  saveTodo: (input: { title: string; idempotencyKey: string }) => Promise<Todo>,
) {
  const idempotencyKey = crypto.randomUUID();
  const tempTodo: Todo = { id: `temp-${idempotencyKey}`, title, status: "pending" };
  const previousTodos = todos;
  const optimisticTodos = [tempTodo, ...todos];

  try {
    const saved = await saveTodo({ title, idempotencyKey });
    return optimisticTodos.map((todo) =>
      todo.id === tempTodo.id ? { ...saved, status: "saved" } : todo,
    );
  } catch {
    return previousTodos;
  }
}
```

The previous state is your rollback point. Store it before changing local state, then restore it if the server rejects the mutation.

## Temporary IDs And Idempotency

New items need a client ID immediately so the UI can render, animate, focus, or remove them while the network request is in flight. Use `crypto.randomUUID()` to generate a temporary ID and a separate idempotency key. The idempotency key tells the server that retries or double-clicks are the same intended action.

## When To Avoid It

Do not use optimistic updates when a rollback would damage trust: payments, irreversible deletion, account security changes, or anything regulated. In those flows, show a clear loading state and wait for confirmation.

> [!WARNING]
> Don't use optimistic updates for destructive or financial actions where a rollback would confuse the user. Show a loading state instead.

## Further Learning

Search these terms to go deeper:
- **"optimistic UI rollback pattern"** — preserving and restoring previous state
- **"idempotency key API design"** — preventing duplicate server-side actions
- **"TanStack Query optimistic updates"** — production mutation lifecycle helpers
- **"temporary client IDs distributed systems"** — reconciling local and server identity
