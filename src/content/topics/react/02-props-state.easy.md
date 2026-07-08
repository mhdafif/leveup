---
title: Props & State
order: 2
estMinutes: 12
difficulty: easy
checklist:
  - Explain props as read-only inputs passed from parent to child
  - Destructure props in function component signatures
  - Provide default values for optional props
  - Describe what state is and why components need it
  - Trace one-way data flow through a component tree
  - Distinguish when to use props versus state for a given value
---

React components get their data from two places: **props** (info passed *in* from outside) and **state** (info the component *remembers itself*). Knowing which to use is the foundation of React.

## Props: info passed in

Props are like function arguments. A parent component passes them down to a child, and the child just uses them. Think of a button that's told its label and what to do when clicked:

```tsx
function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>
}

// used like:
<Button label="Save" onClick={handleSave} />
```

You can give optional props a default value right in the signature:

```tsx
function Button({ label, variant = 'primary' }) { ... }
```

> [!IMPORTANT]
> Props are **read-only**. A component must never change its own props — it only reads them. If you need a changed version, compute a new value instead.

## State: info a component remembers

State is data that *belongs* to a component and can change over time — like a counter's number or whether a menu is open. When state changes, React automatically re-draws the component to show the new value.

```tsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

Why not just a normal variable? Because React wouldn't know it changed. State is how you *tell React* "this changed — please re-draw."

## Data flows one direction: down

A key React idea: data flows **down** from parent to child via props. When a child needs to tell the parent something happened (like a click), the parent hands it a function to call:

```tsx
// parent passes a function down; child calls it up
<Button label="Delete" onClick={() => removeItem(id)} />
```

Down = data (props). Up = events (callbacks). This one-way flow makes apps easy to follow.

## Props or state? A quick guide

| Ask yourself... | Use |
|---|---|
| Does it come from outside the component? | **Props** |
| Does it change over time (clicks, typing, timers)? | **State** |
| Can I calculate it from what I already have? | Neither — just compute it |

> [!TIP]
> Before adding state, ask "can I derive this?" For example `const isValid = email.includes('@')` should be a plain variable, not state. Extra state = extra bugs.

## In one sentence

**Props** are read-only data passed into a component from its parent; **state** is data a component owns and can change (which re-draws it) — data flows down as props, events flow up as callbacks.

## Want to go deeper?

Switch to **Expert** mode above for the `children` prop, render props, and the full props-vs-state decision table.
