---
title: Docker Compose
order: 4
estMinutes: 30
difficulty: medium
checklist:
  - Define multiple services
  - Connect app and database containers
  - Use volumes for persistent data
  - Use environment variables in compose
  - Know compose limits for production
---

Docker Compose runs multiple containers together. It is common for local development and small deployments.

```yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgres://postgres:postgres@db:5432/app
  db:
    image: postgres:16
    volumes:
      - db_data:/var/lib/postgresql/data
volumes:
  db_data:
```

> [!WARNING]
> Containers are disposable. Databases need volumes or managed storage, or data disappears when containers are removed.

## Further Learning

- **"Docker Compose services volumes"** — compose basics
- **"Postgres Docker volume"** — persistent DB data
- **"Docker Compose production caveats"** — limits and tradeoffs
