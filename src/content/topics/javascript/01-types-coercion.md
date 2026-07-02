---
title: Variables, Types & Coercion
order: 1
estMinutes: 20
difficulty: easy
checklist:
  - Explain the difference between var, let, and const and when to use each
  - Name all seven primitive types and describe what each holds
  - Use typeof correctly and explain its known quirk with null
  - Distinguish == (abstract equality) from === (strict equality)
  - List at least five falsy values and explain why they matter in conditionals
  - Predict the result of a coercion expression before running it
---

JavaScript has **eight data types**: seven primitives and one non-primitive. Getting this model right from the start prevents entire classes of bugs and makes coercion predictable instead of mysterious.

## var, let, and const

`var` is function-scoped and hoisted to the top of its containing function — it exists (as `undefined`) before the line that declares it. `let` and `const` are block-scoped and exist in a **temporal dead zone** (TDZ) from the start of the block until the declaration line is reached; accessing them in the TDZ throws a `ReferenceError`.

```ts
console.log(a); // undefined (hoisted)
var a = 1;

console.log(b); // ReferenceError (TDZ)
let b = 2;
```

Prefer `const` by default. Use `let` when you need to reassign. Avoid `var` in modern code — its function-level scoping causes subtle bugs in loops and callbacks.

> [!TIP]
> `const` prevents *reassignment*, not *mutation*. An object declared with `const` can still have its properties changed; only the binding itself is locked.

## The Seven Primitive Types

| Type | Example | Notes |
|------|---------|-------|
| `string` | `"hello"` | Immutable sequence of UTF-16 code units |
| `number` | `3.14`, `NaN`, `Infinity` | 64-bit IEEE 754 float; no separate integer type |
| `boolean` | `true`, `false` | — |
| `null` | `null` | Intentional absence of a value |
| `undefined` | `undefined` | Variable declared but not assigned |
| `symbol` | `Symbol("id")` | Unique, non-string key |
| `bigint` | `9007199254740993n` | Arbitrary-precision integers |

Everything else — arrays, objects, functions, dates — is an `object`.

## typeof and its quirk

```ts
typeof "hi"        // "string"
typeof 42          // "number"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof Symbol()    // "symbol"
typeof 42n         // "bigint"
typeof {}          // "object"
typeof []          // "object"   ← arrays are objects
typeof null        // "object"   ← historical bug, never fixed
typeof function(){} // "function" ← functions get a special tag
```

> [!WARNING]
> `typeof null === "object"` is a legacy bug from JavaScript's first week. Check for null explicitly: `value === null`.

## == vs ===

`===` (strict equality) requires the same type *and* the same value — no coercion happens. `==` (abstract equality) first runs a type coercion algorithm before comparing, which produces genuinely surprising results:

```ts
0 == false     // true  — false coerces to 0
"" == false    // true  — both coerce to 0
null == undefined // true  — the one deliberate exception
null == 0      // false — null only loosely equals undefined
NaN == NaN     // false — NaN is never equal to anything
```

Always use `===` unless you specifically need the `null == undefined` behaviour (e.g., checking if a value is either).

## Truthy and Falsy

Every value is either truthy or falsy when evaluated in a boolean context (an `if` condition, a `&&` / `||` expression, a ternary).

**Falsy values** — exactly these six:
- `false`
- `0` (and `-0`, `0n`)
- `""` (empty string)
- `null`
- `undefined`
- `NaN`

Everything else — including `[]`, `{}`, and `"false"` — is truthy.

```ts
// Guard pattern
function greet(name?: string) {
  const display = name || "stranger"; // falsy name falls back
  console.log(`Hello, ${display}`);
}
```

> [!NOTE]
> The `||` operator returns the first truthy value or the last value; `&&` returns the first falsy value or the last value. Neither returns a boolean — they return the actual operands.

## Further Learning

Search these terms to go deeper:
- **"You Don't Know JS: Types & Grammar"** — Kyle Simpson's authoritative deep-dive into JS types (free on GitHub)
- **"JavaScript type coercion explained"** on freeCodeCamp — thorough walkthrough of the Abstract Equality Comparison algorithm
- **"MDN: Equality comparisons and sameness"** — official reference covering ==, ===, and Object.is
- **"temporal dead zone JavaScript"** — MDN or articles explaining TDZ mechanics in detail
- **"IEEE 754 floating point"** — understanding why `0.1 + 0.2 !== 0.3` in any language using this standard
