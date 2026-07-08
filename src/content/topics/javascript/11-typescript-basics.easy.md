---
title: TypeScript Basics
order: 11
estMinutes: 15
difficulty: easy
checklist:
  - Add type annotations to variables, function parameters, and return types
  - Explain the difference between interface and type alias and when to prefer each
  - Write a generic function and explain what the type parameter does
  - Use union types and type narrowing to handle multiple possible types
  - Apply optional chaining (?.) and nullish coalescing (??) to handle null/undefined safely
  - Configure tsconfig.json with the most important compiler options
---

**TypeScript** is JavaScript with labels on your data. You tell it "this should be a number" or "this is a user object," and it warns you *before you run the code* if you make a mistake — like passing text where a number belongs. It's still JavaScript underneath; you just get a safety net.

## Why bother?

```ts
// Plain JS: this blows up only when you run it, if user is missing
function getName(user) {
  return user.name.toUpperCase()
}

// TypeScript: it flags the problem while you type
function getName(user: { name: string }) {
  return user.name.toUpperCase()
}
getName(null)  // ❌ TypeScript: "null isn't allowed here"
```

## Adding types

You add a type after a colon:

```ts
let count: number = 0
let message: string = 'hello'
let tags: string[] = ['ts', 'js']   // an array of strings

function add(a: number, b: number): number {
  return a + b   // the last `: number` is the return type
}
```

> [!NOTE]
> You don't have to label everything — TypeScript can often guess (`let count = 0` is clearly a number). Add labels on function inputs/outputs and let it infer the rest.

## Describing object shapes

Use `interface` to describe what an object looks like:

```ts
interface User {
  id: number
  name: string
  email?: string   // the ? means optional
}
```

## "Either/or" types

A **union** (`|`) says a value can be one of several types. TypeScript then makes you check which one you have:

```ts
function double(value: string | number) {
  if (typeof value === 'string') {
    return value + value   // it's a string here
  }
  return value * 2         // it's a number here
}
```

## Two handy safety operators

- **`?.`** (optional chaining) — safely reach into maybe-missing objects without crashing:

```ts
const city = post.author?.address?.city   // undefined if any part is missing
```

- **`??`** (nullish coalescing) — provide a fallback *only* when something is null/undefined:

```ts
const name = user.name ?? 'Anonymous'
```

> [!WARNING]
> `??` is different from `||`. `0 || 5` gives `5`, but `0 ?? 5` gives `0`. Use `??` when `0`, `""`, or `false` are valid values you want to keep.

## One setting to always turn on

In your `tsconfig.json`, set `"strict": true`. It switches on all the important safety checks — without it, you lose most of the benefit.

## In one sentence

TypeScript adds type labels to JavaScript so mistakes get caught as you type — annotate your function inputs and outputs, use `interface` for object shapes, and turn on `"strict": true`.

## Want to go deeper?

Switch to **Expert** mode above for generics, `interface` vs `type`, discriminated unions, and a full `tsconfig` breakdown.
