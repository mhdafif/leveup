---
title: Unit Testing
order: 2
estMinutes: 35
difficulty: medium
checklist:
  - Identify what is and is not worth unit testing
  - Structure tests with describe/it/expect correctly
  - Mock functions and modules with vi.fn and vi.mock
  - Test React components with Testing Library queries
  - Interpret coverage reports without chasing the number
---

A unit test verifies one piece of behaviour in isolation. Done well, a test suite gives you the confidence to refactor, the documentation of intent, and the safety net that catches regressions before they reach users. Done poorly, it becomes a brittle maintenance burden that slows the team down without adding value.

## What to Test — and What Not To

Test behaviour, not implementation. A test that checks which internal function was called breaks every time you refactor, even when nothing visible changed.

**Worth testing:**
- Pure functions — given these inputs, produce this output
- Business logic isolated from framework code
- Edge cases that are hard to exercise manually (empty arrays, null values, boundary numbers)
- Error paths (what happens when an API call throws?)

**Not worth testing:**
- Third-party library internals
- Trivial getters/setters with zero logic
- Framework wiring (that React renders a `<div>` when you write `<div>`)
- Exact pixel positions or CSS values

> [!TIP]
> Ask: "If I change the implementation without changing the behaviour, does this test break?" If yes, it is testing implementation, not behaviour.

## Vitest / Jest Structure

Both Vitest and Jest share the same API. Vitest is preferred for modern projects because it shares your Vite config and is significantly faster.

```ts
// math.test.ts
import { describe, it, expect } from "vitest";
import { add, divide } from "./math";

describe("add", () => {
  it("returns the sum of two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("handles negative numbers", () => {
    expect(add(-1, 1)).toBe(0);
  });
});

describe("divide", () => {
  it("throws when dividing by zero", () => {
    expect(() => divide(10, 0)).toThrow("Division by zero");
  });
});
```

Use `describe` to group related cases. Each `it` (or `test`) should express one assertion idea. Prefer descriptive strings that read like sentences.

## Mocking

`vi.fn()` creates a spy function you can assert against:

```ts
import { vi } from "vitest";

const onSubmit = vi.fn();
onSubmit("data");
expect(onSubmit).toHaveBeenCalledOnce();
expect(onSubmit).toHaveBeenCalledWith("data");
```

`vi.mock()` replaces an entire module. The factory runs before imports, so it must not reference outer variables:

```ts
vi.mock("../api/users", () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1, name: "Alice" }),
}));
```

> [!WARNING]
> `vi.mock()` calls are hoisted to the top of the file by Vitest's transform. If you try to reference a variable defined in the test file inside the mock factory, it will be `undefined`.

Use `vi.spyOn` when you want to wrap a real implementation and assert on calls without replacing it:

```ts
const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
// ... code that should warn ...
expect(spy).toHaveBeenCalledWith(expect.stringContaining("deprecated"));
spy.mockRestore();
```

## Testing Components with Testing Library

Testing Library queries the DOM the way a user would — by role, label, or text — rather than by CSS selectors or component internals:

```ts
import { render, screen, fireEvent } from "@testing-library/react";
import { Counter } from "./Counter";

it("increments the count when the button is clicked", () => {
  render(<Counter />);
  const button = screen.getByRole("button", { name: /increment/i });
  fireEvent.click(button);
  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});
```

Prefer `getByRole` over `getByTestId`. If you cannot find an element by role or label, that is often a signal that the component is not accessible.

> [!NOTE]
> Use `userEvent` from `@testing-library/user-event` instead of `fireEvent` for interactions that involve multiple events (typing dispatches `keydown`, `keypress`, `input`, and `keyup`). `userEvent` simulates the full sequence; `fireEvent` dispatches one event.

## Coverage

Coverage tells you which lines were executed during tests, not whether those lines are correctly tested. A file can be 100% covered and still have bugs if assertions are weak.

Run coverage with `vitest run --coverage`. Look at branch coverage — an uncovered branch means an `if/else` path that was never exercised.

Set a coverage threshold to prevent regression, but do not chase 100% — focus it on business-critical modules:

```ts
// vitest.config.ts
coverage: {
  thresholds: { statements: 80, branches: 75 }
}
```

## Further Learning

Search these terms to go deeper:
- **"testing-library docs queries"** — the canonical guide to choosing the right query
- **"Vitest mocking guide"** — covers vi.fn, vi.mock, vi.spyOn, and timers in depth
- **"Kent C. Dodds testing trophy"** — the alternative to the test pyramid; argues for more integration tests
- **"testing implementation details"** — Kent C. Dodds article on why querying internal state leads to fragile tests
- **"Vitest coverage v8 vs istanbul"** — choosing the right coverage provider and understanding its output
