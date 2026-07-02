# LevelUp — Learning Tracker

A fast, installable (PWA) study tracker. Write your theory in Markdown; track
progress with checklists and percentages; earn coins and badges, and spend the
coins in a personal reward shop. Everything is stored in your browser — no
account, no backend.

Built with **Astro + Svelte islands + Tailwind CSS v4 + TypeScript**. Content
pages ship zero framework JS; only the interactive bits hydrate.

## Quick start

```bash
pnpm install
pnpm dev        # http://localhost:4321
```

| Command | Action |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Build to `dist/` and generate the search index |
| `pnpm preview` | Serve the production build locally |
| `pnpm test` | Run the unit tests (Vitest) |

## Adding study content

There are two ways to add topics:

1. **In the app (no rebuild)** — on the home page, click **Add topic** and
   upload (or paste) a single Markdown file. It's saved in your browser and
   tracked just like built-in topics. The file format is one topic per file
   (`# subtopics` + `## Checklist` task lists) — see
   [`docs/specs/2026-06-27-topic-markdown-format.md`](docs/specs/2026-06-27-topic-markdown-format.md)
   and the starter at [`public/templates/topic-template.md`](public/templates/topic-template.md).
2. **In the repo (built-in)** — add Markdown under `src/content/topics/` and
   rebuild, as below.

### Built-in content

Content lives in `src/content/topics/`. A **topic** is a folder; each
**subtopic** (lesson) is a Markdown file inside it.

```
src/content/topics/
  my-topic/
    _topic.md        # topic metadata
    01-first-lesson.md
    02-second-lesson.md
```

### Topic metadata — `_topic.md`

```markdown
---
title: My Topic
order: 1
description: One-line summary shown on the card.
icon: "📦"        # optional emoji
---
```

### A lesson — `NN-slug.md`

The numeric prefix sets the order; it's stripped from the URL
(`01-arrays.md` → `/topics/my-topic/arrays`).

```markdown
---
title: Arrays
order: 1
estMinutes: 20            # optional
difficulty: easy          # optional: easy | medium | hard
checklist:
  - First thing to learn
  - Second thing to learn
---

Your theory goes here. You can use:

- Syntax-highlighted code blocks
- Callouts: `> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`, `> [!CAUTION]`, `> [!IMPORTANT]`
- Mermaid diagrams in a ```mermaid fenced block
```

Each item in `checklist` becomes a tickable box that drives the lesson, topic,
and overall completion percentages.

## How it works

- **Progress, coins, notes, badges** live in one `localStorage` key
  (`levelup:data`). Export/import a JSON backup from the **Stats** page to move
  between devices.
- **Gamification** is tunable in `src/data/config.ts` (coin rules), and the
  reward catalog in `src/data/rewards.ts`.
- **Search** is built at deploy time with Pagefind (runs in the browser).
- **PWA**: installable and works offline after the first visit (over HTTPS).

The codebase keeps pure logic (`src/lib/progress.ts`, `gamification.ts`,
`format.ts`, `persistence.ts`) separate from the Svelte store
(`src/lib/store.ts`) and UI. All persistence flows through a `PersistenceAdapter`
interface, so a future database/backend can be added without touching the UI.

## Deploying

See [`deploy/README.md`](deploy/README.md) for nginx / Docker instructions for a
VPS. In short: `pnpm build`, then serve the static `dist/` folder.
