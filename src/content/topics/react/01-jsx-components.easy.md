---
title: JSX & Components
order: 1
estMinutes: 12
difficulty: easy
checklist:
  - Understand what JSX is and how it compiles to React.createElement calls
  - Write function components that accept props and return JSX
  - Use fragments to avoid unnecessary wrapper elements
  - Embed JavaScript expressions inside JSX using curly braces
  - Apply correct naming conventions for components and files
  - Use self-closing tags correctly for void and component elements
---

React lets you build UI out of reusable pieces called **components**, and you describe what they look like with **JSX** — HTML-looking code written right inside JavaScript. If you know HTML, JSX will feel familiar fast.

## A component is just a function

A React component is a function that returns some JSX (the HTML-ish markup):

```tsx
function UserCard({ name, role }) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>{role}</p>
    </div>
  )
}
```

Two must-know rules:

- **Component names start with a capital letter** (`UserCard`, not `userCard`) — that's how React tells your components apart from plain HTML tags.
- Use **`className`** instead of `class` (because `class` is a reserved word in JavaScript).

## Putting JavaScript inside JSX

Curly braces `{}` let you drop any JavaScript value into your markup:

```tsx
function Greeting({ name, isOnline }) {
  return (
    <p>
      Hello, {name}! You are {isOnline ? 'online' : 'offline'}.
    </p>
  )
}
```

You can put variables, math, or a ternary (`condition ? a : b`) in the braces — but not full `if`/`for` statements.

> [!NOTE]
> Careful with `0`: `{count && <Badge />}` will actually print `0` on screen when count is zero. Write `{count > 0 && <Badge />}` instead.

## Returning multiple things

A component must return *one* top element. If you need siblings without adding an extra `<div>`, wrap them in an empty `<>...</>` (a "fragment"):

```tsx
return (
  <>
    <h1>Title</h1>
    <p>Subtitle</p>
  </>
)
```

## Self-close empty tags

Any tag with no children must close itself with `/>`:

```tsx
<input type="text" />
<img src={url} alt="photo" />
<UserCard />
```

## Building with components

You build an app by nesting components inside each other, like Lego:

```tsx
function App() {
  return (
    <div>
      <Header />
      <UserCard name="Alice" role="Admin" />
      <Footer />
    </div>
  )
}
```

## In one sentence

A component is a capitalized function that returns JSX (HTML-like markup), where `{}` lets you insert JavaScript, `className` replaces `class`, and empty tags self-close with `/>`.

## Want to go deeper?

Switch to **Expert** mode above for how JSX compiles to `React.createElement`, the render tree, and TypeScript prop typing.
