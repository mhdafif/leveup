---
title: Testing Philosophy
order: 9
estMinutes: 30
difficulty: medium
checklist:
  - Compare the testing trophy and testing pyramid and explain the tradeoffs
  - List the three properties of a good test (fast, isolated, deterministic)
  - Walk through the red-green-refactor cycle for a simple function
  - Write a test name that reads as a specification sentence
  - Identify tests that test implementation rather than behaviour and explain why they break
---

Tests are executable specifications. A good test suite tells you that the system does what it is supposed to do, catches regressions automatically, and gives you the confidence to refactor or add features without fear. A bad test suite is brittle, slow, and misleading — it breaks on every refactor, passes when real bugs exist, and creates so much maintenance burden that the team stops writing tests at all. The difference is rarely a matter of coverage percentage; it is a matter of testing philosophy.

## Testing Trophy vs Testing Pyramid

The classic **testing pyramid** (Mike Cohn, *Succeeding with Agile*, 2009) recommends a large base of unit tests, a middle layer of integration tests, and a small peak of end-to-end (E2E) tests. The reasoning: unit tests are cheap and fast; E2E tests are slow and brittle.

Kent C. Dodds proposed the **testing trophy** as a refinement for modern JavaScript:

```
         /‾‾‾‾\
        /  E2E  \          ← a few critical user journeys
       /‾‾‾‾‾‾‾‾\
      / Integration \      ← the bulk of tests (most value)
     /‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
    /      Unit       \    ← pure logic, utilities, algorithms
   /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
  /       Static        \  ← TypeScript, ESLint (free, always on)
 /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
```

The trophy gives more weight to **integration tests** — tests that exercise multiple units together (e.g. a React component with its hooks, or a service with its repository). These tests give high confidence that pieces work together, while remaining faster and more stable than full E2E tests.

> [!NOTE]
> The trophy vs pyramid debate is about emphasis, not absolutes. Both agree: write mostly fast tests, write some slow ones, focus on the layer that gives the most confidence per unit of maintenance cost.

## Properties of a Good Test

**Fast** — a test suite that takes 10 minutes doesn't get run on every save. Tests should complete in milliseconds for unit tests, seconds for integration tests. Avoid real HTTP calls, real databases, and `setTimeout` with real delays.

**Isolated** — each test should be able to run in any order without depending on another test's side effects. Tests that share mutable state are the most common source of flaky tests.

**Deterministic** — the same test must produce the same result every run. A test that passes 90% of the time is worse than no test — it creates noise that teaches the team to ignore failures.

A fourth property worth naming: **meaningful failure messages**. When a test fails, the message should immediately tell you what broke and why, not just "expected true, got false."

## TDD: Red-Green-Refactor

Test-Driven Development (TDD) is a discipline introduced by Kent Beck in *Test-Driven Development: By Example* (2002). The cycle:

1. **Red** — write a failing test that describes the next small piece of behaviour. Run it and confirm it fails.
2. **Green** — write the *minimum* code necessary to make the test pass. Do not over-engineer.
3. **Refactor** — clean up the code (and tests) without changing behaviour. Run tests to confirm they still pass.

```ts
// 1. RED — test first
it("adds two positive numbers", () => {
  expect(add(2, 3)).toBe(5); // fails: add is not defined
});

// 2. GREEN — minimum implementation
function add(a: number, b: number): number {
  return a + b;
}

// 3. REFACTOR — nothing to clean up here; move to next test
it("returns 0 for add(0, 0)", () => {
  expect(add(0, 0)).toBe(0);
});
```

TDD's primary benefit is not the tests themselves — it is that writing the test first forces you to design a usable API before implementation, naturally producing smaller, more focused functions.

## BDD: Behaviour-Driven Development

BDD (Dan North, 2006) extends TDD with a structured language for test names that reads like a specification:

```ts
describe("ShoppingCart", () => {
  describe("when an item is added", () => {
    it("increases the item count by one", () => { ... });
    it("updates the total price", () => { ... });
  });

  describe("when the cart is empty", () => {
    it("shows a total of zero", () => { ... });
    it("disables the checkout button", () => { ... });
  });
});
```

This structure makes the test file double as living documentation. Tools like Cucumber take BDD further, writing specs in plain English (Gherkin syntax) so non-engineers can read and verify them.

## Test Naming Conventions

A test name should be a sentence that describes behaviour: what the system does, under what condition, and what the expected outcome is.

```ts
// Bad — tells you nothing when it fails
it("works correctly", () => { ... });
it("test 1", () => { ... });

// Good — reads as a specification
it("returns null when the user ID does not exist", () => { ... });
it("throws an error if the email format is invalid", () => { ... });
it("does not notify observers when the value has not changed", () => { ... });
```

## The Cost of Over-Testing

> [!CAUTION]
> Over-testing is as harmful as under-testing. Tests that assert implementation details — the exact arguments passed to an internal function, the order of private method calls, the exact class names rendered to the DOM — break on every refactor even when the behaviour is correct. They create friction that makes the team reluctant to improve the code.

Test what the system *does*, not *how* it does it. A component test should assert what the user sees, not what props were passed to an internal child component. A service test should assert what is returned and what side effects occurred, not which private methods were called.

## Further Learning

Search these terms to go deeper:
- **"Kent C. Dodds testing trophy"** — the original article and the rationale for emphasising integration tests
- **"Test-Driven Development By Example Kent Beck"** — the foundational TDD book with worked examples in Java
- **"Working Effectively with Legacy Code Michael Feathers"** — the definitive guide to adding tests to untested code
- **"testing implementation details Kent Dodds"** — the essay on why tests that test internals are harmful
- **"Behaviour-Driven Development Dan North"** — the original BDD article and the evolution from TDD
