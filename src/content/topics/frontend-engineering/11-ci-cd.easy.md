---
title: CI/CD for Frontend
order: 11
estMinutes: 15
difficulty: easy
checklist:
  - Write a GitHub Actions workflow with jobs, steps, and caching
  - Run automated tests and lint in CI with correct failure modes
  - Configure environment variables securely in CI pipelines
  - Explain blue-green and canary deployment strategies
  - Apply semantic versioning and automate releases
---

**CI/CD** is about letting robots do the boring, error-prone parts of shipping code:

- **CI** (Continuous Integration) — automatically test every change *before* it merges.
- **CD** (Continuous Deployment) — automatically ship it to users *after* it passes.

The result: you catch mistakes early, and releasing becomes a non-event instead of a scary manual ritual.

## A basic pipeline

The most common tool is **GitHub Actions** — you write a small YAML file, and GitHub runs it automatically on every push or pull request:

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm install
      - run: npm run lint       # check code style
      - run: npm test           # run tests
      - run: npm run build      # make sure it builds
```

If any step fails, the check goes red and you know *before* merging — not after users complain.

## Keep secrets secret

Things like deploy tokens should never be typed into the YAML file. GitHub has a **Secrets** area for them, and you reference them safely:

```yaml
- run: vercel deploy --token ${{ secrets.VERCEL_TOKEN }}
```

> [!WARNING]
> Don't put secrets in plain text or `echo` them — they'd show up in the logs. Store them as GitHub Secrets, which get masked automatically.

## Deploying safely

Two popular ways to release without risking a big outage:

- **Blue-green** — keep the old version running, deploy the new one beside it, then flip traffic over. If something's wrong, flip back instantly.
- **Canary** — release the new version to a small slice of users first (say 5%), watch for errors, then roll it out to everyone.

Hosts like **Vercel** and **Netlify** do a lot of this for you — including giving every pull request its own preview URL to click around before merging.

## Versioning releases

When you publish, use **semantic versioning** — `MAJOR.MINOR.PATCH`:

- **Patch** (1.0.1): bug fixes.
- **Minor** (1.1.0): new features, nothing breaks.
- **Major** (2.0.0): breaking changes.

It tells everyone at a glance how risky an update is.

## In one sentence

CI/CD automates testing and shipping — set up a GitHub Actions workflow to lint/test/build every change, store deploy tokens as Secrets, use preview deploys or canary rollouts to release safely, and version with semantic versioning.

## Want to go deeper?

Switch to **Expert** mode above for parallel jobs, dependency caching, pinning actions for security, blue-green vs canary details, and automated releases with Changesets.
