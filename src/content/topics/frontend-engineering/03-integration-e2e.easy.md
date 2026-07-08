---
title: Integration & E2E Testing
order: 3
estMinutes: 15
difficulty: easy
checklist:
  - Write integration tests that render components against mocked APIs
  - Use Playwright locators and assertions for E2E scenarios
  - Implement the Page Object Model to keep E2E tests maintainable
  - Explain the test pyramid and where each layer fits
  - Design a CI testing strategy that balances speed and confidence
---

Unit tests check one small piece. But real apps have pieces that talk to each other and to a server. Two bigger kinds of tests cover that: **integration tests** (do several pieces work together?) and **end-to-end (E2E) tests** (does the whole app work like a real user would experience it?).

## The testing pyramid

A simple way to picture how many of each to write:

- **Lots of unit tests** — tiny, fast, cheap.
- **Some integration tests** — a few pieces together.
- **A few E2E tests** — the whole app in a real browser; slow but high-confidence.

The higher up you go, the more real (and more confident) — but also slower and more fragile. So you write many small ones and just a few big ones.

## Integration tests: components + a fake server

Here you render a real component but *fake* the network so tests stay fast and predictable. A tool called **MSW** (Mock Service Worker) pretends to be your API:

```ts
it('shows the user after loading', async () => {
  render(<UserProfile userId="42" />)
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
  await screen.findByText('Alice')  // waits for the (fake) data
})
```

Your component runs for real; only the server is pretend.

## E2E tests: drive a real browser

E2E tools like **Playwright** open an actual browser and click through your app like a person:

```ts
test('user can log in', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('alice@example.com')
  await page.getByLabel('Password').fill('secret')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL('/dashboard')
})
```

> [!TIP]
> Find elements by their visible label or role (`getByLabel`, `getByRole`) rather than hidden CSS classes. It's sturdier when the design changes — and it doubles as an accessibility check.

## Keeping E2E tests tidy

E2E tests can get repetitive. A common cleanup is the **Page Object**: put the steps for a page (like "log in") into a small reusable class, so your tests stay short and one UI change only needs one fix.

## In one sentence

Write mostly fast unit tests, some integration tests (real components against a fake API via MSW), and a few E2E tests that drive a real browser with Playwright — and target elements by role/label so tests survive design changes.

## Want to go deeper?

Switch to **Expert** mode above for the full MSW setup, the Page Object Model, Playwright assertions, and a CI testing strategy.
