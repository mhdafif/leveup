---
title: Compute, Storage, and Network
order: 2
estMinutes: 30
difficulty: easy
checklist:
  - Explain compute services
  - Compare block, object, and database storage
  - Understand virtual networks
  - Know public and private traffic paths
  - Pick the right primitive for a workload
---

Most cloud systems combine compute, storage, and network. Compute runs code. Storage keeps data. Network controls how services communicate.

| Primitive | Example use |
| --- | --- |
| Compute | API server, worker, function |
| Object storage | Images, backups, exports |
| Database | Queryable application data |
| Network | Private service communication |

> [!TIP]
> Avoid using a database as file storage or object storage as a query engine. Pick the primitive that matches access patterns.

## Further Learning

- **"cloud compute storage network basics"** — cloud building blocks
- **"object storage vs block storage"** — storage types
- **"virtual private cloud basics"** — network isolation
