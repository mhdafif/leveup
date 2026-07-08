---
title: State Management Libraries
order: 11
estMinutes: 15
difficulty: easy
checklist:
  - Identify the limitations of useState and Context that motivate external libraries
  - Set up a Zustand store and read/update state from any component
  - Create a Redux Toolkit slice with createSlice and async actions with createAsyncThunk
  - Compare Zustand and Redux Toolkit on complexity, boilerplate, and use cases
  - Explain the unidirectional data flow in Redux with actions and reducers
---

`useState` and Context work great until an app gets big — lots of components sharing and changing the same data. At that point a **state management library** gives you one central place to keep shared state, cleanly readable and updatable from anywhere.

## When you might need one

- Many components across the app read/change the same data.
- Passing state around is getting messy even with Context.
- You want better debugging tools to see what changed and when.

The two popular choices today are **Zustand** (simple, tiny) and **Redux Toolkit** (more features, more structure).

## Zustand: the simple option

Zustand keeps your shared state in one place, and any component can read or update it — no wrapping providers needed:

```ts
import { create } from 'zustand'

export const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((s) => ({ items: [...s.items, item] })),
  clearCart: () => set({ items: [] }),
}))
```

```tsx
// any component, anywhere
function CartIcon() {
  const count = useCartStore((s) => s.items.length)
  return <span>{count}</span>
}
```

That selector `(s) => s.items.length` means this component only re-draws when the count changes — nice and efficient.

> [!TIP]
> Zustand needs almost no setup and the whole thing fits in one file. It's a great default for small-to-medium apps that just need shared state without ceremony.

## Redux Toolkit: the structured option

**Redux Toolkit** is the modern, official way to use Redux. It's more organized (good for big apps and teams) and has excellent debugging tools, but with a bit more setup. The core idea:

1. Components "dispatch" an action ("add todo").
2. A "reducer" updates the central store.
3. Components reading that data re-draw.

It's more ceremony than Zustand, which is exactly why big, complex apps like it — everything follows one predictable pattern.

## Which to pick?

| | Zustand | Redux Toolkit |
|---|---|---|
| Setup | almost none | more structure |
| Best for | small–medium apps | large, complex apps |
| Debug tools | basic | excellent |

> [!CAUTION]
> Neither of these is for *server data* (stuff fetched from an API). For that, use **TanStack Query**, which handles caching and refreshing. Common combo: TanStack Query for server data + Zustand/Redux for your app's UI state.

## In one sentence

When many components share state, reach for a library — **Zustand** for a tiny, no-setup central store, or **Redux Toolkit** for a structured, well-tooled option in large apps — but use **TanStack Query** for server data.

## Want to go deeper?

Switch to **Expert** mode above for a full Zustand store, Redux Toolkit slices with async thunks, the Redux data-flow diagram, and a detailed comparison.
