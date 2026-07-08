---
title: Promises & async/await
order: 8
estMinutes: 15
difficulty: easy
checklist:
  - Describe the three states of a Promise and the transitions between them
  - Chain .then and .catch correctly, explaining what each returns
  - Convert a callback-based API to a Promise-returning function
  - Use async/await with proper try/catch error handling
  - Choose between Promise.all, Promise.race, and Promise.allSettled for different coordination needs
  - Identify and fix common async mistakes (floating promises, sequential awaits that could be parallel)
---

Some things in code take time — fetching data, waiting for a timer. A **Promise** is an "I'll get back to you" ticket for a value that isn't ready yet. **async/await** is the friendly syntax that lets you wait for that ticket without your page freezing.

## A Promise has three moods

- **Pending** — still working on it.
- **Fulfilled** — done, here's your value. 🎉
- **Rejected** — something went wrong. ❌

Once it's fulfilled or rejected, it's settled and won't change again.

## The easy way: async/await

`await` means "wait right here for the answer, then keep going." It only works inside a function marked `async`:

```ts
async function loadProfile(id) {
  const user = await fetchUser(id)   // wait for the user
  return `Profile: ${user.name}`
}
```

To handle errors, wrap it in `try/catch` — just like normal code:

```ts
async function loadProfile(id) {
  try {
    const user = await fetchUser(id)
    return user.name
  } catch (err) {
    console.error('Failed to load:', err)
  }
}
```

## The older way: .then / .catch

Before `async/await`, you chained `.then` for success and `.catch` for errors. You'll still see this:

```ts
fetchUser(1)
  .then(user => console.log(user.name))
  .catch(err => console.error(err))
```

Same idea, just a different look. `async/await` is usually easier to read.

## Doing things at the same time

If two tasks don't depend on each other, run them together instead of one-after-another — it's much faster:

```ts
// Slow: 200ms (waits for A, THEN starts B)
const a = await fetchA()
const b = await fetchB()

// Fast: ~100ms (both start at once)
const [a, b] = await Promise.all([fetchA(), fetchB()])
```

`Promise.all` waits for *all* of them to finish and gives you all the results.

> [!CAUTION]
> Because `await` makes async code *look* like normal step-by-step code, it's easy to accidentally wait for things one at a time. If two awaits don't depend on each other, use `Promise.all` to run them together.

## In one sentence

A Promise is a ticket for a value coming later; use `async`/`await` with `try/catch` to wait for it cleanly, and `Promise.all` to run independent tasks at the same time.

## Want to go deeper?

Switch to **Expert** mode above for creating your own Promises, `Promise.race` and `allSettled`, and the floating-promise pitfall.
