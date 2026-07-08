---
title: Optimistic UI Updates
order: 7
estMinutes: 12
difficulty: easy
checklist:
  - Update local state immediately before the server responds
  - Roll back state to its previous value on server error
  - Show pending, success, and error visual states distinctly
  - Generate a temporary ID for optimistically added items
  - Apply idempotency keys to prevent duplicate server-side actions
---

When you "like" a post, the heart fills in *instantly* — it doesn't wait for the server to reply. That's **optimistic UI**: update the screen right away, assuming the action will succeed, and quietly confirm with the server in the background. It makes apps feel snappy.

## The idea

Normally: click → wait for server → update screen. (Feels sluggish.)

Optimistic: click → **update screen immediately** → server confirms in the background. (Feels instant.)

You're *optimistically* assuming success — which is usually right.

## Handle the rare failure: roll back

Since you updated before the server confirmed, you need a plan for when it fails. The trick: remember the old state, and if the server says "nope," put it back:

```ts
const previous = todos          // save the current state
setTodos([newTodo, ...todos])   // update immediately (optimistic)

try {
  await saveTodo(newTodo)       // confirm with server
} catch {
  setTodos(previous)            // failed? roll back
  showError('Could not save')
}
```

## Show the difference

It's nice to show whether an item is still *pending* (saving) vs. *saved* — a subtle spinner or faded style — so users know the action is in flight.

## When NOT to be optimistic

> [!WARNING]
> Don't use optimistic updates for **money or destructive actions** — payments, deleting an account, security changes. If those "succeed" on screen but fail on the server, users lose trust. For those, show a real loading state and wait for the actual confirmation.

## In one sentence

Optimistic UI updates the screen instantly (assuming success) and rolls back if the server fails — great for likes and toggles, but *not* for payments or irreversible actions, where you should wait for real confirmation.

## Want to go deeper?

Switch to **Expert** mode above for temporary IDs, idempotency keys (preventing double-submits), and TanStack Query's optimistic helpers.
