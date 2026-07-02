---
title: End-to-End Testing
order: 9
estMinutes: 35
difficulty: medium
checklist:
  - Test critical user journeys across the stack
  - Seed predictable test data
  - Avoid brittle selectors and timing assumptions
  - Verify API and UI behavior together
  - Run E2E tests in CI for release confidence
---

End-to-end tests verify that a real user workflow works across browser, API, database, and supporting services. They are slower than unit tests, so use them for the paths where integration risk is highest.

## A Critical Path Test

```ts
import { test, expect } from "@playwright/test";

test("user creates and completes a task", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("demo@example.com");
  await page.getByLabel("Password").fill("correct-password");
  await page.getByRole("button", { name: "Log in" }).click();

  await page.getByRole("button", { name: "New task" }).click();
  await page.getByLabel("Title").fill("Ship release notes");
  await page.getByRole("button", { name: "Create" }).click();

  await expect(page.getByText("Ship release notes")).toBeVisible();
  await page.getByRole("checkbox", { name: "Ship release notes" }).check();
  await expect(page.getByText("Completed")).toBeVisible();
});
```

Prefer accessible selectors. They test the interface the user experiences and are less brittle than CSS class selectors.

## Test Data

Seed known users and records before tests run. Clean up between tests or isolate each test with unique ids.

> [!WARNING]
> E2E tests become flaky when they depend on shared mutable data, arbitrary sleeps, or third-party services without test doubles.

## Further Learning

Search these terms to go deeper:
- **"Playwright end to end testing best practices"** — reliable browser tests
- **"test data seeding strategy E2E"** — predictable environments
- **"contract tests vs end to end tests"** — choosing test levels
- **"CI flaky test debugging"** — making release checks trustworthy
