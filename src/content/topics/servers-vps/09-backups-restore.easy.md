---
title: Backups and Restore
order: 9
estMinutes: 10
difficulty: easy
checklist:
  - Identify what needs backup
  - Separate code deploys from data backups
  - Automate backup creation
  - Test restore procedure
  - Store backups away from the server
---

A **backup** is a safety copy of everything you can't just recreate — your database, uploaded files, important config. Your app's *code* is safe in Git, but your actual *data* needs its own protection.

## Making a backup

```bash
pg_dump "$DATABASE_URL" > backup.sql          # dump the database
tar -czf uploads.tar.gz /var/www/app/uploads  # zip up uploaded files
```

## Keep backups somewhere else

Storing a backup on the *same server* as the original doesn't protect you from much — if that server dies entirely, your backup dies with it. Always copy backups to somewhere separate: another machine, cloud storage, or a dedicated backup service.

## The most important rule

> [!IMPORTANT]
> A backup you've never **restored** is only a hope, not a real safety net. Actually practice restoring from a backup at least once — you might discover the backup was incomplete, corrupted, or the restore process doesn't work the way you assumed. Better to find that out on a calm day than during a real emergency.

Also, write down the exact restore steps somewhere. Guessing your way through a restore during an actual incident wastes precious time and increases the risk of making things worse.

## In one sentence

Back up your actual data (database, uploads) regularly, store the backups somewhere separate from the server, and — most importantly — actually test the restore process before you're forced to rely on it in a real emergency.

## Want to go deeper?

Switch to **Expert** mode above for the 3-2-1 backup rule and a full PostgreSQL backup/restore walkthrough.
