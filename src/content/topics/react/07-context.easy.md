---
title: Context API
order: 7
estMinutes: 12
difficulty: easy
checklist:
  - Create a context with createContext and provide it via a Provider component
  - Consume context values with useContext anywhere in the subtree
  - Explain prop drilling and when context is a better solution
  - Describe the performance trade-off of putting frequently-changing values in context
  - Decide between context, prop drilling, and an external state library for a given situation
---

Sometimes a value (like the current theme or logged-in user) is needed by lots of components scattered around your app. Passing it down through every layer of props gets tedious — that's called **prop drilling**. **Context** lets you skip the middlemen and share a value directly with any component that wants it.

## The problem: prop drilling

```tsx
// theme has to be passed through Layout and Sidebar,
// even though only ThemeButton actually uses it
<Layout theme={theme}>
  <Sidebar theme={theme}>
    <ThemeButton theme={theme} />
  </Sidebar>
</Layout>
```

Annoying — the middle components don't care about `theme`, they just pass it along.

## The fix: context

Context is like a broadcast. You set a value at the top, and any component below can tune in — no passing through the middle.

```tsx
import { createContext, useContext, useState } from 'react'

// 1. create the channel
const ThemeContext = createContext()

// 2. broadcast a value to everything inside
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// 3. tune in from anywhere below — no props needed
function ThemeButton() {
  const { theme, setTheme } = useContext(ThemeContext)
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      {theme}
    </button>
  )
}
```

Wrap your app in the provider, and `ThemeButton` reads the value directly — even if it's ten layers deep.

## Use it for the right things

Context shines for values that are truly "global" and don't change constantly:

- ✅ Theme, language, the logged-in user, feature flags.
- ❌ Fast-changing values (like mouse position) — see the warning below.
- ❌ Just 2–3 levels of passing — plain props are simpler.

> [!WARNING]
> Every component reading a context re-draws when that context's value changes. So don't put rapidly-changing data in context, or you'll re-draw a lot of components constantly. Keep context for slow-changing, app-wide values.

## In one sentence

Context lets you share a value (theme, user, language) with any component beneath a `Provider` without passing props through every layer — perfect for slow-changing, global data.

## Want to go deeper?

Switch to **Expert** mode above for the custom-hook pattern, memoizing the value, splitting contexts for performance, and when to use Zustand/Redux instead.
