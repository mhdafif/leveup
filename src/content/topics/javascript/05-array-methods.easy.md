---
title: Array Methods
order: 5
estMinutes: 15
difficulty: easy
checklist:
  - Use map, filter, and reduce to transform arrays without mutation
  - Chain multiple array methods and explain when chaining is appropriate
  - Explain sort's default behaviour and how to fix it for numbers
  - Distinguish slice (non-mutating) from splice (mutating)
  - Use flat and flatMap to work with nested arrays
  - Choose the right method for finding, testing, or iterating elements
---

Arrays are lists, and JavaScript gives you handy tools to reshape those lists without writing loops. The three you'll use most are `map`, `filter`, and `reduce`. Learn these and a huge amount of everyday code becomes short and readable.

## The big three

```ts
const prices = [10, 25, 5, 40, 15]

// map — do something to EVERY item, get a new list of the same size
const withTax = prices.map(p => p * 1.1)
// [11, 27.5, 5.5, 44, 16.5]

// filter — KEEP only items that pass a test, get a shorter list
const cheap = prices.filter(p => p < 20)
// [10, 5, 15]

// reduce — SQUASH the list down to one value
const total = prices.reduce((sum, p) => sum + p, 0)
// 95
```

A memory aid: **map** transforms, **filter** selects, **reduce** combines.

> [!NOTE]
> None of these change the original array — they hand you a *new* one. That's why they're safe and easy to chain.

## Chaining them

Because `map` and `filter` return arrays, you can line them up:

```ts
const names = products
  .filter(p => p.inStock)      // only in-stock
  .filter(p => p.price < 20)   // only cheap
  .map(p => p.name)            // just the names
```

Reads almost like English, top to bottom.

## Finding and testing

```ts
const nums = [1, 2, 3, 4, 5]

nums.find(n => n > 3)      // 4     — first match
nums.some(n => n > 4)      // true  — is ANY over 4?
nums.every(n => n > 0)     // true  — are ALL over 0?
nums.includes(3)           // true  — is 3 in there?
```

## The `sort` surprise

`sort` does two sneaky things: it changes the original array, and it sorts as *text* by default:

```ts
[10, 2, 21, 1].sort()          // [1, 10, 2, 21] — wrong! sorted like words
[10, 2, 21, 1].sort((a, b) => a - b)  // [1, 2, 10, 21] — correct numbers
```

> [!WARNING]
> `sort` changes the original array. To keep the original, copy first: `[...arr].sort((a, b) => a - b)`.

## In one sentence

Use `map` to transform a list, `filter` to keep some items, and `reduce` to combine them into one value — all without touching the original array (unlike `sort`, which does change it).

## Want to go deeper?

Switch to **Expert** mode above for `reduce` deep-dives, `slice` vs `splice`, `flat`/`flatMap`, and chaining performance.
