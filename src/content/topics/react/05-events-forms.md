---
title: Events & Forms
order: 5
estMinutes: 25
difficulty: easy
checklist:
  - Attach event handlers to elements using React's synthetic event system
  - Handle onClick, onChange, and onSubmit events correctly
  - Explain the difference between controlled and uncontrolled inputs
  - Build a controlled form with validation feedback
  - Prevent default browser behavior with e.preventDefault()
---

Every interactive React app is driven by events. React's event system wraps native browser events in a consistent cross-browser interface called SyntheticEvent, letting you handle clicks, input changes, form submissions, and keyboard events with a unified API.

## Synthetic Events

React registers a single event listener at the root of your app instead of attaching listeners to individual DOM nodes. When an event fires, React creates a `SyntheticEvent` wrapper with the same interface as a native event and dispatches it to the appropriate handler.

```tsx
function ClickLogger() {
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    console.log(e.target);       // The DOM node that was clicked
    console.log(e.currentTarget); // The element the handler is attached to
    console.log(e.nativeEvent);   // The underlying browser event
  }

  return <button onClick={handleClick}>Click me</button>;
}
```

Event handlers are passed as props (camelCase: `onClick`, `onChange`, `onKeyDown`). Never use strings like the old `onclick="..."` attribute.

## Inline vs Named Handlers

```tsx
// Inline arrow function — fine for simple cases
<button onClick={() => setCount(c => c + 1)}>+</button>

// Named handler — better for complex logic or when you need the event object
function handleDelete(e: React.MouseEvent, id: string) {
  e.stopPropagation(); // Prevent event from bubbling up
  deleteItem(id);
}
<button onClick={(e) => handleDelete(e, item.id)}>Delete</button>
```

> [!TIP]
> Pass handlers by reference (`onClick={handleClick}`) rather than wrapping in an unnecessary arrow function (`onClick={() => handleClick()}`) when you don't need to pass arguments. The wrapper creates a new function reference every render, which can affect memoized child components.

## Controlled vs Uncontrolled Inputs

**Uncontrolled inputs** let the DOM manage their own state. You read the value when you need it (e.g., on submit) using a ref.

**Controlled inputs** keep the value in React state. React is always the source of truth, and the input always reflects that state.

```tsx
// Controlled input
function ControlledInput() {
  const [value, setValue] = useState("");

  return (
    <input
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
    />
  );
}

// Uncontrolled input (accessed via ref on submit)
function UncontrolledInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    console.log(inputRef.current?.value);
  }

  return <input ref={inputRef} defaultValue="" />;
}
```

> [!NOTE]
> Most React code uses controlled inputs because they make validation, formatting, and derived state straightforward. Uncontrolled inputs are useful for file inputs (which cannot be controlled) or when integrating with non-React libraries.

## Building a Controlled Form

```tsx
type FormState = { email: string; password: string };

function LoginForm() {
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Prevent page reload
    if (!form.email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    submitLogin(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <input name="email" value={form.email} onChange={handleChange} type="email" />
      <input name="password" value={form.password} onChange={handleChange} type="password" />
      <button type="submit">Log in</button>
    </form>
  );
}
```

The `e.preventDefault()` call on form submission is essential — without it the browser navigates to the form's `action` URL, reloading the page.

## Common Events Quick Reference

| Event Prop | Triggered When |
|---|---|
| `onClick` | Element is clicked |
| `onChange` | Input value changes |
| `onSubmit` | Form is submitted |
| `onFocus` / `onBlur` | Element gains / loses focus |
| `onKeyDown` / `onKeyUp` | Keyboard key is pressed / released |
| `onMouseEnter` / `onMouseLeave` | Mouse enters / leaves element |

> [!CAUTION]
> `onChange` in React fires on **every keystroke**, not just when the input loses focus (unlike the native DOM `change` event). This is intentional — it keeps React state in sync with every character typed.

## Further Learning

Search these terms to go deeper:
- **"React SyntheticEvent react.dev"** — complete list of supported events and their TypeScript types
- **"controlled vs uncontrolled components react.dev"** — when to choose each approach
- **"React Hook Form library"** — the most popular library for handling forms without the controlled-input boilerplate
- **"e.stopPropagation vs e.preventDefault React"** — understanding event bubbling and default behavior
- **"Josh W. Comeau forms in React"** — practical guide with real-world form patterns
