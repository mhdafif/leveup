---
title: End-to-End Testing
order: 9
estMinutes: 10
difficulty: easy
checklist:
  - Test critical user journeys across the stack
  - Seed predictable test data
  - Avoid brittle selectors and timing assumptions
  - Verify API and UI behavior together
  - Run E2E tests in CI for release confidence
---

**End-to-end (E2E) tests** click through your app just like a real user would — real browser, real API calls, real database. They're slower than unit tests, so you save them for the most important user journeys: signup, checkout, the core thing your app does.

## A real user journey, scripted

```ts
test('user creates and completes a task', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('demo@example.com')
  await page.getByLabel('Password').fill('correct-password')
  await page.getByRole('button', { name: 'Log in' }).click()

  await page.getByRole('button', { name: 'New task' }).click()
  await page.getByLabel('Title').fill('Ship release notes')
  await page.getByRole('button', { name: 'Create' }).click()

  await expect(page.getByText('Ship release notes')).toBeVisible()
})
```

This test does everything a real person would: log in, create a task, see it appear. If any layer of your stack breaks this flow, the test catches it.

## Find elements the way a person would

Use `getByRole` and `getByLabel` (finding things by their visible label/role) rather than fragile CSS classes. It survives design changes better, and it doubles as an accessibility check.

## Give it predictable data

Seed known test users/records before the test runs, so the test doesn't depend on whatever happens to be in the database at the time.

> [!WARNING]
> E2E tests get flaky (randomly failing) when they depend on shared, changing data, or arbitrary "wait a bit" delays. Use predictable seeded data and wait for actual conditions (like "this text appears"), not fixed timeouts.

## In one sentence

End-to-end tests script a real user journey through your actual app (browser + API + database) — reserve them for your most critical flows, use accessible selectors, and seed predictable test data to avoid flakiness.

## Want to go deeper?

Switch to **Expert** mode above for test isolation strategies and running E2E tests reliably in CI.
