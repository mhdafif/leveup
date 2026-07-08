---
title: Stacks & Queues
order: 7
estMinutes: 12
difficulty: easy
checklist:
  - Explain LIFO (stack) and FIFO (queue) in your own words with real-world examples
  - Implement a stack using a TypeScript array
  - Implement a queue using a TypeScript array
  - List three real use cases for stacks and three for queues
  - Understand why Array.shift() is O(n) and how to work around it for queues
  - Trace through a stack-based bracket-matching algorithm
---

**Stacks** and **queues** are two of the most common ways to organize items. The only difference is *which end* you take things from — and that one rule makes each perfect for different jobs.

## Stack — Last In, First Out (LIFO)

A stack is a pile of plates: you add to the top and take from the top. The **last** thing you put on is the **first** thing you take off.

Real examples: the **undo** button, the browser **back** button, nested brackets.

```ts
const stack = []
stack.push('a')   // add to top
stack.push('b')
stack.pop()       // 'b' — removes the last one added
```

> [!TIP]
> See "undo," "back," "reverse," or "matching pairs" in a problem? Reach for a stack.

### A classic stack use: matching brackets

To check if brackets are balanced, push each opener, and when you hit a closer, pop and make sure it matches:

```ts
function isBalanced(s) {
  const stack = []
  const pairs = { ')': '(', ']': '[', '}': '{' }
  for (const ch of s) {
    if ('([{'.includes(ch)) stack.push(ch)
    else if (stack.pop() !== pairs[ch]) return false
  }
  return stack.length === 0
}
isBalanced('({[]})')  // true
isBalanced('([)]')    // false
```

## Queue — First In, First Out (FIFO)

A queue is a checkout line: you join the back and get served from the front. The **first** person in line is the **first** served — fair order.

Real examples: a printer's job list, tasks waiting to run, people in a support queue.

```ts
const queue = []
queue.push('a')     // join the back
queue.push('b')
queue.shift()       // 'a' — the first one leaves
```

> [!WARNING]
> `shift()` (removing from the front) is secretly slow — O(n) — because every remaining item has to slide forward one spot. It's fine for small lists and interviews, but for big high-speed queues there are faster structures.

## Which one do I use?

- **Stack** when newer items should be handled first, or you're tracking "open" things that need a matching "close" (undo, brackets, history).
- **Queue** when items should be handled in the order they arrived (waiting lines, task scheduling, fair processing).

## In one sentence

A stack is last-in-first-out (like a pile of plates — great for undo and matching brackets), and a queue is first-in-first-out (like a checkout line — great for fair, in-order processing).

## Want to go deeper?

Switch to **Expert** mode above for reusable `Stack`/`Queue` classes, the full performance table, and faster queue implementations.
