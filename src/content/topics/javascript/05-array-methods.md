---
title: Array Methods
order: 5
estMinutes: 25
difficulty: easy
checklist:
  - Use map, filter, and reduce to transform arrays without mutation
  - Chain multiple array methods and explain when chaining is appropriate
  - Explain sort's default behaviour and how to fix it for numbers
  - Distinguish slice (non-mutating) from splice (mutating)
  - Use flat and flatMap to work with nested arrays
  - Choose the right method for finding, testing, or iterating elements
---

JavaScript arrays ship with a rich set of higher-order methods that let you transform, search, and aggregate data declaratively. Knowing when to reach for each one — and which methods mutate the original array versus which return new ones — is essential everyday JavaScript.

## Transforming: map, filter, reduce

These three are the backbone of functional array programming:

```ts
const prices = [10, 25, 5, 40, 15];

// map — transform each element, return new array of same length
const withTax = prices.map((p) => p * 1.1);
// [11, 27.5, 5.5, 44, 16.5]

// filter — keep elements that pass a test, return new (shorter) array
const affordable = prices.filter((p) => p < 20);
// [10, 5, 15]

// reduce — accumulate elements into a single value
const total = prices.reduce((acc, p) => acc + p, 0);
// 95
```

> [!NOTE]
> None of these mutate the original array. They each return a new value, which is why they compose well.

## Chaining Pattern

Because `map` and `filter` return arrays, you can chain them directly:

```ts
interface Product {
  name: string;
  price: number;
  inStock: boolean;
}

const products: Product[] = [
  { name: "Widget", price: 9.99, inStock: true },
  { name: "Gadget", price: 49.99, inStock: false },
  { name: "Doohickey", price: 4.99, inStock: true },
];

const affordableNames = products
  .filter((p) => p.inStock)
  .filter((p) => p.price < 20)
  .map((p) => p.name.toUpperCase());
// ["WIDGET", "DOOHICKEY"]
```

For large arrays with many chain steps, consider a single `reduce` or a library like Lodash's lazy chains to avoid creating many intermediate arrays.

## Searching and Testing

```ts
const nums = [1, 2, 3, 4, 5];

// find — first element matching predicate, or undefined
nums.find((n) => n > 3);     // 4

// findIndex — index of first match, or -1
nums.findIndex((n) => n > 3); // 3

// some — true if at least one element passes
nums.some((n) => n > 4);     // true

// every — true only if ALL elements pass
nums.every((n) => n > 0);    // true
nums.every((n) => n > 2);    // false

// includes — true if value is present (uses SameValueZero)
nums.includes(3);             // true
```

## forEach

`forEach` iterates for side effects. It always returns `undefined` — you cannot break out of it early and it cannot be chained.

```ts
const log: string[] = [];
nums.forEach((n) => log.push(`item ${n}`));
// Use for when you genuinely want side effects; prefer map/filter otherwise
```

> [!TIP]
> If you find yourself pushing into an array inside `forEach`, that is a signal to use `map` instead.

## sort Gotcha

`Array.prototype.sort` sorts **in place** (mutating!) and converts elements to strings by default:

```ts
[10, 2, 21, 1].sort(); // [1, 10, 2, 21] — lexicographic, not numeric!

// Correct numeric sort:
[10, 2, 21, 1].sort((a, b) => a - b); // [1, 2, 10, 21]

// Descending:
[10, 2, 21, 1].sort((a, b) => b - a); // [21, 10, 2, 1]
```

> [!WARNING]
> `sort` mutates the original array. To sort without mutation: `[...arr].sort(compareFn)`.

## slice vs splice

| | `slice` | `splice` |
|--|---------|---------|
| Mutates original? | No | Yes |
| Returns | New sub-array | Removed elements |
| Arguments | `(start, end)` | `(start, deleteCount, ...itemsToInsert)` |

```ts
const arr = [1, 2, 3, 4, 5];

arr.slice(1, 3);   // [2, 3] — arr unchanged
arr.splice(1, 2);  // returns [2, 3] — arr is now [1, 4, 5]
```

## flat and flatMap

```ts
const nested = [[1, 2], [3, [4, 5]]];

nested.flat();    // [1, 2, 3, [4, 5]] — one level deep
nested.flat(2);   // [1, 2, 3, 4, 5]  — two levels
nested.flat(Infinity); // fully flatten any depth

// flatMap = map then flat(1) — useful to avoid double iteration
const sentences = ["hello world", "foo bar"];
sentences.flatMap((s) => s.split(" "));
// ["hello", "world", "foo", "bar"]
```

## Further Learning

Search these terms to go deeper:
- **"MDN: Array"** — the canonical reference for every array method with examples
- **"JavaScript reduce explained"** — many good articles; Mosh Hamedani's and the "Reduce — A Guided Meditation" piece are popular
- **"JavaScript array chaining performance"** — when chaining creates too many intermediates and when to switch strategies
- **"JavaScript sort stability"** — modern engines guarantee stable sort (V8 since Node 11); older ones did not
- **"You Don't Know JS: Types & Grammar"** — chapter on arrays covers coercion in array contexts
