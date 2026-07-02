---
title: CI/CD Basics
order: 2
estMinutes: 30
difficulty: easy
checklist:
  - Explain continuous integration
  - Explain continuous deployment
  - Run tests in CI
  - Build artifacts consistently
  - Block deploys on failing checks
---

CI runs verification automatically when code changes. CD ships verified code to an environment. Good pipelines reduce manual release mistakes.

Typical pipeline:

```txt
install -> lint/test -> build -> deploy
```

> [!TIP]
> CI should run the same commands developers run locally, or failures become hard to reproduce.

## Further Learning

- **"CI CD pipeline basics"** — workflow model
- **"GitHub Actions Node pnpm"** — common implementation
- **"build artifact deployment"** — reproducible release output
