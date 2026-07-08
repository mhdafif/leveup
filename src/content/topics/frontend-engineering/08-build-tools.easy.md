---
title: Build Tools & Bundlers
order: 8
estMinutes: 12
difficulty: easy
checklist:
  - Explain what a bundler does (module resolution, tree shaking, code splitting)
  - Compare Vite and Webpack on speed, configuration, and use cases
  - Configure environment variables safely for browser bundles
  - Interpret a build output (chunk sizes, asset hashes, source maps)
  - Explain why esbuild is fast and where it fits in the toolchain
---

You write code across dozens of neat files using modern features. But browsers want a few optimized files. A **bundler** is the machine that packs your source files into browser-ready assets — combining them, converting TypeScript to JavaScript, shrinking them, and more.

## What a bundler actually does

Starting from your entry file, it follows all your `import`s and:

- **Bundles** many files into a few.
- **Converts** modern code (TypeScript, JSX) into plain JavaScript browsers understand.
- **Tree-shakes** — drops code you imported but never used, so the bundle stays lean.
- **Splits** — separates rarely-used pages into their own files that load on demand.

The end result is small, fast, browser-ready files in a `dist/` folder.

## The popular tool: Vite

**Vite** is the modern default. It's loved because its dev server starts instantly and updates the moment you save. For most new projects (React, Vue, Svelte), you barely need to configure it:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

The older **Webpack** does the same job but is slower and more configuration-heavy — you'll meet it mostly in existing/legacy projects.

## Environment variables (and a safety trap)

You'll often need values like an API URL. The bundler swaps these in at build time — but only variables with the right prefix are shared with the browser:

```bash
VITE_API_URL=https://api.example.com   # visible in the browser ✅
DATABASE_URL=postgres://secret         # NOT shared — no prefix
```

> [!WARNING]
> Never put secrets (real API keys, passwords) in browser-exposed variables like `VITE_*`. Anything prefixed that way gets baked into your JavaScript and is visible to anyone who opens DevTools. Secrets belong on the server only.

## Reading the build output

After a build, glance at the file list:

- **Chunk sizes** — a single JavaScript file over ~150 KB is worth investigating (probably a heavy library).
- **Hashed filenames** like `main.a3f9b2.js` — this is good; it lets browsers cache files safely, since the name changes whenever the content does.

## In one sentence

A bundler packs your many source files into a few optimized, browser-ready files (converting, tree-shaking, and splitting along the way) — **Vite** is the fast modern default, and never put secrets in browser-exposed `VITE_*` variables.

## Want to go deeper?

Switch to **Expert** mode above for the full Vite-vs-Webpack comparison, esbuild, source maps, and reading bundle analyzers.
