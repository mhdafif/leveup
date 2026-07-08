---
title: Testing Philosophy
order: 9
estMinutes: 12
difficulty: easy
checklist:
  - Compare the testing trophy and testing pyramid and explain the tradeoffs
  - List the three properties of a good test (fast, isolated, deterministic)
  - Walk through the red-green-refactor cycle for a simple function
  - Write a test name that reads as a specification sentence
  - Identify tests that test implementation rather than behaviour and explain why they break
---

Tests are little programs that check your other programs still work. A good test suite lets you change code without fear — if you break something, a test goes red and tells you. This lesson is about *how to think* about testing, not just how to write a test.

## Test what it *does*, not *how* it does it

This is the single most important idea. Test the **behavior** users care about, not the internal details:

- ✅ "When I add an item, the cart total goes up."
- ❌ "The `addItem` function calls `this._recalc` exactly once."

The second kind breaks every time you rearrange the internals — even when nothing's actually wrong. Tests tied to *behavior* survive refactoring; tests tied to *internals* fight you.

## Three signs of a good test

- **Fast** — runs in milliseconds, so you actually run it often. (Avoid real network/database calls.)
- **Isolated** — doesn't depend on other tests or leftover state; can run in any order.
- **Reliable** — passes or fails the same way every time. A test that randomly fails is worse than no test — people start ignoring it.

## Name tests like sentences

A test name should describe the behavior, so a failure instantly tells you what broke:

```ts
// ❌ useless when it fails
it('works', () => { ... })

// ✅ reads like a spec
it('returns null when the user does not exist', () => { ... })
it('throws if the email is invalid', () => { ... })
```

## The TDD rhythm (red → green → refactor)

Some people write the test *first*. The cycle:

1. **Red** — write a failing test for the next small behavior.
2. **Green** — write just enough code to make it pass.
3. **Refactor** — tidy up, keeping the test green.

Writing the test first forces you to design a nice, usable function before you build it.

## How much to test?

> [!CAUTION]
> Over-testing is a real problem too. Tests that check tiny internal details break constantly and make people afraid to improve the code. Focus your tests on the behaviors that matter, not on 100% coverage for its own sake.

## In one sentence

Write tests that check *behavior* (not internal details) so they survive refactoring — keep them fast, isolated, and reliable, name them like specification sentences, and don't chase 100% coverage.

## Want to go deeper?

Switch to **Expert** mode above for the testing pyramid vs trophy, full TDD/BDD examples, and why implementation-detail tests break.
