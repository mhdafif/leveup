---
title: Node.js Runtime & Event Loop
order: 1
estMinutes: 30
difficulty: medium
checklist:
  - Explain the call stack, microtask queue, and macrotask queue in Node.js
  - Predict the execution order of setTimeout, Promise.resolve, and process.nextTick
  - Identify CPU-blocking code and explain why it stalls the event loop
  - Use setImmediate and process.nextTick appropriately
  - Describe when to use worker_threads to offload CPU work
---

Node.js runs JavaScript on a single main thread, but it can handle many concurrent requests because I/O is asynchronous. The event loop coordinates the call stack, libuv-backed operations, microtasks, timers, and callbacks. Understanding that order makes async bugs much easier to predict.

## Execution Order

Synchronous code runs first on the call stack. After the stack clears, Node drains `process.nextTick`, then Promise microtasks, then moves through timer and I/O phases.

```ts
console.log("sync start");

setTimeout(() => console.log("timeout"), 0);
setImmediate(() => console.log("immediate"));

Promise.resolve().then(() => console.log("promise"));
process.nextTick(() => console.log("nextTick"));

console.log("sync end");
```

The typical output begins with `sync start`, `sync end`, `nextTick`, and `promise`. The exact ordering of `setTimeout(..., 0)` and `setImmediate` can depend on where they are scheduled, especially around I/O callbacks.

## Blocking The Loop

Async I/O does not help if your JavaScript blocks the event loop with CPU work. While a synchronous loop hashes data, compresses images, or parses huge files, no other request handler can run.

```ts
export function expensiveSum(limit: number): number {
  let total = 0;
  for (let index = 0; index < limit; index += 1) {
    total += Math.sqrt(index);
  }
  return total;
}
```

That function monopolizes the main thread until it finishes. For CPU-heavy work, use `worker_threads`, a job queue, or a separate service. Use `process.nextTick` sparingly for callbacks that must run before the event loop continues; overusing it can starve I/O. Use `setImmediate` when you want to yield and continue after the current poll phase.

## Libuv And Async I/O

libuv provides the cross-platform event loop and thread pool behind file system operations, DNS work, and networking. Node can wait for sockets without dedicating one JavaScript thread per connection, which is why it works well for I/O-heavy APIs.

> [!NOTE]
> process.nextTick fires before Promises. Both fire before setTimeout. Understanding this ordering prevents subtle async bugs.

## Further Learning

Search these terms to go deeper:
- **"Node.js event loop phases"** — timers, poll, check, close callbacks, and microtasks
- **"process.nextTick vs Promise Node"** — priority ordering and starvation risks
- **"libuv thread pool Node.js"** — what work happens outside the main thread
- **"worker_threads CPU bound Node"** — moving expensive computation off the event loop
