---
title: R2 Object Storage
order: 8
estMinutes: 10
difficulty: easy
checklist:
  - Explain object storage
  - Compare buckets and objects
  - Upload and serve files
  - Understand public vs private access
  - Use signed URLs for restricted files
---

**R2** is Cloudflare's object storage — a place to store files (images, backups, user uploads) at scale. Same idea as the object storage covered in cloud-fundamentals, just Cloudflare's version of it.

## Buckets and keys

```
bucket: course-assets
key: topics/cloudflare/diagram.png
```

You group files into **buckets**, and each file has a unique **key** (essentially its path/name inside the bucket).

## Not a database

> [!IMPORTANT]
> Object storage is built for storing and fetching whole files (blobs), not for querying structured data. Don't try to use R2 like a database — it doesn't support searching or filtering the *contents* of files the way a database queries rows.

## Keep private files private

By default, don't make uploaded files publicly accessible. Instead, serve them through a signed URL (a temporary, permission-checked link) or have your app verify the request is allowed before handing over the file.

## A common pairing

R2 pairs naturally with **Workers**: the Worker checks "is this person allowed to see this file?" and only then fetches and returns it from R2 — giving you controlled access without exposing files publicly.

## In one sentence

R2 stores files in buckets under unique keys (like any object storage) — it's for blobs, not queryable data, and private files should stay private, served through signed URLs or a Worker that checks permissions first.

## Want to go deeper?

Switch to **Expert** mode above for signed URLs and using R2 bindings directly from Workers.
