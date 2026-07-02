# STRATA Design System — LevelUp Design Spec

Version 1.0.0 · 2026-06-30

## Overview

Adopt STRATA (source: `strata-design-system/tokens.ts`, `design-system.md`, `StudyTracker.jsx`) as LevelUp's design system, replacing the current emerald/amber light+dark Tailwind theme entirely. STRATA is a dark-only "field research console" aesthetic: near-black instrument panel, status dots instead of checkboxes, IBM Plex Mono for all data/numbers, Fraunces used sparingly for section titles only, and a stamp-in micro-animation on checklist completion.

Decisions locked during brainstorming:
- **Dark-only.** No light mode. `<html>` always has dark styling; no `dark:` Tailwind variant needed anywhere.
- **STRATA's color semantics fully adopted**, replacing LevelUp's old emerald=primary/amber=coins split: amber is the general active/in-progress/primary signal; emerald is reserved exclusively for "complete" state.
- **Visual only — existing terminology kept.** Topics, Lessons, Checklist, Rewards, Badges stay as-is in copy/code. Only colors, type, spacing, radii, motion, and component visual treatment change.
- **Scope: foundation + full restyle in one pass.** All ~33 existing components get reskinned, not just new infrastructure.
- **Architecture: Tailwind v4 `@theme` tokens drive all utilities** (Approach C from brainstorming) — primitives → semantic CSS custom properties become real Tailwind utility classes (`bg-panel`, `text-active`, `font-data`, etc.). A small `global.css` layer handles only what utilities can't express: the stamp-in keyframe + reduced-motion override, the global focus-visible ring, and lesson-content (`.prose`) typography overrides.
- **Fonts**: static `<link>` to Google Fonts in `Base.astro` `<head>` (no runtime JS injection, no FOUC).
- **PWA icons regenerated in this pass** (script-based, see Icons section below).
- **ThemeToggle.svelte removed.** `theme` field stays in `AppData`/store as an inert legacy field (no migration bump).

## 1. Token architecture

Replace the `--color-primary-*` / `--color-coin-*` block in `src/styles/global.css` with a two-tier primitive → semantic system.

### Primitives

| Token | Hex | Role |
|---|---|---|
| `--color-slate-950` | `#0B0F14` | darkest base |
| `--color-slate-900` | `#121822` | panel base |
| `--color-slate-850` | `#1A2230` | panel hover |
| `--color-slate-800` | `#232C3A` | hairline |
| `--color-slate-400` | `#76869C` | muted text |
| `--color-slate-200` | `#CFD8E3` | primary text |
| `--color-amber-500` | `#F5A623` | amber signal |
| `--color-amber-950` | `#3A2B12` | amber soft fill |
| `--color-teal-400` | `#2DD4BF` | teal signal |
| `--color-emerald-400` | `#34D399` | emerald signal |
| `--color-rose-500` | `#F43F5E` | rose signal |
| `--color-paper-100` | `#ECE4D3` | rare paper accent |

### Semantic tokens (reference primitives; this is the re-theme surface)

| Token | Value | Usage |
|---|---|---|
| `--color-ink` | slate-950 | page background |
| `--color-panel` | slate-900 | card/surface background |
| `--color-panel-soft` | slate-850 | row hover background |
| `--color-line` | slate-800 | all hairline borders |
| `--color-text-primary` | slate-200 | body text |
| `--color-text-muted` | slate-400 | labels, secondary text |
| `--color-active` | amber-500 | in-progress, buttons, XP, focus ring, progress fill |
| `--color-active-soft` | amber-950 | unlocked badge/patch fill |
| `--color-complete` | emerald-400 | "complete" state — never reused for anything else |
| `--color-info` | teal-400 | secondary/informational signal |
| `--color-urgency` | rose-500 | streak indicator |
| `--color-paper` | paper-100 | rare field-note accent |

### Typography tokens

| Token | Value | Usage rule |
|---|---|---|
| `--font-display` | `"Fraunces", Georgia, serif` | Section titles, rank/level callouts only. Used rarely. |
| `--font-body` | `"Inter", system-ui, sans-serif` | All prose, default body font. |
| `--font-data` | `"IBM Plex Mono", ui-monospace, monospace` | Mandatory for any number, code, status word, or timestamp — XP, coins, percentages, dates, checklist counts. |

### Spacing / radius / motion tokens

```
--spacing-xs: 4px;  --spacing-sm: 8px;  --spacing-md: 16px;  --spacing-lg: 24px;  --spacing-xl: 40px;
--radius-sm: 6px;   --radius-md: 10px;  --radius-lg: 14px;
--duration-fast: 200ms ease-out;
--duration-stamp: 260ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

## 2. Typography & global CSS

**Font loading** — static link in `src/layouts/Base.astro` `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet" />
```

**`global.css` changes:**
1. Remove `@custom-variant dark` entirely — only one theme exists, so every `dark:` utility prefix is dropped across all components.
2. `body` → `bg-ink text-text-primary font-body antialiased` (no conditional branch).
3. Stamp-in keyframe (ported from STRATA `STYLES`):
   ```css
   @keyframes strata-stamp { 0% { transform: scale(0.85); opacity: 0.4; } 60% { transform: scale(1.12); } 100% { transform: scale(1); opacity: 1; } }
   .stamp-in { animation: strata-stamp var(--duration-stamp); }
   @media (prefers-reduced-motion: reduce) {
     .stamp-in { animation: none !important; }
     .row, .patch { transition: none !important; }
   }
   ```
4. Global focus-visible ring, always on: `*:focus-visible { outline: 2px solid var(--color-active); outline-offset: 2px; }`.
5. Lesson content typography override (`.prose`): headings use `font-display`; body stays `font-body`; `code`/`pre` use `font-data`. Shiki switches from dual-theme to single dark theme: `github-dark-default`.
6. Markdown callout (`> [!NOTE]` etc.) remap from sky/violet/red onto STRATA signal colors:
   - tip → active (amber)
   - note → info (teal)
   - important → info (teal, bolder treatment)
   - warning → active (amber, bolder treatment)
   - caution → urgency (rose)
7. Mermaid diagrams: override `themeVariables` in the `rehype-mermaid` config so diagram background/lines/text use panel/line/text-primary instead of the default light theme.

## 3. Component mapping

**General visual primitives, used across components:**
- **Status dot** (replaces checkbox styling): open circle (`line` color) = not-started; filled amber circle = in-progress; emerald check = complete.
- **Card**: `bg-panel border border-line rounded-md`. No shadows, no light variant.
- **Row**: `bg-transparent hover:bg-panel-soft transition`, real `<button>` element (not `div onclick`) for keyboard/screen-reader support.
- **Stat block**: mono uppercase muted label (11px) above mono value (24px, semantic color).
- **Patch** (locked/unlocked): locked = 50% opacity, `panel-soft` bg, `line` border; unlocked = full opacity, `amber-soft` bg, `amber` border.
- **Progress bar**: track `bg-line`, fill `bg-active` (amber); flips to `bg-complete` (emerald) only at 100%, mirroring STRATA's rule that in-progress→complete reuses the same visual move.

**Per-component changes:**

| Component | Change |
|---|---|
| `TopicCard.astro` / `TopicProgress.svelte` | Mission-row layout: status dot, title, mono `done/total`. |
| `LessonRow.astro` | Objective-row: 2-digit mono sequence number, status glyph, title, mono metadata (estMinutes/difficulty — LevelUp has no per-lesson XP, so use existing fields, not invented XP). |
| `Checklist.svelte` / `ChecklistItem.svelte` | Row pattern + status glyph; stamp-in plays on check via `.stamp-in` class. |
| `CoinBalance.svelte` / `LevelMeter.svelte` | Stat-block pattern, mono amber values. |
| `DailyGoal.svelte` / `StatsSummary.svelte` | Telemetry stat-block grid. |
| `RewardShop.svelte` / `RewardRow.svelte` / `RedemptionList.svelte` | Row pattern; coin cost mono amber, rupiah mono muted. |
| `BadgeList.svelte` / `BadgeTile.svelte` | Patch pattern exactly as STRATA achievement-patch. |
| `Toast.svelte` / `Confetti.svelte` | Recolor only (panel bg, amber/emerald accents by event type); logic unchanged. |
| `SearchModal.svelte`, `Notes.svelte`, `DataMenu.svelte`, `RewardEditor.svelte`, `UploadTopicModal.svelte`, `UserTopicView.svelte`, `UserTopics.svelte` | Inputs: `bg-panel border-line`, amber focus ring. Modals: panel/line surfaces, no light variant. |
| `SiteHeader.astro` | Mono uppercase eyebrow + app name; right side hosts coin/level stat block. |
| `ThemeToggle.svelte` | Deleted. |
| `ThemeScript.astro` | Deleted (no-flash script unneeded with single hardcoded dark theme). |
| `LessonDrawer.svelte` / `RoadmapLinks.svelte` | Restyled to panel/line/mono (newest components, easiest to convert first). |
| `ProgressBar.svelte` | Token swap only (track/fill). |

## 4. Icons

Both `public/favicon.svg` and `scripts/gen-icons.mjs` currently render an emerald (`#059669`) rounded-square background with a white "L" glyph. Recolor:
- Background: `#059669` → `#0B0F14` (ink)
- Glyph: `#ffffff` → `#F5A623` (amber)

Rerun `node scripts/gen-icons.mjs` to regenerate all 4 PNGs (`icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `apple-touch-icon.png`). Maskable icon's safe zone is unaffected — glyph is already centered within the existing padding.

Also update:
- `theme-color` meta in `Base.astro`: `#059669` → `#0B0F14`
- Manifest theme/background colors (PWA config in `astro.config.mjs`) → ink

## 5. Cleanup list

- Delete `src/components/ThemeToggle.svelte`; remove its usage from `SiteHeader.astro`.
- Delete `src/components/ThemeScript.astro` (no-flash logic no longer needed — single theme, no flash possible).
- Strip every `dark:` utility prefix across all components (mechanical, largest diff by line count).
- Remove old `--color-primary-*` / `--color-coin-*` tokens from `global.css`.
- `theme` field remains in `AppData`/persisted store schema as an inert legacy field — no migration version bump.

## 6. Verification plan

1. `pnpm build` — clean, zero errors.
2. Visual pass on every route: `/`, `/topics/[topic]`, `/topics/[topic]/[lesson]`, `/rewards`, `/stats`, `/u`, search modal, upload modal, lesson drawer. Confirm ink/panel/amber/emerald render correctly; no leftover light-mode classes remain.
3. Status-dot / patch / stamp-in motion check on a real checklist toggle.
4. `prefers-reduced-motion` check: stamp-in and hover transitions disable correctly.
5. Contrast check: `text-muted` (#76869C) and `text-primary` (#CFD8E3) against `panel`/`ink` — verify WCAG AA.
6. PWA install prompt shows new icon set.
7. Pagefind search, Mermaid diagrams, and Shiki code blocks all render correctly against the dark-only theme.
