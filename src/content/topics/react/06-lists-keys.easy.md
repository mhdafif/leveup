---
title: Lists & Keys
order: 6
estMinutes: 12
difficulty: easy
checklist:
  - Render arrays of elements using Array.map() in JSX
  - Explain why React requires a key prop on list items
  - Choose stable, unique key values from your data
  - Know when using array index as a key is acceptable versus harmful
  - Understand how keys drive React's reconciliation algorithm
---

Showing a list of things — todos, products, messages — is one of the most common React tasks. You do it with `.map()`, and React asks for one extra thing: a `key` on each item.

## Rendering a list with .map()

Loop over your array with `.map()` and return a JSX element for each item:

```tsx
function TaskList({ tasks }) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  )
}
```

That's the whole pattern: `array.map(item => <Element key={...} />)`.

## Why the `key`?

When your list changes (an item added, removed, or reordered), React needs to figure out *what* changed so it can update just those items instead of redrawing everything. The `key` is a stable ID that lets React track each item.

Put the `key` on the **outermost element** returned by `.map()` — the `<li>` here.

## Choosing a good key

A key should be **unique** and **stable** — usually an ID from your data:

```tsx
// ✅ great — a real, stable id
tasks.map(task => <li key={task.id}>{task.title}</li>)

// ⚠️ risky — the array index
tasks.map((task, i) => <li key={i}>{task.title}</li>)
```

> [!CAUTION]
> Using the array **index** as the key causes bugs if the list can be reordered, sorted, or have items inserted/removed — especially if items contain inputs or their own state. Use a real ID (`task.id`) whenever you can. Index keys are only safe for a fixed list that never changes order.

## Filtering and sorting first

You can chain `.filter()` and `.sort()` before `.map()`:

```tsx
{tasks
  .filter(t => !t.done)
  .map(t => <li key={t.id}>{t.title}</li>)}
```

> [!NOTE]
> `.sort()` changes the original array. If it comes from state, copy it first: `[...tasks].sort(...)`.

## In one sentence

Render lists with `array.map(item => <El key={item.id} />)`, and give each item a **stable, unique key** (a real ID, not the array index) so React can update the list correctly.

## Want to go deeper?

Switch to **Expert** mode above for how React's reconciliation uses keys, the index-key bug in detail, and virtualizing huge lists.
