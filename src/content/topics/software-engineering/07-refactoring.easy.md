---
title: Refactoring
order: 7
estMinutes: 15
difficulty: easy
checklist:
  - Define refactoring and distinguish it from rewriting or adding features
  - Apply Extract Function, Rename Variable, and Introduce Parameter Object
  - Replace a complex conditional with polymorphism
  - Explain why tests are a prerequisite for safe refactoring
  - Identify and categorise technical debt in a codebase
---

**Refactoring** means improving the *structure* of code without changing what it *does*. Same behavior, cleaner insides — like tidying a messy room without throwing anything out. It's how you keep a codebase from slowly rotting.

## When to do it

Refactoring isn't a big separate project — it's a little-and-often habit. A handy guideline is the **rule of three**: the first time, just write it; the second time you see similar code, notice it; the third time, refactor to remove the duplication.

> [!WARNING]
> Don't refactor *and* add a feature in the same commit. Keep them separate — one commit that cleans up (behavior unchanged), then another that adds the new thing. It makes the changes far easier to review and to undo if needed.

## A few everyday refactorings

**Extract a function** — pull a chunk of code into a well-named function. The name replaces a comment:

```ts
// before: a loop buried inside a bigger function
let total = 0
for (const o of invoice.orders) total += o.amount

// after: give it a name
const total = calculateTotal(invoice)
```

**Rename for clarity** — the cheapest, highest-value refactor:

```ts
const d = compute(arr)              // ❌ what are these?
const priceDelta = compute(prices)  // ✅ clear
```

**Group related parameters** — when the same 3 arguments always travel together, bundle them into one object:

```ts
// before
createReport(startDate, endDate, userId)
// after
createReport({ startDate, endDate, userId })
```

## Refactor safely: lean on tests

The whole point is "same behavior" — so how do you *know* you didn't break anything? **Tests.** The safe rhythm:

1. Make sure tests pass (green) before you start.
2. Make one small change.
3. Run tests again. Pass → keep going. Fail → undo immediately.

> [!IMPORTANT]
> If the code has no tests, add a few first that capture how it currently behaves. That's your safety net before you start rearranging.

## Technical debt

**Technical debt** is the messiness you take on to ship fast — like a loan. A little is fine and sometimes smart, but if you never "pay it back" by cleaning up, it charges "interest": every future change gets harder.

> [!TIP]
> Make debt visible. A task titled "Refactor OrderService — it does 6 things" is much more likely to get fixed than silent mess nobody's tracking.

## In one sentence

Refactoring improves code's structure while keeping its behavior identical — do it little and often (rule of three), keep it separate from feature commits, and rely on tests to prove you didn't break anything.

## Want to go deeper?

Switch to **Expert** mode above for replacing conditionals with polymorphism, characterization tests, and categorizing technical debt.
