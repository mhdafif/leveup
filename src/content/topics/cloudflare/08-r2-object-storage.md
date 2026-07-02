---
title: R2 Object Storage
order: 8
estMinutes: 30
difficulty: medium
checklist:
  - Explain object storage
  - Compare buckets and objects
  - Upload and serve files
  - Understand public vs private access
  - Use signed URLs for restricted files
---

Cloudflare R2 is object storage for files like images, backups, exports, and user uploads. An object has a key, metadata, and bytes. A bucket groups objects.

```txt
bucket: course-assets
key: topics/cloudflare/diagram.png
```

Object storage is not a database. It is optimized for storing and retrieving blobs, not querying rows.

> [!IMPORTANT]
> Keep private uploads private by default. Serve them through signed URLs or application authorization checks.

R2 is often paired with Workers: the Worker checks permissions, then reads or writes objects.

## Further Learning

- **"Cloudflare R2 buckets objects"** — core model
- **"R2 signed URLs"** — private file access
- **"R2 Workers binding"** — using R2 from Workers
