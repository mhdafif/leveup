---
title: Docker Compose
order: 4
estMinutes: 10
difficulty: easy
checklist:
  - Define multiple services
  - Connect app and database containers
  - Use volumes for persistent data
  - Use environment variables in compose
  - Know compose limits for production
---

Most real apps need more than one thing running — your app *and* a database, for example. **Docker Compose** lets you describe several containers together in one file and start them all with one command.

## Describing your whole setup

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

One `docker compose up` and both your app *and* its database spin up together, already able to talk to each other (the app reaches the database just by using its service name, `db`, as the hostname).

## Don't lose your data

> [!WARNING]
> Containers are **disposable** — if you remove a database container without a **volume**, all its data vanishes. The `volumes:` section above keeps the actual database files stored outside the container, so they survive even if the container is recreated.

## Where it fits

Docker Compose is great for **local development** and small projects. For serious production deployments with lots of traffic, you'd typically graduate to something more robust (like Kubernetes or a managed hosting platform) — but Compose is the perfect way to get a multi-service app running locally in minutes.

## In one sentence

Docker Compose describes multiple containers (like your app + its database) in one file so they start together — just remember to use volumes for anything you don't want to lose when a container is removed.

## Want to go deeper?

Switch to **Expert** mode above for production caveats and when to move beyond Compose.
