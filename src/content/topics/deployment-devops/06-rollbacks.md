---
title: Rollbacks
order: 6
estMinutes: 25
difficulty: medium
checklist:
  - Explain rollback vs roll forward
  - Keep previous artifacts available
  - Know when rollback is unsafe
  - Separate config rollback from code rollback
  - Practice rollback before incidents
---

A rollback returns production to a previous known-good version. It is easiest when builds are immutable and previous artifacts are available.

Rollbacks are unsafe when the new version already changed data in a way old code cannot read.

> [!TIP]
> If rollback is risky, a small forward fix may be safer than deploying old code.

## Further Learning

- **"deployment rollback strategy"** — release recovery
- **"immutable build artifacts"** — reliable versions
- **"rollback database migration risks"** — data compatibility
