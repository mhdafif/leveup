---
title: Error Handling
order: 9
estMinutes: 12
difficulty: easy
checklist:
  - Use try/catch/finally correctly and explain what each block does
  - Identify the built-in Error subtypes and when each is thrown
  - Create and throw a custom Error subclass with extra context
  - Handle errors in async/await code and in Promise chains
  - Explain the difference between recoverable errors and programming mistakes
  - Decide when to throw, when to return an error value, and when to log and continue
---

Things go wrong: the internet drops, a user types nonsense, code has bugs. Good **error handling** means your app bends instead of breaking — it catches the problem, does something sensible, and keeps going.

## try / catch / finally

Wrap risky code in `try`. If it fails, `catch` runs instead of crashing. `finally` runs no matter what:

```ts
try {
  const data = JSON.parse(rawInput)  // might fail on bad input
  process(data)
} catch (err) {
  console.error('Something went wrong:', err)
} finally {
  cleanup()  // always runs — good for closing things
}
```

Think of it as: "**try** this; if it breaks, **catch** it here; and **finally**, always do this cleanup."

## Throwing your own errors

You can raise an error on purpose with `throw` when something isn't valid:

```ts
function getUser(id) {
  if (!id) {
    throw new Error('User id is required')
  }
  // ...
}
```

The nearest `catch` up the call chain will receive it.

## The common built-in errors

JavaScript throws a few types automatically. You'll recognize these from real bugs:

| Error | Usually means |
|------|------------|
| `TypeError` | You used the wrong kind of value (e.g. called something that isn't a function, or read a property of `null`) |
| `SyntaxError` | Broken syntax, like bad JSON |
| `ReferenceError` | You used a variable that doesn't exist |

## Errors in async code

With `async/await`, error handling looks exactly the same — just `try/catch`:

```ts
async function loadData() {
  try {
    const res = await fetch('/api/data')
    if (!res.ok) throw new Error(`Server said ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error('Load failed:', err)
  }
}
```

> [!WARNING]
> Remember `fetch` doesn't throw on a 404 or 500 — it only throws when the network itself fails. Check `res.ok` and throw yourself, as above.

## When to throw vs. handle gently

- **Throw** when something is truly broken or unexpected (a real bug, a missing required value).
- **Handle and continue** when failure is normal and expected (a search returned nothing, an optional field is missing) — don't crash the app over routine cases.

## In one sentence

Wrap risky code in `try/catch` (with `finally` for cleanup), `throw` your own errors when inputs are invalid, and remember async errors are caught the same way — just check `res.ok` after a `fetch`.

## Want to go deeper?

Switch to **Expert** mode above for custom `Error` subclasses, the full built-in error list, and the Result pattern for expected failures.
