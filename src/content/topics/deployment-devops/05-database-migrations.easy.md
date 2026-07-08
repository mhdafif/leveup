---
title: Database Migrations
order: 5
estMinutes: 10
difficulty: easy
checklist:
  - Explain schema migration purpose
  - Run migrations before app code needs new schema
  - Design backward-compatible migrations
  - Back up before destructive changes
  - Handle failed migrations
---

When your database's structure needs to change (a new column, a renamed field), you need a safe, repeatable way to apply that change everywhere — that's a **migration**. The tricky part in *deployment* specifically: for a moment during rollout, both the old and new app versions might be running at once.

## The safe way to rename something

Renaming a column sounds simple, but doing it in one step risks losing data or breaking the still-running old version of your app. The safe sequence:

1. Add the **new** column (keep the old one too).
2. Have the app write to **both** columns for a while.
3. Copy (backfill) old data into the new column.
4. Switch the app to **read** from the new column.
5. *Later*, once everything's stable, drop the old column.

Each step is small and reversible — no moment where data is lost or the app breaks.

## Destructive changes need a safety net

> [!CAUTION]
> Dropping a column or table isn't like reverting a code change — the data is just gone. Always back up before a destructive migration, and have a real rollback plan, not just a hope that it goes fine.

## In one sentence

Migrations change your database structure safely over time — for risky changes like renames, do it in small steps (add, backfill, switch, then remove later) so nothing breaks mid-rollout, and always back up before anything destructive.

## Want to go deeper?

Switch to **Expert** mode above for the full expand-contract pattern and handling failed migrations.
