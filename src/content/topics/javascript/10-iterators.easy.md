---
title: Iterators & Generators
order: 10
estMinutes: 15
difficulty: easy
checklist:
  - Explain the iterable protocol and implement Symbol.iterator on a custom object
  - Use for...of on built-in iterables and explain why it works
  - Write a generator function using function* and yield
  - Explain what yield returns and how to pass values back into a generator
  - Build a lazy infinite sequence with a generator
  - Identify a practical use case where generators reduce memory usage vs arrays
---

You already loop over lists with `for...of`. **Iterators** are the quiet machinery that makes that possible, and **generators** are an easy way to build your own "give me one value at a time" sequences. The big win: you can produce values *lazily* — only when asked — instead of building a giant list up front.

## Looping the easy way

`for...of` walks through anything list-like — arrays, strings, Maps, Sets:

```ts
for (const n of [1, 2, 3]) console.log(n)   // 1, 2, 3
for (const ch of 'hi') console.log(ch)       // h, i
```

Behind the scenes, these things know how to hand out their items one by one. That "hand out one at a time" ability is what makes them *iterable*.

## Generators: make your own sequence

A **generator** is a special function (note the `*`) that can pause and resume. Each `yield` hands back one value and waits until you ask for the next:

```ts
function* count(start, end) {
  for (let i = start; i <= end; i++) {
    yield i   // give one value, then pause here
  }
}

for (const n of count(1, 3)) {
  console.log(n)   // 1, 2, 3
}
```

You can also pull values manually:

```ts
const g = count(1, 3)
g.next()  // { value: 1, done: false }
g.next()  // { value: 2, done: false }
```

## Why this is cool: infinite lists (safely)

Because a generator only makes values when asked, it can represent an *endless* sequence without running out of memory:

```ts
function* naturals() {
  let n = 0
  while (true) yield n++   // never ends...
}

// ...but we only take what we need
const g = naturals()
g.next().value  // 0
g.next().value  // 1
```

An array of "all numbers" would be impossible. A generator handles it fine, because it pauses after each value.

## Where you'd use it

- Reading a huge file line by line without loading it all at once.
- Fetching pages of API results, grabbing the next page only when needed.
- Any time building the whole list up front would waste memory.

## In one sentence

`for...of` works because things are *iterable* (they hand out items one at a time), and a generator (`function*` with `yield`) is the easy way to build your own lazy sequence — even an infinite one — producing values only when asked.

## Want to go deeper?

Switch to **Expert** mode above for implementing `Symbol.iterator` by hand, two-way communication with `yield`, and real-world uses like Redux-Saga.
