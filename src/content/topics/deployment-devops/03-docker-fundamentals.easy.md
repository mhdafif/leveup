---
title: Docker Fundamentals
order: 3
estMinutes: 12
difficulty: easy
checklist:
  - Explain image vs container
  - Write a basic Dockerfile
  - Build and run an image
  - Use .dockerignore
  - Keep images small and deterministic
---

"Works on my machine" is a classic problem — your app runs fine locally but breaks somewhere else because of a subtle environment difference. **Docker** solves this by packaging your app *and* everything it needs (runtime, dependencies, settings) into one portable unit.

## Two words to know

- **Image** — the packaged blueprint (app + everything it needs to run).
- **Container** — a running instance of that image.

Think of an image like a recipe, and a container like an actual dish made from it. You can make many containers from one image.

## Writing the recipe (a Dockerfile)

```dockerfile
FROM node:22-alpine       # start from a base with Node installed
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start"]
```

Each line builds on the last, creating a self-contained image with your app baked in — the exact same image runs identically anywhere Docker is installed.

## Don't copy junk into the image

> [!TIP]
> Use a `.dockerignore` file (just like `.gitignore`) to keep `node_modules`, logs, and local build output out of your image. It keeps images small and avoids accidentally shipping stale local files.

## In one sentence

Docker packages your app and its dependencies into a portable **image**, and a running copy of that image is called a **container** — this solves "works on my machine" by making the environment identical everywhere.

## Want to go deeper?

Switch to **Expert** mode above for Dockerfile best practices and keeping images small.
