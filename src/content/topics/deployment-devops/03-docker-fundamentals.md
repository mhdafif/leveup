---
title: Docker Fundamentals
order: 3
estMinutes: 35
difficulty: medium
checklist:
  - Explain image vs container
  - Write a basic Dockerfile
  - Build and run an image
  - Use .dockerignore
  - Keep images small and deterministic
---

Docker packages an application and its runtime dependencies into an image. A container is a running instance of that image.

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
CMD ["pnpm", "preview", "--host", "0.0.0.0"]
```

> [!TIP]
> Use `.dockerignore` to avoid copying `node_modules`, logs, and local build output into images.

## Further Learning

- **"Docker image vs container"** — core model
- **"Dockerfile best practices Node"** — image hygiene
- **"docker build run logs"** — basic commands
