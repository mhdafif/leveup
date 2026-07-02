---
title: useState
order: 3
estMinutes: 25
difficulty: easy
checklist:
  - Use the useState hook to declare and update state variables
  - Explain why state updates are asynchronous and what that means in practice
  - Apply functional updates to safely derive next state from previous state
  - Manage multiple independent state variables in one component
  - Identify situations where useState is the wrong tool
---

`useState` is the hook you will reach for most in React. It lets a function component remember a value between renders and trigger a re-render when that value changes. Getting comfortable with its quirks — especially the async update model — prevents a whole class of subtle bugs.

## Basic Syntax

```tsx
import { useState } from "react";

function Toggle() {
  const [isOn, setIsOn] = useState(false);

  return (
    <button onClick={() => setIsOn(!isOn)}>
      {isOn ? "On" : "Off"}
    </button>
  );
}
```

`useState` returns a tuple: the current value and a setter function. The argument to `useState` is the initial value, used only on the first render. Destructuring with array destructuring (`[value, setValue]`) lets you name the pair anything you want.

## State Updates Are Asynchronous

Calling `setState` does not update the variable immediately. React **schedules** a re-render and the new value is only visible on the next render cycle.

```tsx
function AsyncDemo() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    console.log(count); // Still logs the OLD value — the update hasn't applied yet
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

> [!WARNING]
> If you call `setCount` multiple times in the same event handler using the current value, only the last update will take effect — because `count` hasn't changed yet when each call runs.

```tsx
// Bug: only increments by 1, not 3
function brokenTripleIncrement(count: number, setCount: (n: number) => void) {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
}
```

## Functional Updates

When the new state depends on the previous state, always use the **functional update form**: pass a function to the setter instead of a value.

```tsx
function CorrectCounter() {
  const [count, setCount] = useState(0);

  function tripleIncrement() {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1); // Correctly increments by 3
  }

  return <button onClick={tripleIncrement}>{count}</button>;
}
```

React queues these functions and calls them in order, passing the latest value to each. This is also important in event handlers called inside `setInterval` or async code, where captured `count` values go stale.

## Multiple State Variables

You can call `useState` multiple times. Each call is independent.

```tsx
function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);

  return (
    <form>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
    </form>
  );
}
```

> [!TIP]
> Grouping related state into an object (`useState({ name: "", email: "" })`) can make sense when values always change together, but keep in mind that the setter **replaces** the object entirely — you must spread the previous state to preserve other fields: `setState(prev => ({ ...prev, name: "Alice" }))`.

## Lazy Initial State

If computing the initial value is expensive, pass a function instead of a value. React calls it only on the first render.

```tsx
function ExpensiveInit() {
  // Without lazy init: runs on every render (but only the first result is used)
  const [data, setData] = useState(computeExpensiveDefault());

  // With lazy init: runs only once
  const [data2, setData2] = useState(() => computeExpensiveDefault());
}
```

## When NOT to Use State

Not every value needs to be state. Overusing `useState` leads to components that are hard to reason about.

| Situation | What to use instead |
|---|---|
| A value derived from state or props | Plain variable (computed inline) |
| A value that doesn't affect rendering | `useRef` |
| Data shared across many components | Context, Zustand, Redux |
| Server data (fetched from an API) | TanStack Query, SWR |

> [!NOTE]
> If your state update doesn't need to trigger a re-render, it shouldn't be state. `useRef` stores mutable values between renders without causing re-renders — useful for timers, DOM refs, and previous-value tracking.

## Further Learning

Search these terms to go deeper:
- **"useState react.dev hooks reference"** — the complete API reference with edge cases
- **"Kent C. Dodds useState vs useRef"** — when to use each and why the distinction matters
- **"React state batching React 18"** — how React 18 changed the automatic batching of state updates
- **"stale closure problem React hooks"** — the deeper explanation of why functional updates are necessary
- **"Josh W. Comeau understanding useMemo"** — covers state fundamentals as a prerequisite
