---
title: Compute, Storage, and Network
order: 2
estMinutes: 10
difficulty: easy
checklist:
  - Explain compute services
  - Compare block, object, and database storage
  - Understand virtual networks
  - Know public and private traffic paths
  - Pick the right primitive for a workload
---

Almost everything in the cloud is built from three basic ingredients: something to **run code** (compute), something to **hold data** (storage), and something to **connect it all** (network).

## The three building blocks

| Building block | What it's for | Example |
|---|---|---|
| **Compute** | Runs your code | An API server, a background worker |
| **Storage** | Holds your data | A database, uploaded files |
| **Network** | Connects everything | Letting your app privately reach its database |

## Pick the right tool for the data

Not all storage is the same:

- **Database** — for data you'll *query* (find users, filter orders).
- **Object storage** — for files (images, videos, exported PDFs).

> [!TIP]
> Don't use a database as a place to dump files, and don't use file storage as a substitute for a real database. Each is built for a different access pattern — picking the wrong one causes pain later (slow queries, awkward file handling).

## In one sentence

Cloud systems combine compute (run code), storage (hold data), and network (connect it) — use a real database for queryable data and object storage for files, rather than mixing the two up.

## Want to go deeper?

Switch to **Expert** mode above for block vs object vs database storage details and virtual private networks.
