---
title: Node.js Runtime & Event Loop
order: 1
estMinutes: 15
difficulty: easy
checklist:
  - Explain the call stack, microtask queue, and macrotask queue in Node.js
  - Predict the execution order of setTimeout, Promise.resolve, and process.nextTick
  - Identify CPU-blocking code and explain why it stalls the event loop
  - Use setImmediate and process.nextTick appropriately
  - Describe when to use worker_threads to offload CPU work
---

Node.js runs your JavaScript on a **single thread** — one lane. Yet it can juggle thousands of requests at once. How? Because it never *waits* around for slow things (like reading a file or a database) — it hands that off and moves on to the next task while waiting.

## The order things run in

Regular code runs first. Then Node quickly checks a couple of "priority" queues before getting to timers:

```ts
console.log('sync start')
setTimeout(() => console.log('timeout'), 0)
Promise.resolve().then(() => console.log('promise'))
console.log('sync end')

// order: sync start, sync end, promise, timeout
```

The rule of thumb: **regular code first, then Promises, then timers** (`setTimeout`) — even a `setTimeout(fn, 0)` waits until after any pending Promises.

## The one thing that breaks everything: blocking the thread

Since there's only one lane, if your code does a big chunk of heavy math *synchronously*, **nothing else can run** until it finishes — not even other users' requests:

```ts
// this hogs the single thread until it's done — bad for a server!
function expensiveSum(limit) {
  let total = 0
  for (let i = 0; i < limit; i++) total += Math.sqrt(i)
  return total
}
```

> [!WARNING]
> A slow loop like this freezes your *entire* server for every user, not just the one who triggered it. For genuinely heavy computation, move it to a separate worker thread or a background job — don't run it directly in your request handler.

## Why Node is great for I/O

Node shines specifically for things like APIs and web servers, where most of the waiting is for *other things* (databases, files, network) rather than heavy computation. The waiting happens efficiently in the background while Node handles other requests.

## In one sentence

Node runs JavaScript on one thread but handles many requests well because I/O waits happen in the background (not blocking) — the danger is CPU-heavy synchronous code, which freezes the *entire* server until it finishes.

## Want to go deeper?

Switch to **Expert** mode above for the full event loop phases, `process.nextTick` vs Promises, and `worker_threads`.
