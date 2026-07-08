---
title: Custom Hooks
order: 8
estMinutes: 15
difficulty: easy
checklist:
  - List the Rules of Hooks and explain why they exist
  - Extract stateful logic into a custom hook with a use* prefix
  - Build useFetch, useLocalStorage, and useDebounce from scratch
  - Understand that custom hooks share logic but not state between instances
  - Recognize when a piece of logic is worth extracting vs kept inline
---

When you find yourself copying the same `useState` + `useEffect` combo into several components, you can bundle it up into a **custom hook** — a reusable function that contains that logic. It keeps your components clean and gives the logic a name.

## What a custom hook is

It's just a function whose name starts with `use` and that can call other hooks inside it. Here's one that tracks the window width:

```tsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return width
}
```

Now any component uses it in one clean line:

```tsx
function Layout() {
  const width = useWindowWidth()
  return width < 768 ? <MobileNav /> : <DesktopNav />
}
```

All the messy state + effect logic is hidden inside the hook.

## A super useful one: useLocalStorage

A custom hook can act like `useState` but *remember* the value across page reloads:

```tsx
const [theme, setTheme] = useLocalStorage('theme', 'light')
```

Same feel as `useState`, but it saves to the browser automatically.

## Two rules of hooks

Hooks have two simple rules that keep React happy:

1. **Only call hooks at the top level** — never inside an `if`, loop, or nested function.
2. **Only call hooks from components or other hooks** — not from regular functions.

```tsx
// ❌ don't do this
if (loggedIn) {
  const [name, setName] = useState('')
}

// ✅ do this — hook first, condition after
const [name, setName] = useState('')
if (!loggedIn) return null
```

> [!IMPORTANT]
> There's an ESLint plugin (`react-hooks`) that enforces these rules automatically. Turn it on and it'll catch mistakes for you.

## Each use gets its own state

If two components use the same custom hook, they don't share data — each gets its own independent copy. A custom hook shares *logic*, not *state*.

## In one sentence

A custom hook is a `use`-prefixed function that bundles reusable `useState`/`useEffect` logic — extract one whenever you're copying the same stateful pattern, and remember hooks must be called at the top level (never in an `if`).

## Want to go deeper?

Switch to **Expert** mode above for building `useFetch` and `useDebounce`, the Rules of Hooks in depth, and why each instance keeps separate state.
