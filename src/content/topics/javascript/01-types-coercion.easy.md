---
title: Variables, Types & Coercion
order: 1
estMinutes: 12
difficulty: easy
checklist:
  - Explain the difference between var, let, and const and when to use each
  - Name all seven primitive types and describe what each holds
  - Use typeof correctly and explain its known quirk with null
  - Distinguish == (abstract equality) from === (strict equality)
  - List at least five falsy values and explain why they matter in conditionals
  - Predict the result of a coercion expression before running it
---

Variables are labeled boxes where you store data. In JavaScript there are a few rules about how you make those boxes and what kinds of things go in them. Get these basics right and a lot of "why is my code weird?" moments disappear.

## Making variables: `const`, `let`, `var`

- **`const`** — a box you won't reassign. Use this by default.
- **`let`** — a box you *will* reassign later.
- **`var`** — the old way. Avoid it; it has confusing scope rules.

```ts
const name = 'Alice'  // won't change
let count = 0         // will change: count = count + 1
```

> [!TIP]
> `const` stops you from *reassigning* the box, but if the box holds an object you can still change what's *inside* it. `const user = {}; user.name = 'Al'` is allowed.

## The kinds of values

Most values you'll use fall into a few simple types:

| Type | Example | What it is |
|------|---------|-------|
| `string` | `"hello"` | text |
| `number` | `3.14` | any number |
| `boolean` | `true` / `false` | yes/no |
| `null` | `null` | "intentionally empty" |
| `undefined` | `undefined` | "not set yet" |

(There are two more — `symbol` and `bigint` — but you'll rarely touch them early on.) Everything else — arrays, objects, functions — is an **object**.

## Checking a type with `typeof`

```ts
typeof "hi"   // "string"
typeof 42     // "number"
typeof true   // "boolean"
typeof null   // "object"  ← a famous old bug!
```

> [!WARNING]
> `typeof null` says `"object"`, which is wrong — it's a bug from JavaScript's first week that can never be fixed. To check for null, compare directly: `value === null`.

## Comparing: always use `===`

There are two ways to compare, and one is safer:

- **`===`** checks type *and* value, with no surprises. **Use this.**
- **`==`** tries to convert types first, which leads to weird results:

```ts
0 == false      // true  😬
"" == false     // true  😬
0 === false     // false ✅ (a number is not a boolean)
```

Rule: use `===` unless you have a specific reason not to.

## Truthy and falsy

In an `if`, every value counts as either "truthy" or "falsy." There are exactly **six falsy** values — memorize these:

`false`, `0`, `""` (empty string), `null`, `undefined`, `NaN`

Everything else is truthy — *including* `[]` and `{}` (empty array and object are truthy!).

```ts
function greet(name) {
  const who = name || 'stranger'  // if name is falsy, use 'stranger'
  console.log(`Hello, ${who}`)
}
```

## In one sentence

Use `const` by default (`let` when you'll reassign), always compare with `===`, and remember the six falsy values so your `if` statements behave.

## Want to go deeper?

Switch to **Expert** mode above for the temporal dead zone, all seven primitives, `bigint`/`symbol`, and how the `||` and `&&` operators return actual values.
