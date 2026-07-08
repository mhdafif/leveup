---
title: Managed Databases
order: 5
estMinutes: 10
difficulty: easy
checklist:
  - Explain managed database value
  - Configure backups and retention
  - Understand connection limits
  - Use private networking where possible
  - Monitor slow queries and storage
---

Running your own database means handling backups, security patches, and scaling all yourself. A **managed database** (like AWS RDS or a similar service) means the cloud provider handles all that operational work for you — you just use it.

## What "managed" takes off your plate

- Automatic backups
- Security patching
- Handling failover if a server dies
- Built-in monitoring and metrics

That's a genuinely large amount of work you no longer have to do yourself.

## What's still YOUR job

> [!TIP]
> "Managed" doesn't mean "maintenance-free." You still own the important decisions: designing your schema well, adding the right indexes, keeping connections pooled properly, and watching for slow queries. A managed database won't fix a badly designed table for you.

## In one sentence

A managed database handles the operational burden (backups, patching, failover) for you, but you're still responsible for good schema design, indexes, and watching for slow queries.

## Want to go deeper?

Switch to **Expert** mode above for backup retention and connection pooling in managed environments.
