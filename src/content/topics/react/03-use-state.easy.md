---
title: useState
order: 3
estMinutes: 12
difficulty: easy
checklist:
  - Use the useState hook to declare and update state variables
  - Explain why state updates are asynchronous and what that means in practice
  - Apply functional updates to safely derive next state from previous state
  - Manage multiple independent state variables in one component
  - Identify situations where useState is the wrong tool
---

`useState` is the tool you'll use most in React. It gives a component a piece of memory that survives between re-draws, and it tells React to re-draw whenever that memory changes.

## The basic shape

```tsx
import { useState } from 'react'

function Toggle() {
  const [isOn, setIsOn] = useState(false)  // start off

  return (
    <button onClick={() => setIsOn(!isOn)}>
      {isOn ? 'On' : 'Off'}
    </button>
  )
}
```

`useState(false)` gives you back two things:
- `isOn` — the current value.
- `setIsOn` — a function to change it.

The value you pass (`false`) is just the starting value. You can name the pair anything (`[count, setCount]`, etc.).

## Updating doesn't happen *instantly*

When you call the setter, React doesn't change the value on the spot — it schedules a re-draw and the new value shows up next time:

```tsx
function handleClick() {
  setCount(count + 1)
  console.log(count)  // still the OLD value here!
}
```

This surprises everyone at first. Just remember: after you call the setter, `count` in the current run is still the old number.

## Updating based on the previous value

If your new value depends on the old one — especially if you update more than once — use the **function form**, which hands you the latest value:

```tsx
// ❌ only adds 1 (all three see the same old count)
setCount(count + 1)
setCount(count + 1)

// ✅ adds 2 (each gets the up-to-date value)
setCount(prev => prev + 1)
setCount(prev => prev + 1)
```

Rule of thumb: if the next value depends on the previous one, use `setCount(prev => ...)`.

## As many pieces as you need

Just call `useState` again for each separate piece of data:

```tsx
const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [agreed, setAgreed] = useState(false)
```

## Not everything needs to be state

If a value can be *calculated* from what you already have, don't make it state — just compute it:

```tsx
const isValid = email.includes('@')  // plain variable, not state
```

> [!NOTE]
> If changing a value shouldn't re-draw the screen (like a timer id), that's a job for `useRef`, not `useState`.

## In one sentence

`useState(initial)` gives you `[value, setValue]`; calling `setValue` schedules a re-draw (the value updates next render, not immediately), and you use `setValue(prev => ...)` when the new value depends on the old one.

## Want to go deeper?

Switch to **Expert** mode above for state batching, lazy initial state, grouping state into objects, and `useState` vs `useRef`.
