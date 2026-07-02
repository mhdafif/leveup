# STRATA Design System Retheme — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace LevelUp's emerald/amber light+dark Tailwind theme with the STRATA dark-only "field research console" design system across every component, page, and PWA asset.

**Architecture:** Tailwind v4 `@theme` tokens (primitives → semantic CSS custom properties) drive all utility classes (`bg-panel`, `text-active`, `font-data`, etc.). A small `global.css` layer adds only what utilities can't express: the stamp-in keyframe + reduced-motion override, the global focus-visible ring, and lesson-content (`.prose`) typography. Every `dark:` Tailwind variant is removed — there is exactly one theme.

**Tech Stack:** Astro 7 (static), Svelte 5 islands, Tailwind v4 (`@tailwindcss/vite`), nanostores, Shiki (single dark theme), Mermaid (client-rendered), Pagefind.

**Spec:** `docs/specs/2026-06-30-strata-design-system.md` — read this first for full rationale, color/token tables, and the per-component mapping rules. This plan implements it.

## Global Constraints

- Dark-only. No `dark:` Tailwind variant anywhere in the codebase after this plan completes.
- `bg-active` (amber) = in-progress/primary signal. `bg-complete` (emerald) = "complete" state only, never reused elsewhere.
- Any number, code, status word, or timestamp uses `font-data` (IBM Plex Mono). `font-display` (Fraunces) is reserved for section titles / rank callouts only — used rarely.
- Cards: `bg-panel border border-line rounded-md`, no shadows. Rows: `bg-transparent hover:bg-panel-soft`, real `<button>`/`<a>` elements.
- No git repository in this project — this plan contains no commit steps. Skip any commit step if you are following a sub-skill that normally includes one.
- Existing LevelUp terminology (Topics, Lessons, Checklist, Rewards, Badges) is unchanged — this is a visual-only retheme, no copy/route/prop renames.
- `theme` field stays in `AppData`/persisted store as an inert legacy field — no migration version bump.

---

## File Structure

Files modified (no new files except where noted):

```
src/styles/global.css                 — token @theme block, stamp-in/focus/prose CSS
src/layouts/Base.astro                — font links, theme-color meta
astro.config.mjs                      — Shiki single theme, PWA manifest colors
src/lib/renderMermaid.ts              — STRATA-matched mermaid themeVariables
src/lib/store.ts                      — remove toggleTheme/setTheme dead exports (kept as no-op field)
src/components/*.svelte, *.astro      — strip `dark:`, apply STRATA tokens (~28 files, listed per phase)
src/pages/*.astro, src/pages/topics/[topic]/*.astro — strip `dark:`
public/favicon.svg, scripts/gen-icons.mjs — recolor ink/amber
public/icons/*.png                    — regenerated via scripts/gen-icons.mjs (Task in Phase 9)
```

No new components are introduced. Status indication (not-started/in-progress/complete) is expressed inline with a small colored `<span>` dot where needed (`TopicCard.astro`, `LessonRow.astro`) rather than as a new shared component — it's a 3-state one-line conditional, not enough surface to justify a new file per YAGNI.

---

## Phase 1 — Token & global CSS foundation

### Task 1: Replace color/typography/spacing tokens in global.css

**Files:**
- Modify: `src/styles/global.css:1-23`

**Interfaces:**
- Produces: Tailwind utility classes `bg-ink`, `bg-panel`, `bg-panel-soft`, `border-line`, `text-text-primary`, `text-text-muted`, `bg-active`/`text-active`/`border-active`, `bg-active-soft`, `bg-complete`/`text-complete`, `bg-info`/`text-info`, `bg-urgency`/`text-urgency`, `bg-paper`/`text-paper`, `font-display`, `font-body`, `font-data`. All later tasks consume these.

- [ ] **Step 1: Replace the `@custom-variant` line and `@theme` block**

Replace:
```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-primary-50: #ecfdf5;
  --color-primary-100: #d1fae5;
  --color-primary-200: #a7f3d0;
  --color-primary-300: #6ee7b7;
  --color-primary-400: #34d399;
  --color-primary-500: #10b981;
  --color-primary-600: #059669;
  --color-primary-700: #047857;
  --color-primary-800: #065f46;
  --color-primary-900: #064e3b;
  --color-primary-950: #022c22;

  --color-coin-300: #fcd34d;
  --color-coin-400: #fbbf24;
  --color-coin-500: #f59e0b;
  --color-coin-600: #d97706;
}
```

With:
```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  /* Tier 1 — primitives */
  --color-slate-950: #0B0F14;
  --color-slate-900: #121822;
  --color-slate-850: #1A2230;
  --color-slate-800: #232C3A;
  --color-slate-400: #76869C;
  --color-slate-200: #CFD8E3;
  --color-amber-500: #F5A623;
  --color-amber-950: #3A2B12;
  --color-teal-400: #2DD4BF;
  --color-emerald-400: #34D399;
  --color-rose-500: #F43F5E;
  --color-paper-100: #ECE4D3;

  /* Tier 2 — semantic (the re-theme surface) */
  --color-ink: var(--color-slate-950);
  --color-panel: var(--color-slate-900);
  --color-panel-soft: var(--color-slate-850);
  --color-line: var(--color-slate-800);
  --color-text-primary: var(--color-slate-200);
  --color-text-muted: var(--color-slate-400);
  --color-active: var(--color-amber-500);
  --color-active-soft: var(--color-amber-950);
  --color-complete: var(--color-emerald-400);
  --color-info: var(--color-teal-400);
  --color-urgency: var(--color-rose-500);
  --color-paper: var(--color-paper-100);

  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-data: "IBM Plex Mono", ui-monospace, monospace;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
}
```

Note: `@custom-variant dark` is removed entirely — there is only one theme, so no `dark:` variant exists after this task. Any `dark:` class left in a component file is now a dead/unrecognized utility; Phase 2–8 tasks strip them.

- [ ] **Step 2: Verify Tailwind compiles the new tokens**

Run: `pnpm build 2>&1 | rtk summary`
Expected: build proceeds past the CSS step without "unknown utility" errors for `bg-panel`/`text-active` once at least one component uses them (later tasks). At this point in isolation, expect a clean build since no component references the new classes yet — this step only confirms the `@theme` block itself is valid CSS.

---

### Task 2: body/base styles + markdown alert remap in global.css

**Files:**
- Modify: `src/styles/global.css` (the `@layer base` block and the `.markdown-alert-*` rules, now starting around line 25 after Task 1's edit)

**Interfaces:**
- Consumes: tokens from Task 1 (`bg-ink`, `text-text-primary`, `font-body`, `--color-active`, `--color-info`, `--color-urgency`).

- [ ] **Step 1: Replace `@layer base` block**

Replace:
```css
@layer base {
  :root {
    color-scheme: light;
  }
  .dark {
    color-scheme: dark;
  }
  body {
    @apply bg-zinc-50 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100;
  }
  a {
    @apply transition-colors;
  }
}
```

With:
```css
@layer base {
  :root {
    color-scheme: dark;
  }
  body {
    @apply bg-ink text-text-primary font-body antialiased;
  }
  a {
    @apply transition-colors;
  }
}
```

- [ ] **Step 2: Remove the Shiki dual-theme override block**

Remove entirely (Shiki moves to a single theme in Task 4, so there is no `.dark` class to key off):
```css
/* Shiki dual-theme: swap to the dark palette when .dark is active. */
.dark .astro-code,
.dark .astro-code span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}
```

- [ ] **Step 3: Remap markdown-alert colors from sky/violet/red onto STRATA signals**

Replace:
```css
.markdown-alert-note {
  @apply border-sky-500 bg-sky-50 dark:bg-sky-950/40;
}
.markdown-alert-note .markdown-alert-title {
  @apply text-sky-700 dark:text-sky-300;
}
.markdown-alert-tip {
  @apply border-primary-500 bg-primary-50 dark:bg-primary-950/40;
}
.markdown-alert-tip .markdown-alert-title {
  @apply text-primary-700 dark:text-primary-300;
}
.markdown-alert-important {
  @apply border-violet-500 bg-violet-50 dark:bg-violet-950/40;
}
.markdown-alert-important .markdown-alert-title {
  @apply text-violet-700 dark:text-violet-300;
}
.markdown-alert-warning {
  @apply border-amber-500 bg-amber-50 dark:bg-amber-950/40;
}
.markdown-alert-warning .markdown-alert-title {
  @apply text-amber-700 dark:text-amber-300;
}
.markdown-alert-caution {
  @apply border-red-500 bg-red-50 dark:bg-red-950/40;
}
.markdown-alert-caution .markdown-alert-title {
  @apply text-red-700 dark:text-red-300;
}
```

With:
```css
.markdown-alert-note {
  @apply border-info bg-panel;
}
.markdown-alert-note .markdown-alert-title {
  @apply text-info;
}
.markdown-alert-tip {
  @apply border-active bg-panel;
}
.markdown-alert-tip .markdown-alert-title {
  @apply text-active;
}
.markdown-alert-important {
  @apply border-info bg-panel;
}
.markdown-alert-important .markdown-alert-title {
  @apply text-info font-bold;
}
.markdown-alert-warning {
  @apply border-active bg-panel;
}
.markdown-alert-warning .markdown-alert-title {
  @apply text-active font-bold;
}
.markdown-alert-caution {
  @apply border-urgency bg-panel;
}
.markdown-alert-caution .markdown-alert-title {
  @apply text-urgency;
}
```

- [ ] **Step 4: Verify**

Run: `pnpm build 2>&1 | rtk summary`
Expected: no CSS errors.

---

### Task 3: Stamp-in animation, focus ring, lesson typography in global.css

**Files:**
- Modify: `src/styles/global.css` (append after the mermaid block at the end of the file)

**Interfaces:**
- Produces: `.stamp-in` class (consumed by `ChecklistItem.svelte` in Phase 3), global `:focus-visible` styling, `.prose` heading/code font overrides (applies automatically to lesson `article.prose` in `[lesson].astro` and `UserTopicView.svelte`).

- [ ] **Step 1: Append stamp-in keyframe + reduced-motion override**

Add to the end of `global.css`:
```css
/* Stamp-in: plays when a checklist item is marked complete. */
@keyframes strata-stamp {
  0% { transform: scale(0.85); opacity: 0.4; }
  60% { transform: scale(1.12); }
  100% { transform: scale(1); opacity: 1; }
}
.stamp-in {
  animation: strata-stamp 260ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
@media (prefers-reduced-motion: reduce) {
  .stamp-in {
    animation: none !important;
  }
  .row-hover {
    transition: none !important;
  }
}

/* Focus is always visible — this is a console, not a brochure. */
*:focus-visible {
  outline: 2px solid var(--color-active);
  outline-offset: 2px;
}

/* Lesson content typography: display font for headings, mono for code/data. */
.prose :where(h1, h2, h3, h4) {
  font-family: var(--font-display);
}
.prose :where(code, pre) {
  font-family: var(--font-data);
}
```

Note: `.row-hover` is a convention introduced in Phase 2+ tasks — any element using `hover:bg-panel-soft transition` for a row should also carry the `row-hover` class so reduced-motion users get instant state changes instead of a fade. Apply it alongside `transition` wherever a row pattern is built.

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`
Expected: build succeeds, no CSS errors.

---

### Task 4: Single-theme Shiki + PWA manifest colors in astro.config.mjs

**Files:**
- Modify: `astro.config.mjs:17-50`

**Interfaces:**
- Produces: Shiki renders all code blocks with `github-dark-default` only (no `.dark`-class toggling needed, matching Task 2 Step 2's removal of the dual-theme CSS override).

- [ ] **Step 1: Update manifest theme/background colors**

Replace:
```js
        theme_color: '#059669',
        background_color: '#09090b',
```

With:
```js
        theme_color: '#0B0F14',
        background_color: '#0B0F14',
```

- [ ] **Step 2: Switch Shiki from dual-theme to single dark theme**

Replace:
```js
  markdown: {
    remarkPlugins: [remarkMermaid, remarkAlert],
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
```

With:
```js
  markdown: {
    remarkPlugins: [remarkMermaid, remarkAlert],
    shikiConfig: {
      theme: 'github-dark-default',
      wrap: true,
    },
  },
```

- [ ] **Step 3: Verify**

Run: `pnpm build 2>&1 | rtk summary`
Expected: build succeeds. Spot-check one built lesson page's `<pre class="astro-code">` in `dist/` — it should carry inline Shiki dark colors with no `.dark` class dependency.

---

### Task 5: STRATA-matched Mermaid theme

**Files:**
- Modify: `src/lib/renderMermaid.ts:1-28`

**Interfaces:**
- Consumes: no new interfaces (self-contained runtime config change).
- Produces: diagrams rendered with panel/line/text-primary/amber coloring instead of mermaid's built-in light/dark themes.

- [ ] **Step 1: Replace the theme selection with a fixed STRATA-matched theme**

Replace:
```ts
  const { default: mermaid } = await import("mermaid");
  const dark = document.documentElement.classList.contains("dark");
  mermaid.initialize({
    startOnLoad: false,
    theme: dark ? "dark" : "default",
    securityLevel: "loose",
  });
```

With:
```ts
  const { default: mermaid } = await import("mermaid");
  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    themeVariables: {
      darkMode: true,
      background: "#0B0F14",
      primaryColor: "#121822",
      primaryTextColor: "#CFD8E3",
      primaryBorderColor: "#232C3A",
      lineColor: "#76869C",
      secondaryColor: "#1A2230",
      tertiaryColor: "#1A2230",
      textColor: "#CFD8E3",
      mainBkg: "#121822",
      nodeBorder: "#232C3A",
      clusterBkg: "#1A2230",
      clusterBorder: "#232C3A",
      edgeLabelBackground: "#0B0F14",
      fontFamily: "Inter, system-ui, sans-serif",
    },
    securityLevel: "loose",
  });
```

- [ ] **Step 2: Remove the now-unused theme-change re-render effect**

`UserTopicView.svelte` (Phase 7) has an `$effect` that calls `renderMermaidDiagrams()` whenever `$appData.theme` changes — that effect becomes dead weight since the theme never changes. It's removed in the Phase 7 task for that file; no action needed here.

- [ ] **Step 3: Verify**

Run: `pnpm build 2>&1 | rtk summary`
Then start dev server and view a lesson with a mermaid diagram (e.g. `/topics/cs-fundamentals/bfs-dfs`): diagram background/text should read dark ink/panel with no light-theme flash.

---

## Phase 2 — Layout shell (Base.astro, SiteHeader, theme cleanup)

### Task 6: Delete ThemeScript.astro and ThemeToggle.svelte, simplify Base.astro

**Files:**
- Delete: `src/components/ThemeScript.astro`
- Delete: `src/components/ThemeToggle.svelte`
- Modify: `src/layouts/Base.astro:1-32`

**Interfaces:**
- Consumes: nothing new.
- Produces: `Base.astro` head no longer imports `ThemeScript`; `SiteHeader.astro` (Task 7) no longer imports `ThemeToggle`.

- [ ] **Step 1: Delete the two files**

Run: `rm src/components/ThemeScript.astro src/components/ThemeToggle.svelte`

- [ ] **Step 2: Update Base.astro — remove ThemeScript import/usage, add fonts, fix theme-color, set lang html static dark**

Replace:
```astro
---
import "../styles/global.css";
import ThemeScript from "../components/ThemeScript.astro";
import SiteHeader from "../components/SiteHeader.astro";
import Confetti from "../components/Confetti.svelte";
import Toast from "../components/Toast.svelte";
import SearchModal from "../components/SearchModal.svelte";

interface Props {
  title?: string;
  description?: string;
}
const { title = "LevelUp", description = "Track your learning, level up." } =
  Astro.props;
const fullTitle = title === "LevelUp" ? title : `${title} · LevelUp`;
// PWA assets only exist in the production build; skip them in dev.
const isProd = import.meta.env.PROD;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <meta name="theme-color" content="#059669" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
    {isProd && <link rel="manifest" href="/manifest.webmanifest" />}
    <title>{fullTitle}</title>
    <ThemeScript />
    {isProd && <script is:inline src="/registerSW.js"></script>}
  </head>
  <body class="min-h-dvh">
```

With:
```astro
---
import "../styles/global.css";
import SiteHeader from "../components/SiteHeader.astro";
import Confetti from "../components/Confetti.svelte";
import Toast from "../components/Toast.svelte";
import SearchModal from "../components/SearchModal.svelte";

interface Props {
  title?: string;
  description?: string;
}
const { title = "LevelUp", description = "Track your learning, level up." } =
  Astro.props;
const fullTitle = title === "LevelUp" ? title : `${title} · LevelUp`;
// PWA assets only exist in the production build; skip them in dev.
const isProd = import.meta.env.PROD;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <meta name="theme-color" content="#0B0F14" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
    {isProd && <link rel="manifest" href="/manifest.webmanifest" />}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fraunces:wght@600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;600&display=swap"
      rel="stylesheet"
    />
    <title>{fullTitle}</title>
    {isProd && <script is:inline src="/registerSW.js"></script>}
  </head>
  <body class="min-h-dvh">
```

No-flash logic is no longer needed: there's only one theme, so `<html>` never needs a class toggle and there's nothing for a script to apply before paint.

- [ ] **Step 3: Verify**

Run: `pnpm build 2>&1 | rtk summary`
Expected: build succeeds (SiteHeader still imports ThemeToggle until Task 7 runs — if you run Task 6 and 7 separately, expect a build failure on ThemeToggle import between steps; run them together or in immediate sequence).

---

### Task 7: Recolor SiteHeader.astro, remove ThemeToggle usage

**Files:**
- Modify: `src/components/SiteHeader.astro:1-72`

**Interfaces:**
- Consumes: `CoinBalance.svelte` (Task 11) — still mounted, just restyled in its own task.
- Produces: header matches STRATA's eyebrow + app-name pattern, active nav state uses `active` (amber) token.

- [ ] **Step 1: Replace the whole file**

Replace:
```astro
---
import ThemeToggle from "./ThemeToggle.svelte";
import CoinBalance from "./CoinBalance.svelte";

// Top navigation bar. Coin balance and theme toggle are interactive islands.
const links = [
  { href: "/", label: "Topics" },
  { href: "/rewards", label: "Rewards" },
  { href: "/stats", label: "Stats" },
];
const path = Astro.url.pathname;
const isActive = (href: string) =>
  href === "/" ? path === "/" : path.startsWith(href);

const searchBtnClass =
  "rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100";
---
<header
  class="sticky top-0 z-40 border-b border-zinc-200 bg-zinc-50/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80"
>
  <div class="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
    <a href="/" class="flex items-center gap-2 font-semibold text-primary-600 dark:text-primary-400">
      <span class="grid h-7 w-7 place-items-center rounded-lg bg-primary-600 text-sm text-white">L</span>
      LevelUp
    </a>
    <nav class="ml-2 hidden gap-1 sm:flex">
      {links.map((l) => (
        <a
          href={l.href}
          class:list={[
            "rounded-md px-3 py-1.5 text-sm font-medium",
            isActive(l.href)
              ? "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
              : "text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
          ]}
        >
          {l.label}
        </a>
      ))}
      <button type="button" data-search-trigger class={searchBtnClass}>Search</button>
    </nav>
    <div class="ml-auto flex items-center gap-2">
      <CoinBalance client:load />
      <ThemeToggle client:load />
    </div>
  </div>
  <nav class="flex gap-1 overflow-x-auto border-t border-zinc-200 px-2 py-1.5 sm:hidden dark:border-zinc-800">
    {links.map((l) => (
      <a
        href={l.href}
        class:list={[
          "rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap",
          isActive(l.href)
            ? "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300"
            : "text-zinc-600 dark:text-zinc-400",
        ]}
      >
        {l.label}
      </a>
    ))}
    <button type="button" data-search-trigger class={searchBtnClass}>Search</button>
  </nav>
</header>

<script>
  // Open the global search modal (mounted in the layout) from the header buttons.
  document.querySelectorAll("[data-search-trigger]").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("levelup:open-search"));
    });
  });
</script>
```

With:
```astro
---
import CoinBalance from "./CoinBalance.svelte";

// Top navigation bar. Coin balance is the only interactive island here.
const links = [
  { href: "/", label: "Topics" },
  { href: "/rewards", label: "Rewards" },
  { href: "/stats", label: "Stats" },
];
const path = Astro.url.pathname;
const isActive = (href: string) =>
  href === "/" ? path === "/" : path.startsWith(href);

const searchBtnClass =
  "row-hover rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap text-text-muted hover:text-text-primary transition";
---
<header class="sticky top-0 z-40 border-b border-line bg-ink/95 backdrop-blur">
  <div class="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3">
    <a href="/" class="flex items-center gap-2">
      <span class="grid h-7 w-7 place-items-center rounded-md bg-ink text-sm font-data text-active">L</span>
      <span class="font-data text-[11px] tracking-widest text-text-muted uppercase">LevelUp</span>
    </a>
    <nav class="ml-2 hidden gap-1 sm:flex">
      {links.map((l) => (
        <a
          href={l.href}
          class:list={[
            "row-hover rounded-md px-3 py-1.5 text-sm font-medium transition",
            isActive(l.href)
              ? "bg-active-soft text-active"
              : "text-text-muted hover:text-text-primary",
          ]}
        >
          {l.label}
        </a>
      ))}
      <button type="button" data-search-trigger class={searchBtnClass}>Search</button>
    </nav>
    <div class="ml-auto flex items-center gap-2">
      <CoinBalance client:load />
    </div>
  </div>
  <nav class="flex gap-1 overflow-x-auto border-t border-line px-2 py-1.5 sm:hidden">
    {links.map((l) => (
      <a
        href={l.href}
        class:list={[
          "row-hover rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition",
          isActive(l.href) ? "bg-active-soft text-active" : "text-text-muted",
        ]}
      >
        {l.label}
      </a>
    ))}
    <button type="button" data-search-trigger class={searchBtnClass}>Search</button>
  </nav>
</header>

<script>
  // Open the global search modal (mounted in the layout) from the header buttons.
  document.querySelectorAll("[data-search-trigger]").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("levelup:open-search"));
    });
  });
</script>
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`
Expected: build succeeds, no missing-import errors.

---

### Task 8: Remove dead theme exports from store.ts

**Files:**
- Modify: `src/lib/store.ts:142-150`

**Interfaces:**
- Consumes: nothing new.
- Produces: `setTheme`/`toggleTheme` no longer exported (no remaining callers after Task 6/7 deleted `ThemeToggle.svelte`).

- [ ] **Step 1: Confirm no remaining callers**

Run: `rtk grep "toggleTheme\|setTheme" src`
Expected: only the definitions in `store.ts` itself remain (Task 6/7 already removed the only call sites).

- [ ] **Step 2: Remove the two exports**

Replace:
```ts
export function setTheme(theme: "light" | "dark"): void {
  const prev = appData.get();
  appData.set({ ...prev, theme });
  if (isBrowser) document.documentElement.classList.toggle("dark", theme === "dark");
}

export function toggleTheme(): void {
  setTheme(appData.get().theme === "dark" ? "light" : "dark");
}

```

With: *(nothing — delete the block)*

- [ ] **Step 3: Simplify the remaining theme bookkeeping**

`src/lib/store.ts:24-35` (`initialData`) and `:40-44` still branch on system color scheme and toggle the `dark` class. Since there's only one theme now, replace:

```ts
function initialData(): AppData {
  if (!isBrowser) return defaultData();
  const hadKey = localStorage.getItem(STORAGE_KEY) !== null;
  const data = adapter.load();
  // On first run (no stored key), follow the system colour scheme.
  if (!hadKey) {
    data.theme = window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return data;
}

/** The single source of truth, shared across every island. */
export const appData = atom<AppData>(initialData());

if (isBrowser) {
  appData.listen((value) => adapter.save(value));
  // Reflect the persisted theme on the root element immediately.
  document.documentElement.classList.toggle("dark", appData.get().theme === "dark");
}
```

With:
```ts
function initialData(): AppData {
  if (!isBrowser) return defaultData();
  return adapter.load();
}

/** The single source of truth, shared across every island. */
export const appData = atom<AppData>(initialData());

if (isBrowser) {
  appData.listen((value) => adapter.save(value));
}
```

- [ ] **Step 4: Remove the remaining `dark` class toggle in `importData`**

`src/lib/store.ts` around line 200-205 (`importData`) also toggles the `dark` class after importing. Replace:
```ts
export function importData(json: string): boolean {
  try {
    appData.set(migrate(JSON.parse(json)));
    if (isBrowser) {
      document.documentElement.classList.toggle("dark", appData.get().theme === "dark");
```

With:
```ts
export function importData(json: string): boolean {
  try {
    appData.set(migrate(JSON.parse(json)));
    if (isBrowser) {
```

Keep whatever follows on the next lines inside that `if (isBrowser)` block unchanged (re-check `src/lib/store.ts` after Step 3's edit for the exact remaining lines — only the `classList.toggle` line is removed, nothing else in that block).

- [ ] **Step 5: Verify**

Run: `pnpm build 2>&1 | rtk summary`
Then: `rtk grep "classList.toggle.*dark\|toggleTheme\|setTheme" src`
Expected: build succeeds, grep returns no matches.

---

## Phase 3 — Shared primitives (ProgressBar, LevelMeter, CoinBalance, Checklist)

### Task 9: Recolor ProgressBar.svelte

**Files:**
- Modify: `src/components/ProgressBar.svelte:12-30`

**Interfaces:**
- Consumes: tokens from Task 1.
- Produces: `<ProgressBar fraction showLabel />` — same props/signature as before, used by `LessonProgress.svelte`, `TopicProgress.svelte`, `StatsSummary.svelte`. Fill flips to `bg-complete` at 100%, otherwise `bg-active`.

- [ ] **Step 1: Replace the template**

Replace:
```svelte
<div class="flex items-center gap-2">
  <div
    class="h-2 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"
    role="progressbar"
    aria-valuenow={percent}
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div
      class="h-full rounded-full bg-primary-600 transition-[width] duration-300"
      style={`width:${percent}%`}
    ></div>
  </div>
  {#if showLabel}
    <span class="w-9 text-right text-sm tabular-nums text-zinc-500 dark:text-zinc-400"
      >{percent}%</span
    >
  {/if}
</div>
```

With:
```svelte
<div class="flex items-center gap-2">
  <div
    class="h-2 flex-1 overflow-hidden rounded-full bg-line"
    role="progressbar"
    aria-valuenow={percent}
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div
      class={`h-full rounded-full transition-[width] duration-300 ${percent >= 100 ? "bg-complete" : "bg-active"}`}
      style={`width:${percent}%`}
    ></div>
  </div>
  {#if showLabel}
    <span class="w-9 text-right font-data text-sm tabular-nums text-text-muted"
      >{percent}%</span
    >
  {/if}
</div>
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`

---

### Task 10: Recolor LevelMeter.svelte

**Files:**
- Modify: `src/components/LevelMeter.svelte:11-23`

**Interfaces:**
- Consumes: tokens from Task 1. Same `{xp, compact}` props as before.

- [ ] **Step 1: Replace the template**

Replace:
```svelte
<div class="flex items-center gap-2">
  <span
    class="grid h-6 min-w-6 place-items-center rounded-md bg-primary-100 px-1.5 text-xs font-semibold text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"
    title={`${meter.into}/${meter.needed} XP to next level`}
  >
    Lv {level}
  </span>
  {#if !compact}
    <div class="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
      <div class="h-full rounded-full bg-primary-500" style={`width:${Math.round(fraction * 100)}%`}></div>
    </div>
  {/if}
</div>
```

With:
```svelte
<div class="flex items-center gap-2">
  <span
    class="grid h-6 min-w-6 place-items-center rounded-md bg-active-soft px-1.5 font-data text-xs font-semibold text-active"
    title={`${meter.into}/${meter.needed} XP to next level`}
  >
    Lv {level}
  </span>
  {#if !compact}
    <div class="h-1.5 w-16 overflow-hidden rounded-full bg-line">
      <div class="h-full rounded-full bg-active" style={`width:${Math.round(fraction * 100)}%`}></div>
    </div>
  {/if}
</div>
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`

---

### Task 11: Recolor CoinBalance.svelte

**Files:**
- Modify: `src/components/CoinBalance.svelte:9-21`

**Interfaces:**
- Consumes: `LevelMeter.svelte` (Task 10).

- [ ] **Step 1: Replace the template**

Replace:
```svelte
<div class="flex items-center gap-2 sm:gap-3">
  <a
    href="/rewards"
    class="flex items-center gap-1.5 rounded-lg bg-coin-500/10 px-2.5 py-1.5 text-sm font-semibold text-coin-600 hover:bg-coin-500/20 dark:text-coin-400"
    title="Coins — spend them in the reward shop"
  >
    <span aria-hidden="true">🪙</span>
    <span class="tabular-nums">{coins}</span>
  </a>
  <div class="hidden sm:block">
    <LevelMeter {xp} />
  </div>
</div>
```

With:
```svelte
<div class="flex items-center gap-2 sm:gap-3">
  <a
    href="/rewards"
    class="row-hover flex items-center gap-1.5 rounded-md bg-active-soft px-2.5 py-1.5 font-data text-sm font-semibold text-active transition hover:bg-panel-soft"
    title="Coins — spend them in the reward shop"
  >
    <span aria-hidden="true">🪙</span>
    <span class="tabular-nums">{coins}</span>
  </a>
  <div class="hidden sm:block">
    <LevelMeter {xp} />
  </div>
</div>
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`

---

### Task 12: Recolor ChecklistItem.svelte — status-dot styling + stamp-in

**Files:**
- Modify: `src/components/ChecklistItem.svelte:13-29`

**Interfaces:**
- Consumes: `.stamp-in` class from Task 3 (Phase 1).
- Produces: same `{label, checked, onToggle}` props as before. Visual: row pattern, checkbox accent-colored amber while unchecked-hover and emerald when checked, label gets `.stamp-in` momentarily on check via a local `$state` flag.

- [ ] **Step 1: Replace the whole template + add stamp trigger logic**

Replace:
```svelte
<script lang="ts">
  let {
    label,
    checked = false,
    onToggle,
  }: {
    label: string;
    checked?: boolean;
    onToggle: (checked: boolean) => void;
  } = $props();
</script>

<label
  class="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
>
  <input
    type="checkbox"
    class="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-zinc-300 text-primary-600 accent-primary-600 focus:ring-primary-500 dark:border-zinc-600"
    {checked}
    onchange={(e) => onToggle(e.currentTarget.checked)}
  />
  <span
    class:line-through={checked}
    class:text-zinc-400={checked}
    class="text-sm leading-6 text-zinc-700 dark:text-zinc-300"
  >
    {label}
  </span>
</label>
```

With:
```svelte
<script lang="ts">
  let {
    label,
    checked = false,
    onToggle,
  }: {
    label: string;
    checked?: boolean;
    onToggle: (checked: boolean) => void;
  } = $props();

  let justChecked = $state(false);

  function handleChange(e: Event) {
    const next = (e.currentTarget as HTMLInputElement).checked;
    if (next && !checked) {
      justChecked = true;
      setTimeout(() => (justChecked = false), 280);
    }
    onToggle(next);
  }
</script>

<label
  class="row-hover flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 transition hover:bg-panel-soft"
>
  <input
    type="checkbox"
    class="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-line bg-panel accent-complete focus-visible:ring-2 focus-visible:ring-active"
    {checked}
    onchange={handleChange}
  />
  <span
    class:stamp-in={justChecked}
    class:line-through={checked}
    class:text-text-muted={checked}
    class="text-sm leading-6 text-text-primary"
  >
    {label}
  </span>
</label>
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`
Then in dev server, check an item on a real lesson page: label should briefly scale in (stamp-in), checkbox accent should read emerald once checked.

---

### Task 13: Recolor Checklist.svelte (the card wrapper + progress header)

**Files:**
- Modify: `src/components/Checklist.svelte:42-68`

**Interfaces:**
- Consumes: `ChecklistItem.svelte` (Task 12).

- [ ] **Step 1: Replace the template**

Replace:
```svelte
<section
  class="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
>
  <div class="mb-2 flex items-center justify-between">
    <h2 class="text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
      Checklist
    </h2>
    <span class="text-sm font-medium tabular-nums text-primary-600 dark:text-primary-400">
      {doneCount}/{items.length} · {pct(fraction)}%
    </span>
  </div>

  <div class="mb-3 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
    <div
      class="h-full rounded-full bg-primary-600 transition-[width] duration-300"
      style={`width:${pct(fraction)}%`}
    ></div>
  </div>

  <ul class="-mx-2">
    {#each items as item, i (i)}
      <li>
        <ChecklistItem label={item} checked={!!state[i]} onToggle={(c) => handle(i, c)} />
      </li>
    {/each}
  </ul>
</section>
```

With:
```svelte
<section class="rounded-md border border-line bg-panel p-4">
  <div class="mb-2 flex items-center justify-between">
    <h2 class="font-data text-xs font-semibold tracking-widest text-text-muted uppercase">
      Checklist
    </h2>
    <span class="font-data text-sm font-medium tabular-nums text-active">
      {doneCount}/{items.length} · {pct(fraction)}%
    </span>
  </div>

  <div class="mb-3 h-2 overflow-hidden rounded-full bg-line">
    <div
      class={`h-full rounded-full transition-[width] duration-300 ${pct(fraction) >= 100 ? "bg-complete" : "bg-active"}`}
      style={`width:${pct(fraction)}%`}
    ></div>
  </div>

  <ul class="-mx-2">
    {#each items as item, i (i)}
      <li>
        <ChecklistItem label={item} checked={!!state[i]} onToggle={(c) => handle(i, c)} />
      </li>
    {/each}
  </ul>
</section>
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`

---

## Phase 4 — Topic/lesson surface

### Task 14: Recolor TopicCard.astro + add status dot

**Files:**
- Modify: `src/components/TopicCard.astro:11-28`

**Interfaces:**
- Consumes: `TopicProgress.svelte` (Task 15).

- [ ] **Step 1: Replace the template**

Replace:
```astro
<a
  href={`/topics/${topic.slug}`}
  class="block rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-primary-400 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-primary-500"
>
  <div class="flex items-center gap-2">
    {topic.icon && <span class="text-xl">{topic.icon}</span>}
    <h2 class="text-lg font-semibold">{topic.title}</h2>
  </div>
  <p class="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
    {topic.description}
  </p>
  <div class="mt-4">
    <TopicProgress topic={topic.slug} lessons={lessons} client:load />
  </div>
  <p class="mt-2 text-xs text-zinc-400">
    {topic.lessons.length} subtopic{topic.lessons.length === 1 ? "" : "s"}
  </p>
</a>
```

With:
```astro
<a
  href={`/topics/${topic.slug}`}
  class="row-hover block rounded-md border border-line bg-panel p-5 transition hover:bg-panel-soft"
>
  <div class="flex items-center gap-2">
    {topic.icon && <span class="text-xl">{topic.icon}</span>}
    <h2 class="text-lg font-semibold text-text-primary">{topic.title}</h2>
  </div>
  <p class="mt-1 line-clamp-2 text-sm text-text-muted">
    {topic.description}
  </p>
  <div class="mt-4">
    <TopicProgress topic={topic.slug} lessons={lessons} client:load />
  </div>
  <p class="mt-2 font-data text-xs text-text-muted">
    {topic.lessons.length} subtopic{topic.lessons.length === 1 ? "" : "s"}
  </p>
</a>
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`

---

### Task 15: Recolor TopicProgress.svelte + add status dot

**Files:**
- Modify: `src/components/TopicProgress.svelte:26-29`

**Interfaces:**
- Consumes: `ProgressBar.svelte` (Task 9).
- Produces: a leading status dot (open/amber/emerald by fraction) ahead of the existing progress bar + label line, satisfying the spec's "mission-row: status dot, title, mono done/total" mapping (title itself stays in `TopicCard.astro`; this island owns the dot + bar + counts).

- [ ] **Step 1: Replace the template**

Replace:
```svelte
<ProgressBar {fraction} />
<div class="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
  {pct(fraction)}% · {counts.done}/{counts.total} done
</div>
```

With:
```svelte
<div class="flex items-center gap-2">
  <span
    class={`h-2.5 w-2.5 shrink-0 rounded-full ${
      fraction >= 1 ? "bg-complete" : fraction > 0 ? "bg-active" : "border border-line"
    }`}
    aria-hidden="true"
  ></span>
  <div class="flex-1">
    <ProgressBar {fraction} />
  </div>
</div>
<div class="mt-1.5 font-data text-sm text-text-muted">
  {pct(fraction)}% · {counts.done}/{counts.total} done
</div>
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`
Then visit `/`: each topic card should show an open ring dot (not started), filled amber dot (partial), or emerald dot (complete) next to its progress bar.

---

### Task 16: Recolor LessonRow.astro + add status dot

**Files:**
- Modify: `src/components/LessonRow.astro:11-30`

**Interfaces:**
- Consumes: `LessonProgress.svelte` (Task 17).

- [ ] **Step 1: Replace the template**

Replace:
```astro
<a
  href={`/topics/${topicSlug}/${lesson.slug}`}
  class="block rounded-xl border border-zinc-200 bg-white px-4 py-3 transition hover:border-primary-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-primary-500"
>
  <div class="flex items-center justify-between gap-3">
    <span class="font-medium">{lesson.title}</span>
    <span class="shrink-0 text-xs text-zinc-400">
      {lesson.difficulty && <span class="capitalize">{lesson.difficulty}</span>}
      {lesson.estMinutes && <span> · {lesson.estMinutes} min</span>}
    </span>
  </div>
  <div class="mt-2">
    <LessonProgress
      topic={topicSlug}
      lesson={lesson.slug}
      len={lesson.checklistLen}
      client:load
    />
  </div>
</a>
```

With:
```astro
<a
  href={`/topics/${topicSlug}/${lesson.slug}`}
  class="row-hover block rounded-md border border-line bg-panel px-4 py-3 transition hover:bg-panel-soft"
>
  <div class="flex items-center justify-between gap-3">
    <span class="font-medium text-text-primary">{lesson.title}</span>
    <span class="shrink-0 font-data text-xs text-text-muted">
      {lesson.difficulty && <span class="capitalize">{lesson.difficulty}</span>}
      {lesson.estMinutes && <span> · {lesson.estMinutes} min</span>}
    </span>
  </div>
  <div class="mt-2">
    <LessonProgress
      topic={topicSlug}
      lesson={lesson.slug}
      len={lesson.checklistLen}
      client:load
    />
  </div>
</a>
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`

---

### Task 17: Recolor LessonProgress.svelte + add status dot

**Files:**
- Modify: `src/components/LessonProgress.svelte:17`

**Interfaces:**
- Consumes: `ProgressBar.svelte` (Task 9). Same `{topic, lesson, len}` props.

- [ ] **Step 1: Replace the template**

Replace:
```svelte
<ProgressBar {fraction} showLabel />
```

With:
```svelte
<div class="flex items-center gap-2">
  <span
    class={`h-2 w-2 shrink-0 rounded-full ${
      fraction >= 1 ? "bg-complete" : fraction > 0 ? "bg-active" : "border border-line"
    }`}
    aria-hidden="true"
  ></span>
  <div class="flex-1">
    <ProgressBar {fraction} showLabel />
  </div>
</div>
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`

---

### Task 18: Recolor LessonDrawer.svelte

**Files:**
- Modify: `src/components/LessonDrawer.svelte` (entire template section, lines 64-155; difficulty color map, lines 34-39)

**Interfaces:**
- Consumes: `Checklist.svelte` pattern is not reused here directly (it renders `ChecklistItem.svelte` inline) — `ChecklistItem.svelte` from Task 12.
- Produces: same `{open, topicSlug, lessonSlug, lessonTitle, checklist, difficulty, estMinutes, onClose}` props as before.

- [ ] **Step 1: Replace the difficulty color map**

Replace:
```ts
  const DIFF_LABEL: Record<string, string> = { easy: "Easy", medium: "Medium", hard: "Hard" };
  const DIFF_COLOR: Record<string, string> = {
    easy: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40",
    medium: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40",
    hard: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/40",
  };
```

With:
```ts
  const DIFF_LABEL: Record<string, string> = { easy: "Easy", medium: "Medium", hard: "Hard" };
  const DIFF_COLOR: Record<string, string> = {
    easy: "text-info bg-panel-soft",
    medium: "text-active bg-active-soft",
    hard: "text-urgency bg-panel-soft",
  };
```

- [ ] **Step 2: Replace the template markup**

Replace the entire block from `{#if open}` through the closing `{/if}` (current lines 66-155):
```svelte
{#if open}
  <!-- backdrop -->
  <div
    class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
    onclick={onClose}
    role="presentation"
  ></div>

  <!-- drawer panel -->
  <div
    class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
    role="dialog"
    aria-modal="true"
    aria-label={lessonTitle}
  >
    <!-- header -->
    <div class="flex items-start justify-between gap-3 border-b border-zinc-200 p-5 dark:border-zinc-800">
      <div class="min-w-0">
        <p class="mb-1 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
          {topicSlug.replace(/-/g, " ")}
        </p>
        <h2 class="text-lg font-bold leading-snug">{lessonTitle}</h2>
        <div class="mt-1.5 flex flex-wrap items-center gap-2">
          {#if difficulty}
            <span class={`rounded-full px-2 py-0.5 text-xs font-medium ${DIFF_COLOR[difficulty]}`}>
              {DIFF_LABEL[difficulty]}
            </span>
          {/if}
          {#if estMinutes}
            <span class="text-xs text-zinc-400">~{estMinutes} min</span>
          {/if}
        </div>
      </div>
      <button
        onclick={onClose}
        class="mt-0.5 shrink-0 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        aria-label="Close"
      >
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"/>
        </svg>
      </button>
    </div>

    <!-- progress bar -->
    <div class="border-b border-zinc-100 px-5 py-3 dark:border-zinc-800">
      <div class="mb-1.5 flex items-center justify-between text-xs">
        <span class="text-zinc-500">Progress</span>
        <span class="font-medium tabular-nums text-primary-600 dark:text-primary-400">
          {doneCount}/{checklist.length} · {pct(fraction)}%
        </span>
      </div>
      <div class="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          class="h-full rounded-full bg-primary-600 transition-[width] duration-300"
          style={`width:${pct(fraction)}%`}
        ></div>
      </div>
    </div>

    <!-- checklist -->
    <div class="flex-1 overflow-y-auto px-5 py-4">
      {#if checklist.length > 0}
        <p class="mb-3 text-xs font-semibold tracking-wide text-zinc-400 uppercase">Checklist</p>
        <ul class="-mx-2 space-y-0.5">
          {#each checklist as item, i (i)}
            <li>
              <ChecklistItem label={item} checked={!!state[i]} onToggle={(c) => handle(i, c)} />
            </li>
          {/each}
        </ul>
      {:else}
        <p class="text-sm text-zinc-400">No checklist items for this lesson.</p>
      {/if}
    </div>

    <!-- footer -->
    <div class="border-t border-zinc-200 p-4 dark:border-zinc-800">
      <a
        href={`/topics/${topicSlug}/${lessonSlug}`}
        class="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
      >
        Open full lesson
        <svg class="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
          <path fill-rule="evenodd" d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/>
        </svg>
      </a>
    </div>
  </div>
{/if}
```

With:
```svelte
{#if open}
  <!-- backdrop -->
  <div
    class="fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm"
    onclick={onClose}
    role="presentation"
  ></div>

  <!-- drawer panel -->
  <div
    class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-line bg-panel shadow-2xl"
    role="dialog"
    aria-modal="true"
    aria-label={lessonTitle}
  >
    <!-- header -->
    <div class="flex items-start justify-between gap-3 border-b border-line p-5">
      <div class="min-w-0">
        <p class="mb-1 font-data text-xs font-semibold tracking-widest text-text-muted uppercase">
          {topicSlug.replace(/-/g, " ")}
        </p>
        <h2 class="text-lg font-bold leading-snug text-text-primary">{lessonTitle}</h2>
        <div class="mt-1.5 flex flex-wrap items-center gap-2">
          {#if difficulty}
            <span class={`rounded-full px-2 py-0.5 font-data text-xs font-medium ${DIFF_COLOR[difficulty]}`}>
              {DIFF_LABEL[difficulty]}
            </span>
          {/if}
          {#if estMinutes}
            <span class="font-data text-xs text-text-muted">~{estMinutes} min</span>
          {/if}
        </div>
      </div>
      <button
        onclick={onClose}
        class="row-hover mt-0.5 shrink-0 rounded-md p-1.5 text-text-muted transition hover:bg-panel-soft hover:text-text-primary"
        aria-label="Close"
      >
        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"/>
        </svg>
      </button>
    </div>

    <!-- progress bar -->
    <div class="border-b border-line px-5 py-3">
      <div class="mb-1.5 flex items-center justify-between font-data text-xs">
        <span class="text-text-muted">Progress</span>
        <span class="font-medium tabular-nums text-active">
          {doneCount}/{checklist.length} · {pct(fraction)}%
        </span>
      </div>
      <div class="h-2 overflow-hidden rounded-full bg-line">
        <div
          class={`h-full rounded-full transition-[width] duration-300 ${pct(fraction) >= 100 ? "bg-complete" : "bg-active"}`}
          style={`width:${pct(fraction)}%`}
        ></div>
      </div>
    </div>

    <!-- checklist -->
    <div class="flex-1 overflow-y-auto px-5 py-4">
      {#if checklist.length > 0}
        <p class="mb-3 font-data text-xs font-semibold tracking-widest text-text-muted uppercase">Checklist</p>
        <ul class="-mx-2 space-y-0.5">
          {#each checklist as item, i (i)}
            <li>
              <ChecklistItem label={item} checked={!!state[i]} onToggle={(c) => handle(i, c)} />
            </li>
          {/each}
        </ul>
      {:else}
        <p class="text-sm text-text-muted">No checklist items for this lesson.</p>
      {/if}
    </div>

    <!-- footer -->
    <div class="border-t border-line p-4">
      <a
        href={`/topics/${topicSlug}/${lessonSlug}`}
        class="flex w-full items-center justify-center gap-2 rounded-md bg-active px-4 py-2.5 text-sm font-semibold text-ink hover:bg-amber-500/90"
      >
        Open full lesson
        <svg class="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
          <path fill-rule="evenodd" d="M6.22 3.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/>
        </svg>
      </a>
    </div>
  </div>
{/if}
```

Note: `bg-active` button text uses `text-ink` (near-black) instead of white — amber is a light/mid-tone fill, dark text reads correctly on it (matches STRATA's `--color-text-onAccent` concept from the original `tokens.ts` reference, simplified here to the existing `ink` token since LevelUp doesn't carry a separate on-accent token).

- [ ] **Step 3: Verify**

Run: `pnpm build 2>&1 | rtk summary`
Then on a `/topics/frontend-path/*` lesson page, click a roadmap cross-reference link and confirm the drawer renders dark/panel/amber correctly.

---

### Task 19: Recolor RoadmapLinks.svelte

**Files:**
- Modify: `src/components/RoadmapLinks.svelte`

**Interfaces:**
- Consumes: `LessonDrawer.svelte` (Task 18) — no prop signature changes, so RoadmapLinks itself needs no logic changes, only confirm no stray color classes exist.

- [ ] **Step 1: Confirm there's nothing to change**

`RoadmapLinks.svelte` (as built) contains no `dark:` classes or color utilities of its own — it only wires click interception and passes data to `LessonDrawer`. No edit needed; this task exists to make that explicit and to be the checkpoint for verifying Task 18's drawer renders correctly when triggered from this component.

- [ ] **Step 2: Verify**

Run: `rtk grep "dark:" src/components/RoadmapLinks.svelte`
Expected: no matches.

---

## Phase 5 — Gamification surfaces

### Task 20: Recolor DailyGoal.svelte

**Files:**
- Modify: `src/components/DailyGoal.svelte:13-35`

- [ ] **Step 1: Replace the template**

Replace:
```svelte
<div
  class="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
>
  <div class="flex items-center justify-between">
    <span class="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
      <span aria-hidden="true">🎯</span> Daily goal
    </span>
    <span class="text-sm tabular-nums text-zinc-500 dark:text-zinc-400">{done}/{target} items</span>
  </div>
  <div class="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
    <div
      class="h-full rounded-full transition-[width] duration-300"
      class:bg-primary-600={!reached}
      class:bg-coin-500={reached}
      style={`width:${Math.round(fraction * 100)}%`}
    ></div>
  </div>
  {#if reached}
    <p class="mt-2 text-xs font-medium text-coin-600 dark:text-coin-400">
      Goal reached for today — keep the streak alive! 🔥
    </p>
  {/if}
</div>
```

With:
```svelte
<div class="rounded-md border border-line bg-panel p-4">
  <div class="flex items-center justify-between">
    <span class="flex items-center gap-2 text-sm font-medium text-text-primary">
      <span aria-hidden="true">🎯</span> Daily goal
    </span>
    <span class="font-data text-sm tabular-nums text-text-muted">{done}/{target} items</span>
  </div>
  <div class="mt-3 h-2 overflow-hidden rounded-full bg-line">
    <div
      class="h-full rounded-full transition-[width] duration-300"
      class:bg-active={!reached}
      class:bg-complete={reached}
      style={`width:${Math.round(fraction * 100)}%`}
    ></div>
  </div>
  {#if reached}
    <p class="mt-2 font-data text-xs font-medium text-complete">
      Goal reached for today — keep the streak alive! 🔥
    </p>
  {/if}
</div>
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`

---

### Task 21: Recolor StatsSummary.svelte

**Files:**
- Modify: `src/components/StatsSummary.svelte:38-53`

- [ ] **Step 1: Replace the template**

Replace:
```svelte
<div>
  <div class="h-2.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
    <div
      class="h-full rounded-full bg-primary-600 transition-[width] duration-300"
      style={`width:${pct(overall)}%`}
    ></div>
  </div>
  <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
    {#each metrics as m (m.label)}
      <div class="rounded-xl bg-zinc-100 p-3 dark:bg-zinc-800/60">
        <p class="text-xs text-zinc-500 dark:text-zinc-400">{m.label}</p>
        <p class="text-xl font-semibold tabular-nums">{m.value}</p>
      </div>
    {/each}
  </div>
</div>
```

With:
```svelte
<div>
  <div class="h-2.5 overflow-hidden rounded-full bg-line">
    <div
      class={`h-full rounded-full transition-[width] duration-300 ${pct(overall) >= 100 ? "bg-complete" : "bg-active"}`}
      style={`width:${pct(overall)}%`}
    ></div>
  </div>
  <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
    {#each metrics as m (m.label)}
      <div class="rounded-md border border-line bg-panel p-3">
        <p class="font-data text-xs tracking-wide text-text-muted uppercase">{m.label}</p>
        <p class="font-data text-xl font-semibold tabular-nums text-active">{m.value}</p>
      </div>
    {/each}
  </div>
</div>
```

This is the spec's "telemetry stat block" pattern — mono uppercase label, mono semantic-colored value — applied to the 8-metric stats grid.

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`

---

### Task 22: Recolor BadgeList.svelte

**Files:**
- Modify: `src/components/BadgeList.svelte:10-22`

**Interfaces:**
- Consumes: `BadgeTile.svelte` (Task 23).

- [ ] **Step 1: Replace the template**

Replace:
```svelte
<div>
  <div class="mb-3 flex items-center justify-between">
    <h2 class="text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
      Badges
    </h2>
    <span class="text-sm text-zinc-500 dark:text-zinc-400">{earnedCount}/{BADGES.length}</span>
  </div>
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
    {#each BADGES as badge (badge.id)}
      <BadgeTile {badge} earned={earned.has(badge.id)} />
    {/each}
  </div>
</div>
```

With:
```svelte
<div>
  <div class="mb-3 flex items-center justify-between">
    <h2 class="font-data text-xs font-semibold tracking-widest text-text-muted uppercase">
      Badges
    </h2>
    <span class="font-data text-sm text-text-muted">{earnedCount}/{BADGES.length}</span>
  </div>
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
    {#each BADGES as badge (badge.id)}
      <BadgeTile {badge} earned={earned.has(badge.id)} />
    {/each}
  </div>
</div>
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`

---

### Task 23: Recolor BadgeTile.svelte — patch pattern

**Files:**
- Modify: `src/components/BadgeTile.svelte:7-22`

- [ ] **Step 1: Replace the template**

Replace:
```svelte
<div
  class="flex flex-col items-center gap-1 rounded-xl border p-4 text-center transition
    {earned
    ? 'border-primary-300 bg-primary-50 dark:border-primary-700 dark:bg-primary-950/40'
    : 'border-zinc-200 bg-white opacity-60 grayscale dark:border-zinc-800 dark:bg-zinc-900'}"
  title={badge.description}
>
  <span class="text-3xl" aria-hidden="true">{badge.icon}</span>
  <span class="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{badge.label}</span>
  <span class="text-xs text-zinc-500 dark:text-zinc-400">{badge.description}</span>
  {#if earned}
    <span class="mt-1 rounded-full bg-primary-600 px-2 py-0.5 text-[10px] font-semibold text-white">
      Earned
    </span>
  {/if}
</div>
```

With:
```svelte
<div
  class="flex flex-col items-center gap-1 rounded-md border p-4 text-center transition
    {earned
    ? 'border-active bg-active-soft'
    : 'border-line bg-panel-soft opacity-50 grayscale'}"
  title={badge.description}
>
  <span class="text-3xl" aria-hidden="true">{badge.icon}</span>
  <span class="text-sm font-semibold text-text-primary">{badge.label}</span>
  <span class="text-xs text-text-muted">{badge.description}</span>
  {#if earned}
    <span class="mt-1 rounded-full bg-active px-2 py-0.5 font-data text-[10px] font-semibold text-ink">
      Earned
    </span>
  {/if}
</div>
```

This is the spec's exact STRATA patch pattern: locked = 50% opacity + panel-soft/line, unlocked = full opacity + amber-soft/amber.

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`
Then visit `/stats`: locked badges should be visibly desaturated/dim, unlocked badges amber-bordered.

---

### Task 24: Recolor Toast.svelte

**Files:**
- Modify: `src/components/Toast.svelte:23-37`

- [ ] **Step 1: Replace the template**

Replace:
```svelte
<div class="pointer-events-none fixed inset-x-0 top-20 z-[70] flex flex-col items-center gap-2 px-4">
  {#each items as item (item.id)}
    <div
      class="pointer-events-auto flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
    >
      {#if item.icon}<span class="text-xl">{item.icon}</span>{/if}
      <div>
        <p class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{item.title}</p>
        {#if item.message}
          <p class="text-xs text-zinc-500 dark:text-zinc-400">{item.message}</p>
        {/if}
      </div>
    </div>
  {/each}
</div>
```

With:
```svelte
<div class="pointer-events-none fixed inset-x-0 top-20 z-[70] flex flex-col items-center gap-2 px-4">
  {#each items as item (item.id)}
    <div
      class="pointer-events-auto flex items-center gap-3 rounded-md border border-active bg-panel px-4 py-2.5 shadow-lg"
    >
      {#if item.icon}<span class="text-xl">{item.icon}</span>{/if}
      <div>
        <p class="text-sm font-semibold text-text-primary">{item.title}</p>
        {#if item.message}
          <p class="text-xs text-text-muted">{item.message}</p>
        {/if}
      </div>
    </div>
  {/each}
</div>
```

Toasts always carry an amber border regardless of event type (badge unlock, lesson complete, daily goal) — matching the spec's "recolor only, logic unchanged" rule. A panel-bg card with one consistent accent border keeps it from competing visually with the confetti burst that often fires alongside it.

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`

---

### Task 25: Recolor Confetti.svelte particle palette

**Files:**
- Modify: `src/components/Confetti.svelte:19`

- [ ] **Step 1: Replace the color array**

Replace:
```ts
  const COLORS = ["#059669", "#34d399", "#f59e0b", "#fbbf24", "#10b981"];
```

With:
```ts
  const COLORS = ["#F5A623", "#34D399", "#2DD4BF", "#CFD8E3"];
```

Amber, emerald, teal, and light slate — the four STRATA signal colors plus the primary text tone, instead of the old all-green/amber emerald-heavy mix.

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`
Then complete a lesson in dev server and confirm the confetti burst uses the new palette.

---

## Phase 6 — Reward shop

### Task 26: Recolor RewardRow.svelte

**Files:**
- Modify: `src/components/RewardRow.svelte:18-44`

- [ ] **Step 1: Replace the template**

Replace:
```svelte
<div
  class="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
>
  <span class="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-zinc-100 text-2xl dark:bg-zinc-800" aria-hidden="true">
    {reward.emoji}
  </span>
  <div class="min-w-0 flex-1">
    <p class="truncate font-medium">{reward.name}</p>
    <p class="text-sm text-zinc-500 dark:text-zinc-400">
      <span class="font-semibold text-coin-600 dark:text-coin-400">🪙 {reward.coinCost}</span>
      <span class="mx-1">·</span>
      <span>{rupiah(reward.rupiah)}</span>
    </p>
  </div>
  <button
    type="button"
    onclick={() => onRedeem(reward)}
    disabled={!affordable}
    class="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed
      {affordable
      ? 'bg-primary-600 text-white hover:bg-primary-700'
      : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600'}"
    title={affordable ? "Redeem this reward" : `Need ${reward.coinCost - coins} more coins`}
  >
    {affordable ? "Redeem" : "Locked"}
  </button>
</div>
```

With:
```svelte
<div class="flex items-center gap-3 rounded-md border border-line bg-panel p-3">
  <span class="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-panel-soft text-2xl" aria-hidden="true">
    {reward.emoji}
  </span>
  <div class="min-w-0 flex-1">
    <p class="truncate font-medium text-text-primary">{reward.name}</p>
    <p class="font-data text-sm text-text-muted">
      <span class="font-semibold text-active">🪙 {reward.coinCost}</span>
      <span class="mx-1">·</span>
      <span>{rupiah(reward.rupiah)}</span>
    </p>
  </div>
  <button
    type="button"
    onclick={() => onRedeem(reward)}
    disabled={!affordable}
    class="shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed
      {affordable
      ? 'bg-active text-ink hover:bg-amber-500/90'
      : 'bg-panel-soft text-text-muted'}"
    title={affordable ? "Redeem this reward" : `Need ${reward.coinCost - coins} more coins`}
  >
    {affordable ? "Redeem" : "Locked"}
  </button>
</div>
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`

---

### Task 27: Recolor RedemptionList.svelte

**Files:**
- Modify: `src/components/RedemptionList.svelte:12-30`

- [ ] **Step 1: Replace the template**

Replace:
```svelte
{#if redeemed.length}
  <ul class="space-y-2">
    {#each redeemed as entry, i (i)}
      {@const meta = metaFor(entry.id)}
      <li
        class="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <span class="text-lg" aria-hidden="true">{meta?.emoji ?? "🎁"}</span>
        <span class="flex-1 font-medium">{meta?.name ?? entry.id}</span>
        <span class="text-zinc-500 dark:text-zinc-400">{dateID(entry.date)}</span>
        <span class="tabular-nums text-zinc-500 dark:text-zinc-400">{rupiah(entry.rupiah)}</span>
      </li>
    {/each}
  </ul>
{:else}
  <p class="rounded-lg border border-dashed border-zinc-300 px-4 py-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
    No rewards redeemed yet. Study to earn coins, then treat yourself.
  </p>
{/if}
```

With:
```svelte
{#if redeemed.length}
  <ul class="space-y-2">
    {#each redeemed as entry, i (i)}
      {@const meta = metaFor(entry.id)}
      <li class="flex items-center gap-3 rounded-md border border-line bg-panel px-3 py-2 text-sm">
        <span class="text-lg" aria-hidden="true">{meta?.emoji ?? "🎁"}</span>
        <span class="flex-1 font-medium text-text-primary">{meta?.name ?? entry.id}</span>
        <span class="font-data text-text-muted">{dateID(entry.date)}</span>
        <span class="font-data tabular-nums text-text-muted">{rupiah(entry.rupiah)}</span>
      </li>
    {/each}
  </ul>
{:else}
  <p class="rounded-md border border-dashed border-line px-4 py-6 text-center text-sm text-text-muted">
    No rewards redeemed yet. Study to earn coins, then treat yourself.
  </p>
{/if}
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`

---

### Task 28: Recolor RewardShop.svelte

**Files:**
- Modify: `src/components/RewardShop.svelte:40-77`

**Interfaces:**
- Consumes: `RewardRow.svelte` (Task 26), `RedemptionList.svelte` (Task 27).

- [ ] **Step 1: Replace the template**

Replace:
```svelte
<div class="space-y-6">
  <div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-coin-500/10 px-4 py-3">
    <span class="flex items-center gap-2 text-lg font-semibold text-coin-700 dark:text-coin-400">
      <span aria-hidden="true">🪙</span>
      <span class="tabular-nums">{coins}</span>
      <span class="text-sm font-normal text-zinc-500 dark:text-zinc-400">coins available</span>
    </span>
    <span class="text-sm text-zinc-500 dark:text-zinc-400">
      This week: <span class="font-medium" class:text-red-500={overCap}>{rupiah(spentThisWeek)}</span>
      / {rupiah(WEEKLY_ALLOWANCE_CAP)}
    </span>
  </div>

  {#if overCap}
    <p class="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-700 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
      Heads up — you're over your weekly allowance. Maybe save the next treat for next week.
    </p>
  {/if}

  {#if rewards.length === 0}
    <p class="rounded-lg border border-dashed border-zinc-300 px-4 py-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
      No rewards yet. Add some below, or reset to the defaults.
    </p>
  {:else}
    <div class="grid gap-3 sm:grid-cols-2">
      {#each rewards as reward (reward.id)}
        <RewardRow {reward} {coins} onRedeem={handleRedeem} />
      {/each}
    </div>
  {/if}

  <section>
    <h2 class="mb-3 text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
      Redemption history
    </h2>
    <RedemptionList />
  </section>
</div>
```

With:
```svelte
<div class="space-y-6">
  <div class="flex flex-wrap items-center justify-between gap-3 rounded-md border border-line bg-panel px-4 py-3">
    <span class="flex items-center gap-2 font-data text-lg font-semibold text-active">
      <span aria-hidden="true">🪙</span>
      <span class="tabular-nums">{coins}</span>
      <span class="text-sm font-normal text-text-muted">coins available</span>
    </span>
    <span class="font-data text-sm text-text-muted">
      This week: <span class="font-medium" class:text-urgency={overCap}>{rupiah(spentThisWeek)}</span>
      / {rupiah(WEEKLY_ALLOWANCE_CAP)}
    </span>
  </div>

  {#if overCap}
    <p class="rounded-md border border-urgency bg-panel px-4 py-2 text-sm text-urgency">
      Heads up — you're over your weekly allowance. Maybe save the next treat for next week.
    </p>
  {/if}

  {#if rewards.length === 0}
    <p class="rounded-md border border-dashed border-line px-4 py-6 text-center text-sm text-text-muted">
      No rewards yet. Add some below, or reset to the defaults.
    </p>
  {:else}
    <div class="grid gap-3 sm:grid-cols-2">
      {#each rewards as reward (reward.id)}
        <RewardRow {reward} {coins} onRedeem={handleRedeem} />
      {/each}
    </div>
  {/if}

  <section>
    <h2 class="mb-3 font-data text-xs font-semibold tracking-widest text-text-muted uppercase">
      Redemption history
    </h2>
    <RedemptionList />
  </section>
</div>
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`

---

### Task 29: Recolor RewardEditor.svelte

**Files:**
- Modify: `src/components/RewardEditor.svelte:33-110`

- [ ] **Step 1: Replace the template**

Replace:
```svelte
<section class="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
  <button
    type="button"
    onclick={() => (open = !open)}
    class="flex w-full items-center justify-between text-left"
  >
    <span class="text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
      Manage rewards
    </span>
    <span class="text-zinc-400">{open ? "▲" : "▼"}</span>
  </button>

  {#if open}
    <div class="mt-4 space-y-2">
      {#each rewards as r (r.id)}
        <div class="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-200 p-2 dark:border-zinc-800">
          <input
            value={r.emoji}
            onchange={(e) => commit(r, { emoji: e.currentTarget.value || "🎁" })}
            class="w-12 rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-center dark:border-zinc-700 dark:bg-zinc-950"
            aria-label="Emoji"
          />
          <input
            value={r.name}
            onchange={(e) => commit(r, { name: e.currentTarget.value })}
            class="min-w-32 flex-1 rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950"
            aria-label="Name"
          />
          <label class="flex items-center gap-1 text-xs text-zinc-500">
            🪙
            <input
              type="number" min="1"
              value={r.coinCost}
              onchange={(e) => commit(r, { coinCost: Math.max(1, Math.round(+e.currentTarget.value) || 1) })}
              class="w-20 rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              aria-label="Coin cost"
            />
          </label>
          <label class="flex items-center gap-1 text-xs text-zinc-500">
            Rp
            <input
              type="number" min="0" step="1000"
              value={r.rupiah}
              onchange={(e) => commit(r, { rupiah: Math.max(0, Math.round(+e.currentTarget.value) || 0) })}
              class="w-24 rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950"
              aria-label="Rupiah value"
            />
          </label>
          <button
            type="button"
            onclick={() => deleteReward(r.id)}
            class="rounded-md px-2 py-1 text-xs text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
          >Delete</button>
        </div>
      {/each}

      <div class="flex flex-wrap items-end gap-2 rounded-lg border border-dashed border-zinc-300 p-2 dark:border-zinc-700">
        <input bind:value={draft.emoji} class="w-12 rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-center dark:border-zinc-700 dark:bg-zinc-950" aria-label="New emoji" />
        <input bind:value={draft.name} placeholder="New reward name" class="min-w-32 flex-1 rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950" aria-label="New name" />
        <input type="number" min="1" bind:value={draft.coinCost} class="w-20 rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950" aria-label="New coin cost" />
        <input type="number" min="0" step="1000" bind:value={draft.rupiah} class="w-24 rounded border border-zinc-200 bg-zinc-50 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-950" aria-label="New rupiah" />
        <button
          type="button"
          onclick={addNew}
          class="rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700"
        >Add</button>
      </div>

      <div class="pt-1">
        <button
          type="button"
          onclick={reset}
          class="text-xs font-medium text-zinc-500 underline hover:text-zinc-700 dark:text-zinc-400"
        >Reset to defaults</button>
      </div>
    </div>
  {/if}
</section>
```

With:
```svelte
<section class="rounded-md border border-line bg-panel p-4">
  <button
    type="button"
    onclick={() => (open = !open)}
    class="flex w-full items-center justify-between text-left"
  >
    <span class="font-data text-xs font-semibold tracking-widest text-text-muted uppercase">
      Manage rewards
    </span>
    <span class="text-text-muted">{open ? "▲" : "▼"}</span>
  </button>

  {#if open}
    <div class="mt-4 space-y-2">
      {#each rewards as r (r.id)}
        <div class="flex flex-wrap items-center gap-2 rounded-md border border-line p-2">
          <input
            value={r.emoji}
            onchange={(e) => commit(r, { emoji: e.currentTarget.value || "🎁" })}
            class="w-12 rounded border border-line bg-panel-soft px-2 py-1 text-center text-text-primary focus-visible:border-active"
            aria-label="Emoji"
          />
          <input
            value={r.name}
            onchange={(e) => commit(r, { name: e.currentTarget.value })}
            class="min-w-32 flex-1 rounded border border-line bg-panel-soft px-2 py-1 text-sm text-text-primary focus-visible:border-active"
            aria-label="Name"
          />
          <label class="flex items-center gap-1 text-xs text-text-muted">
            🪙
            <input
              type="number" min="1"
              value={r.coinCost}
              onchange={(e) => commit(r, { coinCost: Math.max(1, Math.round(+e.currentTarget.value) || 1) })}
              class="w-20 rounded border border-line bg-panel-soft px-2 py-1 text-sm text-text-primary focus-visible:border-active"
              aria-label="Coin cost"
            />
          </label>
          <label class="flex items-center gap-1 text-xs text-text-muted">
            Rp
            <input
              type="number" min="0" step="1000"
              value={r.rupiah}
              onchange={(e) => commit(r, { rupiah: Math.max(0, Math.round(+e.currentTarget.value) || 0) })}
              class="w-24 rounded border border-line bg-panel-soft px-2 py-1 text-sm text-text-primary focus-visible:border-active"
              aria-label="Rupiah value"
            />
          </label>
          <button
            type="button"
            onclick={() => deleteReward(r.id)}
            class="rounded-md px-2 py-1 text-xs text-text-muted hover:bg-panel-soft hover:text-urgency"
          >Delete</button>
        </div>
      {/each}

      <div class="flex flex-wrap items-end gap-2 rounded-md border border-dashed border-line p-2">
        <input bind:value={draft.emoji} class="w-12 rounded border border-line bg-panel-soft px-2 py-1 text-center text-text-primary focus-visible:border-active" aria-label="New emoji" />
        <input bind:value={draft.name} placeholder="New reward name" class="min-w-32 flex-1 rounded border border-line bg-panel-soft px-2 py-1 text-sm text-text-primary focus-visible:border-active" aria-label="New name" />
        <input type="number" min="1" bind:value={draft.coinCost} class="w-20 rounded border border-line bg-panel-soft px-2 py-1 text-sm text-text-primary focus-visible:border-active" aria-label="New coin cost" />
        <input type="number" min="0" step="1000" bind:value={draft.rupiah} class="w-24 rounded border border-line bg-panel-soft px-2 py-1 text-sm text-text-primary focus-visible:border-active" aria-label="New rupiah" />
        <button
          type="button"
          onclick={addNew}
          class="rounded-md bg-active px-3 py-1.5 text-sm font-medium text-ink hover:bg-amber-500/90"
        >Add</button>
      </div>

      <div class="pt-1">
        <button
          type="button"
          onclick={reset}
          class="text-xs font-medium text-text-muted underline hover:text-text-primary"
        >Reset to defaults</button>
      </div>
    </div>
  {/if}
</section>
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`

---

## Phase 7 — User content (notes, data menu, upload, search)

### Task 30: Recolor Notes.svelte

**Files:**
- Modify: `src/components/Notes.svelte:24-40`

- [ ] **Step 1: Replace the template**

Replace:
```svelte
<section
  class="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
>
  <div class="mb-2 flex items-center justify-between">
    <h2 class="text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
      My notes
    </h2>
    <span class="text-xs text-zinc-400">{saved ? "Saved" : "Saving…"}</span>
  </div>
  <textarea
    value={value}
    oninput={onInput}
    rows="6"
    placeholder="Jot down your own notes, questions, or links for this lesson…"
    class="w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
  ></textarea>
</section>
```

With:
```svelte
<section class="rounded-md border border-line bg-panel p-4">
  <div class="mb-2 flex items-center justify-between">
    <h2 class="font-data text-xs font-semibold tracking-widest text-text-muted uppercase">
      My notes
    </h2>
    <span class="font-data text-xs text-text-muted">{saved ? "Saved" : "Saving…"}</span>
  </div>
  <textarea
    value={value}
    oninput={onInput}
    rows="6"
    placeholder="Jot down your own notes, questions, or links for this lesson…"
    class="w-full resize-y rounded-md border border-line bg-panel-soft p-3 text-sm text-text-primary outline-none focus:border-active focus:ring-2 focus:ring-active/30"
  ></textarea>
</section>
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`

---

### Task 31: Recolor DataMenu.svelte

**Files:**
- Modify: `src/components/DataMenu.svelte:43-80`

- [ ] **Step 1: Replace the template**

Replace:
```svelte
<div class="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
  <h2 class="text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
    Your data
  </h2>
  <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
    Progress lives in this browser. Export a backup to move it to another device.
  </p>
  <div class="mt-3 flex flex-wrap gap-2">
    <button
      type="button"
      onclick={doExport}
      class="rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700"
    >
      Export backup
    </button>
    <button
      type="button"
      onclick={() => fileInput.click()}
      class="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
    >
      Import backup
    </button>
    <button
      type="button"
      onclick={doReset}
      class="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/40"
    >
      Reset all
    </button>
    <input
      bind:this={fileInput}
      type="file"
      accept="application/json"
      class="hidden"
      onchange={onFile}
    />
  </div>
</div>
```

With:
```svelte
<div class="rounded-md border border-line bg-panel p-4">
  <h2 class="font-data text-xs font-semibold tracking-widest text-text-muted uppercase">
    Your data
  </h2>
  <p class="mt-1 text-sm text-text-muted">
    Progress lives in this browser. Export a backup to move it to another device.
  </p>
  <div class="mt-3 flex flex-wrap gap-2">
    <button
      type="button"
      onclick={doExport}
      class="rounded-md bg-active px-3 py-1.5 text-sm font-medium text-ink hover:bg-amber-500/90"
    >
      Export backup
    </button>
    <button
      type="button"
      onclick={() => fileInput.click()}
      class="rounded-md border border-line px-3 py-1.5 text-sm font-medium text-text-primary hover:bg-panel-soft"
    >
      Import backup
    </button>
    <button
      type="button"
      onclick={doReset}
      class="rounded-md border border-urgency px-3 py-1.5 text-sm font-medium text-urgency hover:bg-panel-soft"
    >
      Reset all
    </button>
    <input
      bind:this={fileInput}
      type="file"
      accept="application/json"
      class="hidden"
      onchange={onFile}
    />
  </div>
</div>
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`

---

### Task 32: Recolor UploadTopicModal.svelte

**Files:**
- Modify: `src/components/UploadTopicModal.svelte:53-141`

- [ ] **Step 1: Replace the template**

Replace:
```svelte
{#if open}
  <div
    class="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8"
    onclick={close}
    role="presentation"
  >
    <div
      class="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label="Add a topic"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">Add a topic</h2>
        <button
          type="button"
          onclick={close}
          class="grid h-8 w-8 place-items-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Close"
        >✕</button>
      </div>
      <p class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Upload or paste a topic markdown file. Need the format?
        <a href="/templates/topic-template.md" download class="text-primary-600 hover:underline dark:text-primary-400">Download the template</a>.
      </p>

      <div class="mt-4">
        <input
          type="file"
          accept=".md,text/markdown,text/plain"
          onchange={onFile}
          class="block w-full text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-600 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-primary-700 dark:text-zinc-300"
        />
      </div>

      <textarea
        bind:value={text}
        oninput={parse}
        rows="8"
        placeholder="…or paste your topic markdown here"
        class="mt-3 w-full resize-y rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs text-zinc-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-500/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
      ></textarea>

      {#if result}
        {#if result.errors.length > 0}
          <div class="mt-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
            <p class="font-medium">Can't add this topic:</p>
            <ul class="mt-1 list-disc pl-5">
              {#each result.errors as err}<li>{err}</li>{/each}
            </ul>
          </div>
        {:else if result.topic}
          <div class="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3 dark:border-zinc-700 dark:bg-zinc-950/40">
            <p class="font-medium">
              {#if result.topic.icon}<span>{result.topic.icon}</span>{/if}
              {result.topic.title}
              <span class="text-sm font-normal text-zinc-500">· {result.topic.lessons.length} subtopic{result.topic.lessons.length === 1 ? "" : "s"}</span>
            </p>
            <ul class="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              {#each result.topic.lessons as l}
                <li class="flex justify-between"><span>{l.title}</span><span class="text-zinc-400">{l.checklist.length} items</span></li>
              {/each}
            </ul>
            {#if result.warnings.length > 0}
              <ul class="mt-2 list-disc pl-5 text-xs text-amber-600 dark:text-amber-400">
                {#each result.warnings as w}<li>{w}</li>{/each}
              </ul>
            {/if}
          </div>
        {/if}
      {/if}

      <div class="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onclick={close}
          class="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >Cancel</button>
        <button
          type="button"
          onclick={add}
          disabled={!result?.topic}
          class="rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >Add to my topics</button>
      </div>
    </div>
  </div>
{/if}
```

With:
```svelte
{#if open}
  <div
    class="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-ink/60 p-4 sm:p-8"
    onclick={close}
    role="presentation"
  >
    <div
      class="w-full max-w-2xl rounded-md border border-line bg-panel p-5 shadow-xl"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label="Add a topic"
    >
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-text-primary">Add a topic</h2>
        <button
          type="button"
          onclick={close}
          class="row-hover grid h-8 w-8 place-items-center rounded-md text-text-muted transition hover:bg-panel-soft"
          aria-label="Close"
        >✕</button>
      </div>
      <p class="mt-1 text-sm text-text-muted">
        Upload or paste a topic markdown file. Need the format?
        <a href="/templates/topic-template.md" download class="text-active hover:underline">Download the template</a>.
      </p>

      <div class="mt-4">
        <input
          type="file"
          accept=".md,text/markdown,text/plain"
          onchange={onFile}
          class="block w-full text-sm text-text-muted file:mr-3 file:rounded-md file:border-0 file:bg-active file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink hover:file:bg-amber-500/90"
        />
      </div>

      <textarea
        bind:value={text}
        oninput={parse}
        rows="8"
        placeholder="…or paste your topic markdown here"
        class="mt-3 w-full resize-y rounded-md border border-line bg-panel-soft p-3 font-data text-xs text-text-primary outline-none focus:border-active focus:ring-2 focus:ring-active/30"
      ></textarea>

      {#if result}
        {#if result.errors.length > 0}
          <div class="mt-3 rounded-md border border-urgency bg-panel px-3 py-2 text-sm text-urgency">
            <p class="font-medium">Can't add this topic:</p>
            <ul class="mt-1 list-disc pl-5">
              {#each result.errors as err}<li>{err}</li>{/each}
            </ul>
          </div>
        {:else if result.topic}
          <div class="mt-3 rounded-md border border-line bg-panel-soft px-3 py-3">
            <p class="font-medium text-text-primary">
              {#if result.topic.icon}<span>{result.topic.icon}</span>{/if}
              {result.topic.title}
              <span class="text-sm font-normal text-text-muted">· {result.topic.lessons.length} subtopic{result.topic.lessons.length === 1 ? "" : "s"}</span>
            </p>
            <ul class="mt-2 space-y-1 text-sm text-text-muted">
              {#each result.topic.lessons as l}
                <li class="flex justify-between"><span>{l.title}</span><span class="font-data text-text-muted">{l.checklist.length} items</span></li>
              {/each}
            </ul>
            {#if result.warnings.length > 0}
              <ul class="mt-2 list-disc pl-5 text-xs text-active">
                {#each result.warnings as w}<li>{w}</li>{/each}
              </ul>
            {/if}
          </div>
        {/if}
      {/if}

      <div class="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onclick={close}
          class="rounded-md border border-line px-3 py-1.5 text-sm font-medium text-text-primary hover:bg-panel-soft"
        >Cancel</button>
        <button
          type="button"
          onclick={add}
          disabled={!result?.topic}
          class="rounded-md bg-active px-3 py-1.5 text-sm font-medium text-ink hover:bg-amber-500/90 disabled:cursor-not-allowed disabled:opacity-50"
        >Add to my topics</button>
      </div>
    </div>
  </div>
{/if}
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`

---

### Task 33: Recolor UserTopics.svelte

**Files:**
- Modify: `src/components/UserTopics.svelte:27-84`

**Interfaces:**
- Consumes: `UploadTopicModal.svelte` (Task 32).

- [ ] **Step 1: Replace the template**

Replace:
```svelte
<section class="mt-8">
  <div class="mb-3 flex items-center justify-between">
    <h2 class="text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
      My uploaded topics
    </h2>
    <button
      type="button"
      onclick={() => (showUpload = true)}
      class="rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700"
    >
      + Add topic
    </button>
  </div>

  {#if topics.length === 0}
    <button
      type="button"
      onclick={() => (showUpload = true)}
      class="w-full rounded-2xl border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500 hover:border-primary-400 hover:text-primary-600 dark:border-zinc-700 dark:text-zinc-400"
    >
      Upload a topic as a markdown file to start your own study set.
    </button>
  {:else}
    <div class="grid gap-4 sm:grid-cols-2">
      {#each topics as topic (topic.id)}
        {@const p = progressOf(topic)}
        <div class="relative rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-primary-400 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-primary-500">
          <!-- full-card link overlay -->
          <a href={`/u?t=${topic.id}`} class="absolute inset-0 rounded-2xl" aria-label={`Open ${topic.title}`}></a>
          <div class="relative flex items-start justify-between gap-2">
            <div class="flex items-center gap-2">
              {#if topic.icon}<span class="text-xl">{topic.icon}</span>{/if}
              <h3 class="text-lg font-semibold">{topic.title}</h3>
            </div>
            <button
              type="button"
              onclick={() => remove(topic.id, topic.title)}
              class="relative shrink-0 rounded-md px-2 py-1 text-xs text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
              aria-label={`Delete ${topic.title}`}
            >Delete</button>
          </div>
          {#if topic.description}
            <p class="relative mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{topic.description}</p>
          {/if}
          <div class="relative mt-4">
            <div class="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div class="h-full rounded-full bg-primary-600 transition-[width]" style={`width:${pct(p.frac)}%`}></div>
            </div>
            <p class="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">{pct(p.frac)}% · {p.done}/{p.total} done</p>
          </div>
          <p class="relative mt-2 text-xs text-zinc-400">{topic.lessons.length} subtopic{topic.lessons.length === 1 ? "" : "s"}</p>
        </div>
      {/each}
    </div>
  {/if}
</section>

<UploadTopicModal open={showUpload} onClose={() => (showUpload = false)} />
```

With:
```svelte
<section class="mt-8">
  <div class="mb-3 flex items-center justify-between">
    <h2 class="font-data text-xs font-semibold tracking-widest text-text-muted uppercase">
      My uploaded topics
    </h2>
    <button
      type="button"
      onclick={() => (showUpload = true)}
      class="rounded-md bg-active px-3 py-1.5 text-sm font-medium text-ink hover:bg-amber-500/90"
    >
      + Add topic
    </button>
  </div>

  {#if topics.length === 0}
    <button
      type="button"
      onclick={() => (showUpload = true)}
      class="w-full rounded-md border border-dashed border-line px-4 py-8 text-center text-sm text-text-muted hover:border-active hover:text-active"
    >
      Upload a topic as a markdown file to start your own study set.
    </button>
  {:else}
    <div class="grid gap-4 sm:grid-cols-2">
      {#each topics as topic (topic.id)}
        {@const p = progressOf(topic)}
        <div class="row-hover relative rounded-md border border-line bg-panel p-5 transition hover:bg-panel-soft">
          <!-- full-card link overlay -->
          <a href={`/u?t=${topic.id}`} class="absolute inset-0 rounded-md" aria-label={`Open ${topic.title}`}></a>
          <div class="relative flex items-start justify-between gap-2">
            <div class="flex items-center gap-2">
              {#if topic.icon}<span class="text-xl">{topic.icon}</span>{/if}
              <h3 class="text-lg font-semibold text-text-primary">{topic.title}</h3>
            </div>
            <button
              type="button"
              onclick={() => remove(topic.id, topic.title)}
              class="relative shrink-0 rounded-md px-2 py-1 text-xs text-text-muted hover:bg-panel-soft hover:text-urgency"
              aria-label={`Delete ${topic.title}`}
            >Delete</button>
          </div>
          {#if topic.description}
            <p class="relative mt-1 line-clamp-2 text-sm text-text-muted">{topic.description}</p>
          {/if}
          <div class="relative mt-4">
            <div class="h-2 overflow-hidden rounded-full bg-line">
              <div class={`h-full rounded-full transition-[width] ${pct(p.frac) >= 100 ? "bg-complete" : "bg-active"}`} style={`width:${pct(p.frac)}%`}></div>
            </div>
            <p class="mt-1.5 font-data text-sm text-text-muted">{pct(p.frac)}% · {p.done}/{p.total} done</p>
          </div>
          <p class="relative mt-2 font-data text-xs text-text-muted">{topic.lessons.length} subtopic{topic.lessons.length === 1 ? "" : "s"}</p>
        </div>
      {/each}
    </div>
  {/if}
</section>

<UploadTopicModal open={showUpload} onClose={() => (showUpload = false)} />
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`

---

### Task 34: Recolor UserTopicView.svelte + remove dead theme-change mermaid effect

**Files:**
- Modify: `src/components/UserTopicView.svelte:50-114`

- [ ] **Step 1: Remove the theme-change mermaid re-render effect**

Replace:
```ts
  // Re-render diagrams when the theme flips.
  $effect(() => {
    void $appData.theme;
    renderMermaidDiagrams();
  });
```

With: *(nothing — delete the block; this effect existed only to handle light/dark mermaid recoloring, which no longer applies per Task 5's fixed mermaid theme)*

- [ ] **Step 2: Replace the template**

Replace:
```svelte
{#if !topic}
  <div class="py-16 text-center">
    <p class="text-lg font-medium">Topic not found</p>
    <p class="mt-1 text-sm text-zinc-500">It may have been deleted from this browser.</p>
    <a href="/" class="mt-4 inline-block text-sm font-medium text-primary-600 dark:text-primary-400">
      ← Back to topics
    </a>
  </div>
{:else if lesson}
  <a
    href={`/u?t=${topic.id}`}
    class="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
  >
    ← Back to topic
  </a>
  <div class="mt-4 grid gap-8 lg:grid-cols-[1fr_20rem]">
    <article class="prose prose-zinc max-w-none dark:prose-invert">
      <h1 class="mb-2">{lesson.title}</h1>
      {@html html}
    </article>
    <aside class="space-y-4 lg:sticky lg:top-24 lg:self-start">
      {#if lesson.checklist.length > 0}
        <Checklist topic={topic.id} lesson={lesson.slug} items={lesson.checklist} />
      {/if}
      <Notes topic={topic.id} lesson={lesson.slug} />
    </aside>
  </div>
{:else}
  <a href="/" class="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
    ← All topics
  </a>
  <h1 class="mt-3 flex items-center gap-2 text-2xl font-semibold">
    {#if topic.icon}<span>{topic.icon}</span>{/if}
    {topic.title}
  </h1>
  {#if topic.description}
    <p class="mt-1 text-zinc-600 dark:text-zinc-400">{topic.description}</p>
  {/if}
  <ul class="mt-6 space-y-2">
    {#each topic.lessons as l (l.slug)}
      {@const frac = lessonFraction($appData.progress[lessonKey(topic.id, l.slug)], l.checklist.length)}
      <li>
        <a
          href={`/u?t=${topic.id}&l=${l.slug}`}
          class="block rounded-xl border border-zinc-200 bg-white px-4 py-3 transition hover:border-primary-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-primary-500"
        >
          <div class="flex items-center justify-between gap-3">
            <span class="font-medium">{l.title}</span>
            <span class="text-xs text-zinc-400">{pct(frac)}% · {l.checklist.length} items</span>
          </div>
          <div class="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div class="h-full rounded-full bg-primary-600" style={`width:${pct(frac)}%`}></div>
          </div>
        </a>
      </li>
    {/each}
  </ul>
{/if}
```

With:
```svelte
{#if !topic}
  <div class="py-16 text-center">
    <p class="text-lg font-medium text-text-primary">Topic not found</p>
    <p class="mt-1 text-sm text-text-muted">It may have been deleted from this browser.</p>
    <a href="/" class="mt-4 inline-block text-sm font-medium text-active">
      ← Back to topics
    </a>
  </div>
{:else if lesson}
  <a href={`/u?t=${topic.id}`} class="text-sm font-medium text-active hover:underline">
    ← Back to topic
  </a>
  <div class="mt-4 grid gap-8 lg:grid-cols-[1fr_20rem]">
    <article class="prose prose-invert max-w-none">
      <h1 class="mb-2">{lesson.title}</h1>
      {@html html}
    </article>
    <aside class="space-y-4 lg:sticky lg:top-24 lg:self-start">
      {#if lesson.checklist.length > 0}
        <Checklist topic={topic.id} lesson={lesson.slug} items={lesson.checklist} />
      {/if}
      <Notes topic={topic.id} lesson={lesson.slug} />
    </aside>
  </div>
{:else}
  <a href="/" class="text-sm font-medium text-active hover:underline">
    ← All topics
  </a>
  <h1 class="mt-3 flex items-center gap-2 text-2xl font-semibold text-text-primary">
    {#if topic.icon}<span>{topic.icon}</span>{/if}
    {topic.title}
  </h1>
  {#if topic.description}
    <p class="mt-1 text-text-muted">{topic.description}</p>
  {/if}
  <ul class="mt-6 space-y-2">
    {#each topic.lessons as l (l.slug)}
      {@const frac = lessonFraction($appData.progress[lessonKey(topic.id, l.slug)], l.checklist.length)}
      <li>
        <a
          href={`/u?t=${topic.id}&l=${l.slug}`}
          class="row-hover block rounded-md border border-line bg-panel px-4 py-3 transition hover:bg-panel-soft"
        >
          <div class="flex items-center justify-between gap-3">
            <span class="font-medium text-text-primary">{l.title}</span>
            <span class="font-data text-xs text-text-muted">{pct(frac)}% · {l.checklist.length} items</span>
          </div>
          <div class="mt-2 h-2 overflow-hidden rounded-full bg-line">
            <div class={`h-full rounded-full ${pct(frac) >= 100 ? "bg-complete" : "bg-active"}`} style={`width:${pct(frac)}%`}></div>
          </div>
        </a>
      </li>
    {/each}
  </ul>
{/if}
```

Note: `prose prose-zinc dark:prose-invert` becomes `prose prose-invert` — since the page is always dark, `prose-invert` (Tailwind Typography's dark variant) is applied unconditionally instead of behind a `dark:` class.

- [ ] **Step 3: Verify**

Run: `pnpm build 2>&1 | rtk summary`
Then visit `/u` with an uploaded topic in `localStorage` (or upload one via the modal) and confirm lesson body renders with correct prose coloring.

---

### Task 35: Recolor SearchModal.svelte

**Files:**
- Modify: `src/components/SearchModal.svelte:115-169`

- [ ] **Step 1: Replace the template**

Replace:
```svelte
{#if open}
  <div
    class="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-[10vh]"
    onclick={closeModal}
    role="presentation"
  >
    <div
      class="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div class="flex items-center gap-2 border-b border-zinc-200 px-4 dark:border-zinc-800">
        <span class="text-zinc-400" aria-hidden="true">🔍</span>
        <input
          id="search-input"
          bind:value={query}
          placeholder="Search lessons…"
          class="w-full bg-transparent py-3 text-sm outline-none"
          autocomplete="off"
        />
        <kbd class="rounded border border-zinc-200 px-1.5 text-xs text-zinc-400 dark:border-zinc-700">Esc</kbd>
      </div>

      <div class="max-h-[60vh] overflow-y-auto p-2">
        {#if !query.trim()}
          <p class="px-3 py-6 text-center text-sm text-zinc-400">Type to search your lessons.</p>
        {:else if !hasResults && !loading}
          <p class="px-3 py-6 text-center text-sm text-zinc-400">No results for "{query}".</p>
        {:else}
          {#if userResults.length > 0}
            <p class="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-zinc-400 uppercase">My topics</p>
            {#each userResults as r (r.url)}
              <a href={r.url} class="block rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
                {r.title}
              </a>
            {/each}
          {/if}
          {#if builtinResults.length > 0}
            <p class="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-zinc-400 uppercase">Built-in topics</p>
            {#each builtinResults as r (r.url)}
              <a href={r.url} class="block rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <span class="text-sm font-medium">{r.title}</span>
                {#if r.excerpt}<span class="mt-0.5 line-clamp-1 text-xs text-zinc-500">{@html r.excerpt}</span>{/if}
              </a>
            {/each}
          {:else if loading}
            <p class="px-3 py-3 text-center text-xs text-zinc-400">Searching…</p>
          {/if}
        {/if}
      </div>
    </div>
  </div>
{/if}
```

With:
```svelte
{#if open}
  <div
    class="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-ink/60 p-4 pt-[10vh]"
    onclick={closeModal}
    role="presentation"
  >
    <div
      class="w-full max-w-xl rounded-md border border-line bg-panel shadow-xl"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div class="flex items-center gap-2 border-b border-line px-4">
        <span class="text-text-muted" aria-hidden="true">🔍</span>
        <input
          id="search-input"
          bind:value={query}
          placeholder="Search lessons…"
          class="w-full bg-transparent py-3 text-sm text-text-primary outline-none"
          autocomplete="off"
        />
        <kbd class="rounded border border-line px-1.5 font-data text-xs text-text-muted">Esc</kbd>
      </div>

      <div class="max-h-[60vh] overflow-y-auto p-2">
        {#if !query.trim()}
          <p class="px-3 py-6 text-center text-sm text-text-muted">Type to search your lessons.</p>
        {:else if !hasResults && !loading}
          <p class="px-3 py-6 text-center text-sm text-text-muted">No results for "{query}".</p>
        {:else}
          {#if userResults.length > 0}
            <p class="px-3 pt-2 pb-1 font-data text-xs font-semibold tracking-widest text-text-muted uppercase">My topics</p>
            {#each userResults as r (r.url)}
              <a href={r.url} class="row-hover block rounded-md px-3 py-2 text-sm text-text-primary transition hover:bg-panel-soft">
                {r.title}
              </a>
            {/each}
          {/if}
          {#if builtinResults.length > 0}
            <p class="px-3 pt-2 pb-1 font-data text-xs font-semibold tracking-widest text-text-muted uppercase">Built-in topics</p>
            {#each builtinResults as r (r.url)}
              <a href={r.url} class="row-hover block rounded-md px-3 py-2 transition hover:bg-panel-soft">
                <span class="text-sm font-medium text-text-primary">{r.title}</span>
                {#if r.excerpt}<span class="mt-0.5 line-clamp-1 text-xs text-text-muted">{@html r.excerpt}</span>{/if}
              </a>
            {/each}
          {:else if loading}
            <p class="px-3 py-3 text-center text-xs text-text-muted">Searching…</p>
          {/if}
        {/if}
      </div>
    </div>
  </div>
{/if}
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`
Then press Cmd/Ctrl+K in dev server and confirm the search modal renders panel/line/amber correctly.

---

## Phase 8 — Pages

### Task 36: Recolor src/pages/index.astro

**Files:**
- Modify: `src/pages/index.astro:10-28`

- [ ] **Step 1: Replace the template**

Replace:
```astro
<Base>
  <h1 class="text-2xl font-semibold">Topics</h1>
  <p class="mt-1 text-zinc-600 dark:text-zinc-400">
    Pick a topic to study. Your progress is tracked automatically.
  </p>

  <div class="mt-5">
    <DailyGoal client:load />
  </div>

  <h2 class="mt-8 mb-3 text-sm font-semibold tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
    Built-in topics
  </h2>
  <div class="grid gap-4 sm:grid-cols-2">
    {topics.map((topic) => <TopicCard topic={topic} />)}
  </div>

  <UserTopics client:load />
</Base>
```

With:
```astro
<Base>
  <h1 class="text-2xl font-semibold text-text-primary">Topics</h1>
  <p class="mt-1 text-text-muted">
    Pick a topic to study. Your progress is tracked automatically.
  </p>

  <div class="mt-5">
    <DailyGoal client:load />
  </div>

  <h2 class="mt-8 mb-3 font-data text-xs font-semibold tracking-widest text-text-muted uppercase">
    Built-in topics
  </h2>
  <div class="grid gap-4 sm:grid-cols-2">
    {topics.map((topic) => <TopicCard topic={topic} />)}
  </div>

  <UserTopics client:load />
</Base>
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`

---

### Task 37: Recolor src/pages/topics/[topic]/index.astro

**Files:**
- Modify: `src/pages/topics/[topic]/index.astro:16-36`

- [ ] **Step 1: Replace the template**

Replace:
```astro
<Base title={topic.title} description={topic.description}>
  <a
    href="/"
    class="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
  >
    ← All topics
  </a>
  <h1 class="mt-3 flex items-center gap-2 text-2xl font-semibold">
    {topic.icon && <span>{topic.icon}</span>}
    {topic.title}
  </h1>
  <p class="mt-1 text-zinc-600 dark:text-zinc-400">{topic.description}</p>

  <ul class="mt-6 space-y-2">
    {topic.lessons.map((lesson) => (
      <li>
        <LessonRow topicSlug={topic.slug} lesson={lesson} />
      </li>
    ))}
  </ul>
</Base>
```

With:
```astro
<Base title={topic.title} description={topic.description}>
  <a href="/" class="text-sm font-medium text-active hover:underline">
    ← All topics
  </a>
  <h1 class="mt-3 flex items-center gap-2 text-2xl font-semibold text-text-primary">
    {topic.icon && <span>{topic.icon}</span>}
    {topic.title}
  </h1>
  <p class="mt-1 text-text-muted">{topic.description}</p>

  <ul class="mt-6 space-y-2">
    {topic.lessons.map((lesson) => (
      <li>
        <LessonRow topicSlug={topic.slug} lesson={lesson} />
      </li>
    ))}
  </ul>
</Base>
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`

---

### Task 38: Recolor src/pages/topics/[topic]/[lesson].astro

**Files:**
- Modify: `src/pages/topics/[topic]/[lesson].astro` (the rendered template, current lines ~21-50)

**Interfaces:**
- Consumes: `Checklist.svelte` (Task 13), `RoadmapLinks.svelte` (Task 19) — already wired from the earlier drawer feature work, no prop changes here.

- [ ] **Step 1: Replace the template**

Replace:
```astro
<Base title={entry.data.title}>
  <a
    href={`/topics/${topicSlug}`}
    class="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
  >
    ← Back to topic
  </a>
  <div class="mt-4 grid gap-8 lg:grid-cols-[1fr_20rem]">
    <article
      class="prose prose-zinc max-w-none dark:prose-invert"
      data-pagefind-body
      data-pagefind-meta={`topic:${topicSlug}`}
    >
      <h1 class="mb-2">{entry.data.title}</h1>
      <Content />
    </article>
    <aside class="space-y-4 lg:sticky lg:top-24 lg:self-start">
      {checklist.length > 0 && (
        <Checklist
          topic={topicSlug}
          lesson={lessonSlug}
          items={checklist}
          client:load
        />
      )}
      <Notes topic={topicSlug} lesson={lessonSlug} client:load />
    </aside>
  </div>
  <Mermaid client:idle />
  {topicSlug === "frontend-path" && <RoadmapLinks client:load />}
</Base>
```

With:
```astro
<Base title={entry.data.title}>
  <a href={`/topics/${topicSlug}`} class="text-sm font-medium text-active hover:underline">
    ← Back to topic
  </a>
  <div class="mt-4 grid gap-8 lg:grid-cols-[1fr_20rem]">
    <article
      class="prose prose-invert max-w-none"
      data-pagefind-body
      data-pagefind-meta={`topic:${topicSlug}`}
    >
      <h1 class="mb-2">{entry.data.title}</h1>
      <Content />
    </article>
    <aside class="space-y-4 lg:sticky lg:top-24 lg:self-start">
      {checklist.length > 0 && (
        <Checklist
          topic={topicSlug}
          lesson={lessonSlug}
          items={checklist}
          client:load
        />
      )}
      <Notes topic={topicSlug} lesson={lessonSlug} client:load />
    </aside>
  </div>
  <Mermaid client:idle />
  {topicSlug === "frontend-path" && <RoadmapLinks client:load />}
</Base>
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`
Then visit any lesson page and confirm the back link, prose body, and asides all read panel/ink/amber correctly.

---

### Task 39: Recolor src/pages/rewards.astro

**Files:**
- Modify: `src/pages/rewards.astro:6-16`

- [ ] **Step 1: Replace the template**

Replace:
```astro
<Base title="Rewards" description="Spend the coins you earned studying.">
  <h1 class="text-2xl font-semibold">Reward shop</h1>
  <p class="mt-1 text-zinc-600 dark:text-zinc-400">
    Turn study coins into real treats. Each reward shows its rupiah value so you
    can spend with intention.
  </p>
  <div class="mt-6 space-y-6">
    <RewardShop client:load />
    <RewardEditor client:load />
  </div>
</Base>
```

With:
```astro
<Base title="Rewards" description="Spend the coins you earned studying.">
  <h1 class="text-2xl font-semibold text-text-primary">Reward shop</h1>
  <p class="mt-1 text-text-muted">
    Turn study coins into real treats. Each reward shows its rupiah value so you
    can spend with intention.
  </p>
  <div class="mt-6 space-y-6">
    <RewardShop client:load />
    <RewardEditor client:load />
  </div>
</Base>
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`

---

### Task 40: Recolor src/pages/stats.astro

**Files:**
- Modify: `src/pages/stats.astro:14-26`

- [ ] **Step 1: Replace the template**

Replace:
```astro
<Base title="Stats" description="Your learning progress at a glance.">
  <h1 class="text-2xl font-semibold">Your stats</h1>
  <p class="mt-1 text-zinc-600 dark:text-zinc-400">
    Everything you've earned so far.
  </p>

  <div class="mt-6 space-y-6">
    <StatsSummary topics={topics} client:load />
    <DailyGoal client:load />
    <BadgeList client:load />
    <DataMenu client:load />
  </div>
</Base>
```

With:
```astro
<Base title="Stats" description="Your learning progress at a glance.">
  <h1 class="text-2xl font-semibold text-text-primary">Your stats</h1>
  <p class="mt-1 text-text-muted">
    Everything you've earned so far.
  </p>

  <div class="mt-6 space-y-6">
    <StatsSummary topics={topics} client:load />
    <DailyGoal client:load />
    <BadgeList client:load />
    <DataMenu client:load />
  </div>
</Base>
```

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`

---

### Task 41: Confirm src/pages/u.astro and src/pages/404.astro need no changes

**Files:**
- Read-only check: `src/pages/u.astro`, `src/pages/404.astro`

**Interfaces:**
- Consumes: `UserTopicView.svelte` (Task 34) — all visual content for `/u` lives in that component, `u.astro` itself only composes `<Base>` + the island with no styled markup of its own.

- [ ] **Step 1: Verify no dark: classes remain in either page**

Run: `rtk grep "dark:" src/pages/u.astro src/pages/404.astro`
Expected: no matches in `u.astro`. If `404.astro` has any `dark:`/`zinc`/`primary` classes, apply the same token substitutions used throughout this plan (`zinc-X` family → `text-text-primary`/`text-text-muted`/`bg-panel`/`border-line` as appropriate, `primary-*` → `active`) before proceeding — read the file first since its exact content wasn't captured during plan authoring.

- [ ] **Step 2: Verify**

Run: `pnpm build 2>&1 | rtk summary`

---

## Phase 9 — Icons and final verification

### Task 42: Recolor favicon.svg and gen-icons.mjs, regenerate icon assets

**Files:**
- Modify: `public/favicon.svg`
- Modify: `scripts/gen-icons.mjs:6-9`

**Interfaces:**
- Produces: `public/icons/icon-192.png`, `public/icons/icon-512.png`, `public/icons/icon-512-maskable.png`, `public/icons/apple-touch-icon.png` regenerated with the new palette.

- [ ] **Step 1: Recolor favicon.svg**

Replace:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="28" fill="#059669" />
  <path d="M44 32h14v50h30v14H44z" fill="#fff" />
</svg>
```

With:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="28" fill="#0B0F14" />
  <path d="M44 32h14v50h30v14H44z" fill="#F5A623" />
</svg>
```

- [ ] **Step 2: Recolor scripts/gen-icons.mjs**

Replace:
```js
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#059669"/>
  <path d="M176 128h56v200h120v56H176z" fill="#ffffff"/>
</svg>`;
```

With:
```js
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#0B0F14"/>
  <path d="M176 128h56v200h120v56H176z" fill="#F5A623"/>
</svg>`;
```

- [ ] **Step 3: Regenerate the PNG icon set**

Run: `node scripts/gen-icons.mjs`
Expected output:
```
wrote public/icons/icon-192.png
wrote public/icons/icon-512.png
wrote public/icons/icon-512-maskable.png
wrote public/icons/apple-touch-icon.png
```

- [ ] **Step 4: Verify**

Run: `pnpm build 2>&1 | rtk summary`
Then open one regenerated PNG (e.g. `public/icons/icon-512.png`) to visually confirm ink background + amber glyph.

---

### Task 43: Sweep for any remaining `dark:` classes or old tokens across the codebase

**Files:**
- Read-only check across `src/`

**Interfaces:**
- Consumes: completion of Tasks 1–42.

- [ ] **Step 1: Grep for leftover dark: variants**

Run: `rtk grep "dark:" src`
Expected: no matches. If any remain, they're in a file not covered by Tasks 1–41 (verify against the file list in this plan's "File Structure" section) — apply the same token substitution pattern used in the matching task above (`zinc-200/300` borders → `border-line`, `zinc-500/400` text → `text-text-muted`, `zinc-50/white` backgrounds → `bg-panel`, `zinc-900/800` text → `text-text-primary`, `primary-*` → `active`/`complete` per the spec's semantic split, `coin-*` → `active`).

- [ ] **Step 2: Grep for old token names**

Run: `rtk grep "primary-[0-9]\|coin-[0-9]" src`
Expected: no matches (old Tailwind color-scale tokens fully replaced by Task 1's `@theme` block).

- [ ] **Step 3: Grep for the deleted ThemeToggle/ThemeScript**

Run: `rtk grep "ThemeToggle\|ThemeScript" src`
Expected: no matches.

---

### Task 44: Full build and end-to-end verification

**Files:**
- None modified — verification only.

- [ ] **Step 1: Clean build**

Run: `pnpm build 2>&1 | rtk summary`
Expected: build completes with zero errors, all routes generated.

- [ ] **Step 2: Visual pass on every route**

Start dev server (`pnpm dev` or the project's `astro dev --background` convention per `AGENTS.md`/`CLAUDE.md`) and check each of:
- `/` — topic cards, status dots, daily goal, uploaded-topics section
- `/topics/[topic]` — lesson rows with status dots
- `/topics/[topic]/[lesson]` — prose body, checklist, notes, mermaid diagram if present
- `/topics/frontend-path/[phase-lesson]` — click a roadmap cross-reference link, confirm `LessonDrawer` opens correctly styled
- `/rewards` — reward shop, reward editor, redemption history
- `/stats` — stats summary grid, daily goal, badges, data menu
- `/u` — empty state, an uploaded topic's lesson list, and a lesson body
- Search modal (Cmd/Ctrl+K) and the Upload Topic modal

Confirm in each: ink/panel/panel-soft background hierarchy, amber active states, emerald complete-only states, mono fonts on all numeric/status content, no leftover light-mode-looking surfaces.

- [ ] **Step 3: Stamp-in motion check**

On any lesson with a checklist, check an item and confirm the label scales in with the stamp-in animation (slight overshoot, ~260ms).

- [ ] **Step 4: Reduced-motion check**

In browser devtools, enable "prefers-reduced-motion: reduce" (Chrome DevTools → Rendering tab → Emulate CSS media feature). Re-check a checklist item: the stamp-in animation should not play (instant state change), and row hover backgrounds should not transition (Task 3's `.row-hover` + media query).

- [ ] **Step 5: Contrast check**

Using browser devtools' contrast checker (or a manual check against the swatch values), confirm:
- `text-text-muted` (#76869C) against `bg-panel` (#121822) and `bg-ink` (#0B0F14) clears WCAG AA for normal text (4.5:1) — if it falls short on `ink`, this is a known risk flagged in the spec; report it rather than silently adjusting the token, since the value is locked from brainstorming.
- `text-text-primary` (#CFD8E3) against both backgrounds — expected to clear comfortably given the high luminance gap.

- [ ] **Step 6: PWA icon check**

Run: `pnpm build 2>&1 | rtk summary` (if not already run in this session), then check `dist/manifest.webmanifest` references the regenerated icons and `dist/icons/*.png` show the new ink/amber palette.

- [ ] **Step 7: Pagefind, Mermaid, Shiki check**

After `pnpm build`, confirm:
- `dist/pagefind/` exists and a search in the `/` search modal (after `pnpm preview` or serving `dist/`) returns results.
- A lesson with a mermaid diagram renders dark-themed (no light flash, no default-theme colors).
- A lesson with a fenced code block renders with `github-dark-default` Shiki colors.

---

## Self-Review Notes

(Completed during plan authoring — recorded here per the writing-plans skill's self-review step.)

- **Spec coverage:** All 7 spec sections have corresponding tasks — tokens (Task 1), typography/global CSS (Tasks 2–3), Shiki/Mermaid (Tasks 4–5), component mapping (Tasks 9–35 cover every component listed in spec section 4 plus `Toast.svelte`/`Confetti.svelte`/`SearchModal.svelte`/`UploadTopicModal.svelte` which the spec's table only summarized as a group), icons (Task 42), cleanup (Tasks 6, 8, 43), verification (Task 44).
- **Placeholder scan:** No "TBD"/"similar to Task N" placeholders — every task shows the literal before/after code. The one exception is Task 41 (`404.astro`), which is explicitly flagged as unread during plan authoring with instructions for how to handle it rather than asserting fake content.
- **Type/signature consistency:** No component's public prop signature changes anywhere in this plan — every task is a template/class-string edit only. `ChecklistItem.svelte`'s `onToggle` callback signature is unchanged; only an internal `justChecked` state var is added (Task 12).
- **Scope:** Single cohesive subsystem (visual retheme), no cross-cutting unrelated changes. Not decomposed further since every task depends only on Phase 1's tokens, not on each other — this is exactly the "ordered phases, parallelizable within phase" structure requested.
