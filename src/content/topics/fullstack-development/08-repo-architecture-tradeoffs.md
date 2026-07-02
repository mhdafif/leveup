---
title: Repo Architecture Tradeoffs
order: 8
estMinutes: 30
difficulty: medium
checklist:
  - Compare monorepos and separate repositories
  - Share types without coupling deployments blindly
  - Define ownership boundaries between packages
  - Keep build pipelines understandable
  - Choose structure based on team workflow
---

Full-stack teams must decide how frontend, backend, shared types, infrastructure, and tests live in source control. There is no universal answer. The right structure supports how the team ships.

## Monorepo

A monorepo keeps related apps and packages together.

```text
apps/
  web/
  api/
packages/
  contracts/
  ui/
  config/
```

Benefits include shared tooling, atomic changes, and easier type sharing. Costs include larger CI scope, dependency graph complexity, and the need for clear package boundaries.

## Separate Repositories

Separate repositories can give teams independent release cycles and simpler ownership. Costs include contract drift, harder cross-stack changes, and duplicated tooling.

```ts
export type CreateTaskRequest = {
  title: string;
  projectId: string;
};

export type TaskResponse = {
  id: string;
  title: string;
  completedAt: string | null;
};
```

Shared contracts are useful, but they should not become a shortcut for skipping API compatibility.

> [!NOTE]
> A monorepo does not automatically create good architecture. It only makes sharing easier. Boundaries still need to be designed.

## Further Learning

Search these terms to go deeper:
- **"monorepo vs polyrepo tradeoffs"** — repository strategy comparison
- **"shared TypeScript types frontend backend"** — contract sharing patterns
- **"contract testing APIs"** — keeping separate services compatible
- **"Turborepo package boundaries"** — managing full-stack monorepos
