---
title: Events & Forms
order: 5
estMinutes: 15
difficulty: easy
checklist:
  - Attach event handlers to elements using React's synthetic event system
  - Handle onClick, onChange, and onSubmit events correctly
  - Explain the difference between controlled and uncontrolled inputs
  - Build a controlled form with validation feedback
  - Prevent default browser behavior with e.preventDefault()
---

Apps react to what users do: clicks, typing, submitting forms. In React, you handle these by passing a function to special props like `onClick` and `onChange`.

## Handling events

Attach a handler by passing a function to a camelCase prop:

```tsx
function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

Note the names: `onClick`, `onChange`, `onSubmit` — always camelCase, and you pass an actual function (not a string).

## Controlled inputs: React owns the value

The React way to handle a text box is to store its value in state and update it on every keystroke. React is the "single source of truth":

```tsx
function NameField() {
  const [name, setName] = useState('')
  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  )
}
```

`value={name}` shows the state; `onChange` updates the state as you type. This is called a **controlled input**, and it's what you'll use most — it makes validation and formatting easy.

## Building a form

Two important pieces: read the typed value from `e.target.value`, and stop the browser from reloading the page with `e.preventDefault()`:

```tsx
function LoginForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()  // stop the page from reloading
    if (!email.includes('@')) {
      setError('Please enter a valid email.')
      return
    }
    submitLogin(email)
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
      <button type="submit">Log in</button>
    </form>
  )
}
```

> [!IMPORTANT]
> Always call `e.preventDefault()` in a form's submit handler. Without it, the browser does its old-school thing — reloading the page — and your React code never runs.

## Common events

| Prop | Fires when... |
|---|---|
| `onClick` | something is clicked |
| `onChange` | an input's value changes (every keystroke) |
| `onSubmit` | a form is submitted |
| `onFocus` / `onBlur` | an input gains / loses focus |

## In one sentence

Handle interactions with camelCase props (`onClick`, `onChange`, `onSubmit`), keep text inputs "controlled" by storing their value in state, and always call `e.preventDefault()` in form submit handlers to stop the page reloading.

## Want to go deeper?

Switch to **Expert** mode above for synthetic events, controlled vs uncontrolled inputs, refs, and React Hook Form.
