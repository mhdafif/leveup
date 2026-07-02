---
title: Backups and Restore
order: 9
estMinutes: 30
difficulty: medium
checklist:
  - Identify what needs backup
  - Separate code deploys from data backups
  - Automate backup creation
  - Test restore procedure
  - Store backups away from the server
---

A backup you have never restored is only a hope. Backups must include the data that cannot be recreated: databases, uploads, generated files, and critical config.

```bash
pg_dump "$DATABASE_URL" > backup.sql
tar -czf uploads.tar.gz /var/www/app/uploads
```

Store backups outside the server: object storage, another machine, or a managed backup service.

> [!IMPORTANT]
> Document restore steps. In an incident, guessing the restore process wastes time and increases risk.

## Further Learning

- **"database backup restore test"** — restore validation
- **"3-2-1 backup rule"** — backup strategy
- **"pg_dump restore basics"** — PostgreSQL example
