---
title: Custom Hooks
order: 8
estMinutes: 30
difficulty: medium
checklist:
  - List the Rules of Hooks and explain why they exist
  - Extract stateful logic into a custom hook with a use* prefix
  - Build useFetch, useLocalStorage, and useDebounce from scratch
  - Understand that custom hooks share logic but not state between instances
  - Recognize when a piece of logic is worth extracting vs kept inline
---

Custom hooks are the primary way React lets you reuse stateful logic between components. Unlike utility functions, hooks can call other hooks — giving you access to `useState`, `useEffect`, `useRef`, and the entire React lifecycle inside reusable logic.

## Rules of Hooks

React's hook system depends on hooks being called in the same order on every render. Two rules enforce this:

1. **Only call hooks at the top level.** Never inside conditions, loops, or nested functions.
2. **Only call hooks from React functions.** Call them from function components or from other custom hooks — never from regular JavaScript functions.

```tsx
// Wrong: conditional hook call
function Component({ isLoggedIn }: { isLoggedIn: boolean }) {
  if (isLoggedIn) {
    const [name, setName] = useState(""); // React can't track this reliably
  }
}

// Correct: condition inside the hook
function Component({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [name, setName] = useState("");
  if (!isLoggedIn) return null; // Condition after all hooks
}
```

> [!IMPORTANT]
> The `eslint-plugin-react-hooks` package enforces both rules statically. Install it and enable `react-hooks/rules-of-hooks` — it catches violations before they become runtime bugs.

## Anatomy of a Custom Hook

A custom hook is a function whose name starts with `use` and that may call other hooks. The `use` prefix is what signals to React (and linters) that this function follows hook rules.

```ts
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

// Usage — clean and declarative
function ResponsiveLayout() {
  const width = useWindowWidth();
  return <div>{width < 768 ? <MobileNav /> : <DesktopNav />}</div>;
}
```

## useFetch

```ts
type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<T>;
      })
      .then(data => { if (!cancelled) setState({ data, loading: false, error: null }); })
      .catch(error => { if (!cancelled) setState({ data: null, loading: false, error }); });

    return () => { cancelled = true; };
  }, [url]);

  return state;
}

// Usage
function UserProfile({ id }: { id: string }) {
  const { data, loading, error } = useFetch<User>(`/api/users/${id}`);
  if (loading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;
  return <p>{data?.name}</p>;
}
```

> [!NOTE]
> `useFetch` is great for learning. In production, use TanStack Query or SWR — they add caching, deduplication, background refetching, and much more.

## useLocalStorage

```ts
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  function setStoredValue(newValue: T) {
    setValue(newValue);
    window.localStorage.setItem(key, JSON.stringify(newValue));
  }

  return [value, setStoredValue] as const;
}

// Usage — drop-in replacement for useState with persistence
const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");
```

## useDebounce

```ts
function useDebounce<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer); // Cancel previous timer on each change
  }, [value, delayMs]);

  return debouncedValue;
}

// Usage — delay API calls while the user types
function SearchBox() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const { data } = useFetch<Result[]>(`/api/search?q=${debouncedQuery}`);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

## Custom Hooks Share Logic, Not State

Each component instance that calls a custom hook gets its own independent state. Hooks are not singletons.

```tsx
function Page() {
  const widthA = useWindowWidth(); // Own listener, own state
  const widthB = useWindowWidth(); // Different instance — same value, but independent
  // widthA === widthB, but each has its own event listener
}
```

> [!TIP]
> When you find yourself copying the same `useState` + `useEffect` pattern into multiple components, that's the signal to extract it into a custom hook. The component code gets shorter and the logic gets a name.

## Further Learning

Search these terms to go deeper:
- **"Custom hooks react.dev"** — official guide with examples and motivation
- **"Kent C. Dodds advanced React hooks"** — deep patterns including useReducer-based custom hooks
- **"useHooks.com"** — a curated collection of production-ready custom hooks
- **"react-use library"** — comprehensive library of 100+ custom hooks to study
- **"Rules of Hooks eslint-plugin-react-hooks"** — how to set up static enforcement
