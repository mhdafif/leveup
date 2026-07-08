---
title: Behavioral Patterns
order: 6
estMinutes: 15
difficulty: easy
checklist:
  - Implement Observer to decouple event producers from consumers
  - Apply the Strategy pattern to swap algorithms at runtime
  - Use Command to encapsulate actions as objects with undo support
  - Iterate a custom data structure using JavaScript's built-in Iterator protocol
  - Identify which behavioral patterns are already built into JavaScript/TypeScript
---

**Behavioral** patterns are about how parts of your code *talk to each other* and share work. The nice surprise: JavaScript has several of these baked right in, so you've been using them already.

## Observer: "let me know when something changes"

One thing changes, and others want to react — without the source needing to know who's listening. Listeners **subscribe**, and get notified on change:

```ts
const count = new Observable(0)
const unsub = count.subscribe(v => console.log('count is', v))
count.set(1)  // logs "count is 1"
unsub()       // stop listening
```

> [!NOTE]
> You already know this pattern: `addEventListener('click', ...)` is Observer. So are React state, nanostores, and Zustand. The source announces "something changed"; the listeners decide what to do.

## Strategy: swap the algorithm

When a task can be done several ways, make each way a swappable piece you can plug in:

```ts
const grid = new DataGrid(data, new QuickSort())
grid.render()
grid.setStrategy(new BucketSort())  // same job, different method
grid.render()
```

You'll see this in login systems (different auth strategies), form validation, and sortable tables.

## Command: actions as objects (with undo)

Wrap "a thing to do" into an object with `execute()` and `undo()`. Keep a list of them and you get undo/redo for free:

```ts
history.execute(new InsertCommand(editor, 'Hello'))
history.undo()   // takes it back
```

> [!TIP]
> Every Ctrl+Z you've ever pressed is this pattern. Redux actions are Commands too — little objects describing what happened.

## Iterator: step through a collection

An **iterator** lets you loop over something one item at a time without caring how it's stored inside. In JavaScript this is built in — anything that works with `for...of` (arrays, strings, `Map`, `Set`) is using it.

```ts
for (const n of range) console.log(n)   // Iterator at work
```

## In one sentence

Behavioral patterns coordinate how code interacts — **Observer** notifies listeners of changes (like event handlers), **Strategy** swaps algorithms, **Command** wraps actions as undoable objects, and **Iterator** steps through collections — and JavaScript has all four built in.

## Want to go deeper?

Switch to **Expert** mode above for full implementations of each and the JavaScript features they map to (events, `Symbol.iterator`, Redux, RxJS).
