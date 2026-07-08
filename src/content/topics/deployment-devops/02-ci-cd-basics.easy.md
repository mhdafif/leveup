---
title: CI/CD Basics
order: 2
estMinutes: 10
difficulty: easy
checklist:
  - Explain continuous integration
  - Explain continuous deployment
  - Run tests in CI
  - Build artifacts consistently
  - Block deploys on failing checks
---

**CI/CD** lets robots handle the repetitive, error-prone parts of shipping software:

- **CI** (Continuous Integration) — automatically test every change *before* it merges.
- **CD** (Continuous Deployment) — automatically ship *verified* code to a real environment.

## A typical pipeline

```
install → lint/test → build → deploy
```

Every step must pass before moving to the next. If tests fail, the deploy simply doesn't happen — no human has to remember to block it.

> [!TIP]
> CI should run the exact same commands a developer runs locally (`npm test`, `npm run build`). If CI does something different, failures become confusing and hard to reproduce.

## Why this matters

Without CI/CD, "did I remember to run the tests before deploying?" is a human responsibility — and humans forget, especially under deadline pressure. Automating it means broken code simply can't reach production, no matter who's in a hurry.

## In one sentence

CI automatically verifies every change (lint, test, build), and CD ships the verified result automatically — together they remove the risk of a human forgetting a step before shipping.

## Want to go deeper?

Switch to **Expert** mode above for a real GitHub Actions pipeline setup.
