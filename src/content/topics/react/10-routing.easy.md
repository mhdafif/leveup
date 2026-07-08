---
title: Client-side Routing
order: 10
estMinutes: 15
difficulty: easy
checklist:
  - Explain what client-side routing is and why SPAs need it
  - Set up React Router v6 with BrowserRouter, Routes, and Route
  - Navigate programmatically with useNavigate and declaratively with Link
  - Read URL parameters with useParams and query strings with useSearchParams
  - Implement a protected route pattern for authenticated pages
---

A single-page React app loads once, then swaps content as you click around — no full page reloads. But you still want different URLs for different pages (`/about`, `/users/42`) and the back button to work. **React Router** makes that happen.

## Setting up routes

You list your pages as `Route`s, each mapping a URL path to a component:

```tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- `<Link>` is like an `<a>` but navigates *without* reloading the page.
- `path="*"` is the catch-all for "page not found" (404).

## Reading a value from the URL

A `:userId` in the path is a placeholder you can read with `useParams`:

```tsx
// Route: <Route path="/users/:userId" element={<UserPage />} />

function UserPage() {
  const { userId } = useParams()   // grabs the id from the URL
  return <h1>User {userId}</h1>
}
```

## Navigating in code

Sometimes you want to redirect after something happens (like a successful login). Use `useNavigate`:

```tsx
const navigate = useNavigate()

async function handleLogin() {
  await login()
  navigate('/dashboard')   // go to the dashboard
}
```

## Protecting pages

To keep certain pages behind a login, wrap them in a small guard that redirects logged-out users:

```tsx
function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}
```

> [!TIP]
> If you use a full framework like **Next.js** or **Astro**, it comes with its *own* routing — you wouldn't add React Router. React Router is for standalone React apps (like Vite ones).

## In one sentence

React Router swaps pages without reloading — define `Route`s mapping paths to components, use `<Link>` to navigate, `useParams` to read URL values like an id, and `useNavigate` to redirect in code.

## Want to go deeper?

Switch to **Expert** mode above for nested routes with `Outlet`, query strings, the full protected-route pattern, and TanStack Router.
