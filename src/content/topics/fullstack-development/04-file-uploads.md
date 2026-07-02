---
title: File Uploads
order: 4
estMinutes: 35
difficulty: medium
checklist:
  - Validate file type and size on both layers
  - Stream large files instead of buffering blindly
  - Store file metadata separately from bytes
  - Use direct uploads for large assets
  - Scan and restrict untrusted user files
---

File uploads cross many system boundaries: browser APIs, HTTP body parsing, backend validation, object storage, database metadata, and later download permissions. Treat uploads as untrusted input with storage attached.

## Browser to Server

```ts
async function uploadAvatar(file: File) {
  const body = new FormData();
  body.set("avatar", file);

  const res = await fetch("/api/avatar", {
    method: "POST",
    credentials: "include",
    body,
  });

  if (!res.ok) throw new Error("Upload failed");
}
```

The browser can check file size and MIME type for fast feedback, but the backend must repeat validation.

## Metadata and Storage

Store bytes in object storage and metadata in the database.

```ts
type FileRecord = {
  id: string;
  ownerId: string;
  storageKey: string;
  originalName: string;
  contentType: string;
  sizeBytes: number;
};
```

This lets the app check permissions, show filenames, and rotate storage providers without embedding files in relational rows.

> [!WARNING]
> Do not serve uploaded files from a trusted application origin without controls. User files can contain scripts, misleading content types, or sensitive data.

## Further Learning

Search these terms to go deeper:
- **"multipart form data file upload"** — browser upload mechanics
- **"direct to S3 upload presigned URL"** — avoiding backend file proxying
- **"file upload security best practices"** — validating untrusted files
- **"object storage metadata database pattern"** — separating bytes and records
