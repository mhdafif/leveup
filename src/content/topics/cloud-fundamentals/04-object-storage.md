---
title: Object Storage
order: 4
estMinutes: 25
difficulty: easy
checklist:
  - Explain buckets and objects
  - Store user uploads safely
  - Understand public access controls
  - Use signed URLs
  - Design object keys intentionally
---

Object storage stores blobs by key. It is ideal for images, videos, backups, logs, and generated exports.

```txt
bucket: user-uploads
key: avatars/user-123.png
```

Public buckets are easy but risky. Private buckets plus signed URLs provide controlled access.

> [!IMPORTANT]
> Treat uploads as untrusted input. Validate type, size, and access permissions.

## Further Learning

- **"object storage buckets keys"** — storage model
- **"signed URL object storage"** — temporary access
- **"secure file uploads cloud storage"** — upload safety
