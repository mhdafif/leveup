---
title: Repo Architecture Tradeoffs
order: 8
estMinutes: 10
difficulty: easy
checklist:
  - Compare monorepos and separate repositories
  - Share types without coupling deployments blindly
  - Define ownership boundaries between packages
  - Keep build pipelines understandable
  - Choose structure based on team workflow
---

When your app has a frontend, a backend, and shared code, where does it all live? Two common answers: **one big repository** (a "monorepo") or **separate repositories** for each piece. Neither is universally right — it depends on your team.

## One repo, several apps (monorepo)

```
apps/
  web/
  api/
packages/
  contracts/   ← shared types both apps use
  ui/
```

**Pros:** you can share TypeScript types between frontend and backend directly, and change both sides in one commit.
**Cons:** builds and tests can get slower as everything lives together, and you need clear boundaries so packages don't become tangled.

## Separate repos

**Pros:** each team/app can release on its own schedule, ownership is crystal clear.
**Cons:** the frontend and backend can drift out of sync — the API changes, and the frontend doesn't find out until something breaks.

```ts
// shared "contract" types — whether shared via monorepo package
// or copy-pasted between repos, keeping these in sync matters
export type TaskResponse = { id: string, title: string }
```

> [!NOTE]
> A monorepo doesn't automatically create good architecture — it just makes *sharing* easier. You still need to design clear boundaries between packages; otherwise everything becomes tightly coupled anyway.

## In one sentence

A monorepo makes sharing types and code easy but needs disciplined boundaries; separate repos give independent release cycles but risk contract drift between frontend and backend — pick based on how your team actually ships.

## Want to go deeper?

Switch to **Expert** mode above for contract testing between services and tools like Turborepo.
