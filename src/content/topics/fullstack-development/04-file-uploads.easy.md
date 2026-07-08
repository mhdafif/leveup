---
title: File Uploads
order: 4
estMinutes: 12
difficulty: easy
checklist:
  - Validate file type and size on both layers
  - Stream large files instead of buffering blindly
  - Store file metadata separately from bytes
  - Use direct uploads for large assets
  - Scan and restrict untrusted user files
---

Letting users upload files (a profile picture, a document) touches several parts of your stack: the browser picks the file, your server receives it, and it ends up stored somewhere. Treat every uploaded file as **untrusted** — anyone can send anything.

## Sending a file from the browser

```ts
async function uploadAvatar(file) {
  const body = new FormData()
  body.set('avatar', file)
  const res = await fetch('/api/avatar', { method: 'POST', body })
  if (!res.ok) throw new Error('Upload failed')
}
```

`FormData` handles packaging the file for you — no manual encoding needed.

## Check twice: browser AND server

Checking file size/type in the browser gives fast feedback ("that file's too big!"), but it's not security — a user can bypass your frontend entirely and send anything directly to your API.

> [!WARNING]
> Always re-validate file type and size on the **server**, even if you already checked in the browser. The browser check is just for a nicer user experience.

## Separate "the file" from "info about the file"

Store the actual bytes somewhere built for it (like S3 or similar object storage), and keep a small record in your database describing it:

```ts
type FileRecord = {
  id: string
  ownerId: string
  storageKey: string     // where the actual bytes live
  originalName: string
  contentType: string
}
```

This way your database stays lightweight, and you can check permissions, rename, or move storage providers without touching the actual file bytes.

## Never blindly trust uploaded files

> [!IMPORTANT]
> A user-uploaded file could contain a script, a fake file type, or something malicious. Don't serve uploaded files directly from your main app's domain without safety controls — that's how attackers exploit file uploads.

## In one sentence

File uploads cross the whole stack — validate type/size on both browser (for UX) and server (for real security), store bytes in dedicated storage with metadata in your database, and never fully trust an uploaded file's content or claimed type.

## Want to go deeper?

Switch to **Expert** mode above for direct-to-storage uploads with presigned URLs and streaming large files.
