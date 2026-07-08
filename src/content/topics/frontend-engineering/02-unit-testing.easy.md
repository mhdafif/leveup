---
title: Unit Testing
order: 2
estMinutes: 15
difficulty: easy
checklist:
  - Identify what is and is not worth unit testing
  - Structure tests with describe/it/expect correctly
  - Mock functions and modules with vi.fn and vi.mock
  - Test React components with Testing Library queries
  - Interpret coverage reports without chasing the number
---

A **unit test** is a little piece of code that checks another piece of code does what it should. Instead of clicking through your app by hand to make sure nothing broke, you write tests once and run them anytime. They're your safety net when you change things later.

## Test what matters (not everything)

The golden rule: **test what the code *does*, not how it's built inside.** A good test still passes when you clean up the internals.

**Worth testing:**
- Functions that take input and return output (easy to check).
- Important logic and edge cases (empty list? missing value?).
- What happens when something fails.

**Skip:**
- Other people's libraries (already tested).
- Trivial stuff with no real logic.

> [!TIP]
> Ask yourself: "If I rewrite the insides but keep the behavior the same, does this test break?" If yes, it's testing the wrong thing.

## What a test looks like

Tests read almost like sentences: *describe* a thing, then *it* should do something, and you *expect* a result:

```ts
import { describe, it, expect } from 'vitest'
import { add } from './math'

describe('add', () => {
  it('adds two numbers', () => {
    expect(add(2, 3)).toBe(5)
  })
})
```

`expect(...).toBe(...)` is the actual check: "I expect this to equal that."

## Testing a component

For UI, **Testing Library** lets you interact with a component the way a real user would — find the button by its label, click it, check what shows up:

```ts
import { render, screen, fireEvent } from '@testing-library/react'
import { Counter } from './Counter'

it('counts up when clicked', () => {
  render(<Counter />)
  fireEvent.click(screen.getByRole('button', { name: /increment/i }))
  expect(screen.getByText('Count: 1')).toBeInTheDocument()
})
```

Finding elements by their visible role/label (not hidden CSS classes) also nudges you toward more accessible UI.

## About "coverage"

Coverage tells you what percentage of your code the tests ran — but 100% coverage doesn't mean bug-free (you could run a line without really checking it). Use it to spot *untested* areas, but don't obsess over hitting a magic number.

## In one sentence

Unit tests check behavior (not internals) so you can change code fearlessly — write them as `describe`/`it`/`expect`, use Testing Library to click through UI like a user, and treat coverage as a hint, not a goal.

## Want to go deeper?

Switch to **Expert** mode above for mocking with `vi.fn`/`vi.mock`, `userEvent` vs `fireEvent`, and reading branch-coverage reports.
