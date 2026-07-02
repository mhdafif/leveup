---
title: Stacks & Queues
order: 7
estMinutes: 25
difficulty: easy
checklist:
  - Explain LIFO (stack) and FIFO (queue) in your own words with real-world examples
  - Implement a stack using a TypeScript array
  - Implement a queue using a TypeScript array
  - List three real use cases for stacks and three for queues
  - Understand why Array.shift() is O(n) and how to work around it for queues
  - Trace through a stack-based bracket-matching algorithm
---

Stacks and queues are the simplest and most widely-used abstract data structures after the array. They're constrained versions of a list — you can only add and remove from specific ends — and that constraint is what makes them useful. Restricting access forces a specific ordering that maps naturally onto real problems.

## Stack — Last In, First Out (LIFO)

A stack works like a physical stack of plates: you add (push) to the top and remove (pop) from the top. The last item pushed is always the first item popped.

**Real-world analogies:** undo history in a text editor, the browser back button, the call stack (function calls), parenthesis matching.

```ts
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}
```

### Stack Use Case: Bracket Matching

```ts
function isBalanced(s: string): boolean {
  const stack = new Stack<string>();
  const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };

  for (const char of s) {
    if ('([{'.includes(char)) {
      stack.push(char);
    } else if (')]}'.includes(char)) {
      if (stack.pop() !== pairs[char]) return false;
    }
  }

  return stack.isEmpty();
}

isBalanced("({[]})"); // true
isBalanced("([)]");   // false
```

> [!TIP]
> Any time you see "undo", "back", "reverse", or "matching pairs" in a problem description, reach for a stack. They're the right tool for maintaining history and checking nesting.

## Queue — First In, First Out (FIFO)

A queue works like a checkout line: you add (enqueue) to the back and remove (dequeue) from the front. The first item added is the first item removed.

**Real-world analogies:** printer job queue, customer service call queue, BFS traversal (see the BFS & DFS lesson), task scheduling.

```ts
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);  // add to back — O(1)
  }

  dequeue(): T | undefined {
    return this.items.shift(); // remove from front — O(n) ⚠️
  }

  front(): T | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}
```

> [!WARNING]
> `Array.shift()` is O(n) because it removes the first element and shifts every remaining element left. For high-performance queues, use a **circular buffer** or a **doubly linked list** where both ends are O(1). In most coding problems and interviews, the simple array-based queue is fine.

## The Performance Picture

| Operation | Stack (array) | Queue (array) | Queue (linked list) |
|---|---|---|---|
| Add | O(1) push | O(1) push | O(1) append |
| Remove | O(1) pop | O(n) shift | O(1) removeHead |
| Peek | O(1) | O(1) | O(1) |
| Search | O(n) | O(n) | O(n) |

## When to Use Which

| Use a Stack when... | Use a Queue when... |
|---|---|
| Order of processing must reverse the order of arrival | Order of processing must match order of arrival |
| Tracking "open" items that need a matching "close" | Processing items fairly in the order they appeared |
| Navigating back through history | Breadth-first search traversal |
| Evaluating nested expressions | Simulating real-world wait lines |

> [!NOTE]
> JavaScript's `Array` type can serve as both a stack and a queue because it supports `push`, `pop`, `shift`, and `unshift`. In practice, you won't usually create a dedicated Stack or Queue class — you'll just use an array with the appropriate methods for your access pattern.

## Further Learning

Search these terms to go deeper:
- **"Stack vs queue interview problems leetcode"** — practice problems that require choosing the right structure
- **"Circular buffer queue implementation"** — O(1) dequeue without a linked list
- **"Monotonic stack pattern interview"** — advanced stack technique for "next greater element" problems
- **"BFS breadth first search queue"** — the canonical queue use case (covered in lesson 09)
