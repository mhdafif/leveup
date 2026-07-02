---
title: Destructuring & Spread
order: 6
estMinutes: 20
difficulty: easy
checklist:
  - Destructure arrays and objects in variable declarations and function parameters
  - Apply default values in destructuring patterns
  - Rename a destructured property to a different local variable name
  - Use rest syntax in destructuring to collect remaining elements
  - Spread an array or object into a function call or new array/object literal
  - Explain the difference between rest (collects) and spread (expands)
---

Destructuring and the spread/rest syntax are concise patterns introduced in ES6 that eliminate a lot of repetitive property access and array indexing. They show up constantly in modern JavaScript and TypeScript.

## Array Destructuring

```ts
const rgb = [255, 128, 0];

// Without destructuring
const red = rgb[0];
const green = rgb[1];

// With destructuring
const [r, g, b] = rgb;

// Skip elements with a hole
const [first, , third] = [10, 20, 30]; // first=10, third=30

// Swap values without a temp variable
let x = 1, y = 2;
[x, y] = [y, x]; // x=2, y=1
```

## Object Destructuring

```ts
const user = { id: 1, name: "Alice", role: "admin" };

// Basic
const { name, role } = user;

// Rename: `role` becomes `userRole` locally
const { name: userName, role: userRole } = user;

// Default values — used only when the property is undefined
const { name: n, age = 25 } = user; // age defaults to 25
```

## Destructuring in Function Parameters

One of the most common uses — it makes function signatures self-documenting:

```ts
interface Config {
  host: string;
  port?: number;
  secure?: boolean;
}

function connect({ host, port = 443, secure = true }: Config): string {
  return `${secure ? "https" : "http"}://${host}:${port}`;
}

connect({ host: "example.com" });
// "https://example.com:443"
```

> [!TIP]
> When a function takes more than two or three arguments, consider accepting a single options object and destructuring it. This makes call sites more readable and arguments order-independent.

## Rest in Destructuring

The **rest** element (`...name`) collects everything not already extracted:

```ts
// Array rest — must be last
const [head, ...tail] = [1, 2, 3, 4];
// head=1, tail=[2, 3, 4]

// Object rest — collects remaining own enumerable properties
const { id, ...rest } = { id: 1, name: "Alice", role: "admin" };
// id=1, rest={ name: "Alice", role: "admin" }
```

A common pattern is to use object rest to strip specific keys without mutation:

```ts
function omit<T extends object, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  const { ...copy } = obj;
  for (const key of keys) delete (copy as Record<string, unknown>)[key as string];
  return copy as Omit<T, K>;
}
```

## Spread

The **spread** operator (`...`) expands an iterable into individual elements. It is the inverse of rest.

```ts
// Spread into function arguments
const nums = [1, 2, 3];
Math.max(...nums); // same as Math.max(1, 2, 3) → 3

// Spread to copy/merge arrays (non-mutating)
const combined = [...nums, 4, 5];         // [1, 2, 3, 4, 5]
const copy = [...nums];                   // shallow copy

// Spread to copy/merge objects (non-mutating)
const defaults = { theme: "dark", lang: "en" };
const userPrefs = { lang: "fr", fontSize: 14 };
const merged = { ...defaults, ...userPrefs };
// { theme: "dark", lang: "fr", fontSize: 14 }
// later spreads win on duplicate keys
```

> [!WARNING]
> Spread creates a **shallow** copy. Nested objects and arrays are still shared by reference between the original and the copy.

## Nested Destructuring

You can destructure as deeply as the data goes:

```ts
const response = {
  status: 200,
  data: {
    user: { id: 42, name: "Bob" },
    permissions: ["read", "write"],
  },
};

const {
  data: {
    user: { name },
    permissions: [firstPerm],
  },
} = response;

// name = "Bob", firstPerm = "read"
```

> [!NOTE]
> Deep destructuring in one line can become hard to read. If the structure is complex, consider intermediate variables.

## Further Learning

Search these terms to go deeper:
- **"MDN: Destructuring assignment"** — comprehensive reference with all edge cases
- **"ES6 destructuring patterns"** on Axel Rauschmayer's exploringjs.com — the most thorough free resource
- **"JavaScript spread vs rest"** — many good short articles clarifying the same syntax in different positions
- **"Object rest spread proposal TC39"** — useful background on how this landed in the spec
- **"TypeScript destructuring types"** — how TypeScript infers and annotates destructured bindings
