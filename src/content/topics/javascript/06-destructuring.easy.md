---
title: Destructuring & Spread
order: 6
estMinutes: 12
difficulty: easy
checklist:
  - Destructure arrays and objects in variable declarations and function parameters
  - Apply default values in destructuring patterns
  - Rename a destructured property to a different local variable name
  - Use rest syntax in destructuring to collect remaining elements
  - Spread an array or object into a function call or new array/object literal
  - Explain the difference between rest (collects) and spread (expands)
---

**Destructuring** is a shortcut for pulling values out of arrays and objects, and **spread** (`...`) is a shortcut for copying or combining them. Both make your code shorter and are everywhere in modern JavaScript.

## Unpacking objects

Instead of grabbing properties one at a time, unpack several at once:

```ts
const user = { id: 1, name: 'Alice', role: 'admin' }

// the long way
const name = user.name
const role = user.role

// destructuring — same result, one line
const { name, role } = user
```

You can also give defaults and rename:

```ts
const { name, age = 25 } = user          // age falls back to 25 if missing
const { name: userName } = user          // put user.name into `userName`
```

## Unpacking arrays

```ts
const rgb = [255, 128, 0]
const [r, g, b] = rgb   // r=255, g=128, b=0

// bonus: swap two variables with no temp
let x = 1, y = 2
;[x, y] = [y, x]        // x=2, y=1
```

## The neatest use: function options

Destructuring parameters makes functions self-explanatory:

```ts
function connect({ host, port = 443 }) {
  return `${host}:${port}`
}
connect({ host: 'example.com' })  // "example.com:443"
```

## Spread: copy and combine

`...` spreads the contents of one array/object into another — great for making copies or merging:

```ts
const nums = [1, 2, 3]
const more = [...nums, 4, 5]   // [1, 2, 3, 4, 5]

const defaults = { theme: 'dark', lang: 'en' }
const prefs = { lang: 'fr' }
const merged = { ...defaults, ...prefs }
// { theme: 'dark', lang: 'fr' } — later one wins on conflicts
```

> [!WARNING]
> Spread makes a **shallow** copy — the top level is new, but nested objects inside are still shared with the original. Change a nested value and both "copies" see it.

## Rest: gather the leftovers

The same `...` on the *left* side gathers whatever's left into one variable:

```ts
const [first, ...others] = [1, 2, 3, 4]   // first=1, others=[2,3,4]
const { id, ...rest } = user              // rest = everything except id
```

Quick rule: `...` on the **right** spreads things out; `...` on the **left** gathers them up.

## In one sentence

Destructuring unpacks values out of objects and arrays in one line, and `...` either spreads items into a new copy/merge or gathers leftovers — just remember spread copies only the top level.

## Want to go deeper?

Switch to **Expert** mode above for nested destructuring, an `omit` helper, and the finer points of rest vs spread.
