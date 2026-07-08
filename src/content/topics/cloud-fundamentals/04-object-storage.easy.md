---
title: Object Storage
order: 4
estMinutes: 10
difficulty: easy
checklist:
  - Explain buckets and objects
  - Store user uploads safely
  - Understand public access controls
  - Use signed URLs
  - Design object keys intentionally
---

**Object storage** (like Amazon S3) is where you keep files in the cloud — images, videos, backups, PDFs. Think of it as a giant, infinitely-scaling filing cabinet: you put files in **buckets**, and each file has a unique **key** (basically its path/name).

```
bucket: user-uploads
key: avatars/user-123.png
```

## Public vs. private

You can make a bucket fully public (anyone with the link can view files) or private (nobody can access files without special permission). Public is simpler to set up, but risky if the bucket contains anything sensitive.

For private files that still need occasional public access — like letting a user download their own invoice — use a **signed URL**: a special link that's only valid for a short time, generated on demand.

## Treat uploads as untrusted

> [!IMPORTANT]
> Anything a user uploads should be treated like any other untrusted input — check its file type and size on your server (not just the browser), and don't assume the file is what it claims to be.

## In one sentence

Object storage holds files in buckets under unique keys — keep buckets private by default and use short-lived signed URLs for controlled access, and always validate uploaded files as untrusted input.

## Want to go deeper?

Switch to **Expert** mode above for signed-URL patterns and designing object keys intentionally.
