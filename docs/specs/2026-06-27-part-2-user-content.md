# LevelUp Part 2 — User-uploaded topics, custom rewards, search modal

> Spec / implementation plan · v1 · 2026-06-27
> Companion human doc: `2026-06-27-part-2-user-content.html`
> Part 1 (the shipped base app) plan: `~/.claude/plans/jadi-begini-saya-ingin-tingly-pearl.md`

## 1. Context & goals

Part 1 shipped the base app: built-in markdown topics (Astro Content Collections), checklist progress, gamification (coins/XP, badges, daily goal, confetti, reward shop), notes, export/import, Pagefind search, PWA, VPS deploy. All state lives in one `localStorage` key (`levelup:data`).

Part 2 adds three user-requested capabilities, **without removing** built-in topics:

1. **Upload a topic as a single `.md` file** at runtime; it is parsed and saved to browser storage, then rendered like a built-in topic (checklists, progress, coins all work).
2. **Custom rewards** — a full in-app editor (add / edit / delete). The current 6 rewards become *deletable* seeded defaults, with a "reset to defaults".
3. **Search becomes a modal/popup** (open with the header button or `Cmd/Ctrl+K`) showing results inline; the standalone `/search` page is removed.

Plus a **documented markdown format** (this spec's §4, an in-app template download, and a help link) so the user knows how to author an uploadable topic.

## 2. Architecture shift — client-rendered user content

Built-in topics are static (built at deploy time). User-uploaded content cannot be statically built, so:

- User topics are **parsed and rendered client-side** from `localStorage`.
- The store's in-memory `ContentIndex` becomes **built-in (fetched `/content-index.json`) merged with user topics (from storage)**. Because `progress.ts` and `gamification.ts` are generic over a `ContentIndex` keyed by `${topicSlug}/${lessonSlug}`, progress %, coins, badges, and stats all work uniformly across built-in and user topics with no logic changes.
- User-topic ids are **prefixed** (`u-<slug>-<rand>`) so their `progress`/`notes` keys never collide with built-in slugs.

## 3. Data model changes

Extend `AppData` in `src/lib/types.ts`; bump `version` 1 → 2; `migrate()` seeds the new fields so existing saves upgrade cleanly. Both fields live inside `levelup:data`, so existing export/import and reset already cover them.

```ts
interface UserLesson {
  slug: string;
  title: string;
  checklist: string[];
  body: string;            // raw markdown, rendered client-side on view
  estMinutes?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}
interface UserTopic {
  id: string;              // `u-<slug>-<rand>`
  title: string;
  icon?: string;
  description?: string;
  createdAt: string;       // ISO
  lessons: UserLesson[];
}

// added to AppData:
rewards: Reward[];         // seeded from DEFAULT_REWARDS; editable/deletable
userTopics: UserTopic[];   // uploaded topics
```

`migrate()` rules: if `rewards` absent → seed `DEFAULT_REWARDS`; if `userTopics` absent → `[]`. `defaultData()` includes both. Unit-test the migration (v1 blob → v2 with seeded rewards, empty userTopics).

## 4. Topic markdown upload format (the documented spec)

**One `.md` file = one topic.** Top YAML frontmatter is the topic; each `#` H1 heading starts a subtopic; a `## Checklist` task list under a subtopic defines its checklist; everything else under the H1 is that subtopic's theory body.

```markdown
---
title: My Topic
icon: "📦"
description: One-line summary shown on the card.
---

# First Subtopic

Theory markdown. Supports code blocks, > [!NOTE] callouts, and ```mermaid diagrams.

## Checklist
- [ ] First thing to learn
- [ ] Second thing to learn

# Second Subtopic

More theory...

## Checklist
- [ ] Another item
```

Rules:
- **Frontmatter**: `title` required; `icon`, `description` optional. (Flat key: value only.)
- **Subtopics**: each `#` H1 = one subtopic; its text = subtopic title; order = document order.
- **Checklist**: the task list (`- [ ]` / `- [x]`) following a `## Checklist` heading inside a subtopic. The `## Checklist` section is **stripped from the rendered body** so it isn't duplicated by the interactive checklist.
- **Optional per-subtopic meta**: none in v1 (keep simple); `estMinutes`/`difficulty` may be added later.
- A topic must have ≥1 subtopic; a subtopic with no checklist is allowed (renders body only).

Parser `src/lib/parseTopic.ts` (pure, unit-tested) → `{ topic: UserTopic, errors: string[] }`:
- Split/parse frontmatter (hand-rolled flat parser, no `js-yaml` dep).
- Split body by `# ` headings into subtopics.
- Extract `## Checklist` task items per subtopic; strip that section from the body.
- Slugify titles; generate topic id `u-<slug>-<rand>`.
- Validation errors (clear messages): missing `title`, no subtopics, malformed frontmatter; warning for a subtopic with an empty checklist.

## 5. Client-side rendering of user content

`src/lib/renderMarkdown.ts` using **`marked`** (new dep), with hooks that **reuse Part 1 assets**:
- ` ```mermaid ` fences → `<pre class="mermaid">` so the existing `Mermaid.svelte` island renders them.
- `> [!NOTE|TIP|WARNING|CAUTION|IMPORTANT]` blockquotes → the existing `.markdown-alert` markup/CSS (a small marked extension or post-process).
- Code blocks → **lazy-loaded Shiki** (`shiki` dynamic import, `github-light`/`github-dark`, emit `.astro-code` so the existing dual-theme CSS applies). Heavy libs load only when a user lesson is viewed.

User views are **client-only** (content is in storage, absent at build): one static page `src/pages/u.astro` hydrates `UserTopicView.svelte` with `client:only="svelte"`, routing by URL query:
- `/u?t=<topicId>` → subtopic list for that topic.
- `/u?t=<topicId>&l=<lessonSlug>` → lesson view: rendered body + `Checklist` + `Notes` (reuse the existing components — they're generic over `${topic}/${lesson}` keys).

## 6. Store / index integration — `src/lib/store.ts`

- New pure helper `userTopicsAsIndex(userTopics): TopicMeta[]` (id as slug, lessons → `checklistLen`).
- `ensureIndex()` returns the **merged** index = fetched built-in `/content-index.json` + `userTopicsAsIndex($appData.userTopics)`; recomputed when `userTopics` changes.
- New actions: `addUserTopic(topic)`, `deleteUserTopic(id)` (also purge that topic's `progress`/`notes` keys), `addReward(reward)`, `updateReward(reward)`, `deleteReward(id)`, `resetRewards()`.
- `StatsSummary` overall % uses the merged index so uploaded topics count too.

## 7. Rewards customization

- `src/data/rewards.ts`: keep `DEFAULT_REWARDS` (current 6) + `WEEKLY_ALLOWANCE_CAP`; stop importing the list directly in the shop.
- `RewardShop.svelte` reads `$appData.rewards`; `RewardRow`/`RedemptionList` resolve metadata from `$appData.rewards` (fallback to id).
- New `RewardEditor.svelte` (section/modal on `/rewards`): list rewards with edit/delete; an "Add reward" form (name, emoji, coin cost, rupiah — validated positive integers); a "Reset to defaults" button. Custom rewards persist in `levelup:data` and survive export/import.

## 8. Upload & management UI

- `UploadTopicModal.svelte` + `AddTopicButton.svelte`: `.md` file input **or** paste area → `parseTopic` → preview (topic title, subtopic list, per-subtopic item counts) + validation errors → "Add to my topics" (`addUserTopic`). Includes a **"Download template"** (`public/templates/topic-template.md`) and a link to the format doc.
- `UserTopics.svelte` island on `index.astro`: lists uploaded topics (link `/u?t=...`, progress via the merged index, each with a delete control + confirm) plus the Add-topic button, under the existing built-in `TopicCard` grid.

## 9. Search modal (replaces `/search`)

- Delete `src/pages/search.astro`. The header "Search" item becomes a **button** in `SiteHeader.astro` that opens a global `SearchModal.svelte` (mounted in `Base.astro`, `client:idle`); also opens via `Cmd/Ctrl+K`, closes via `Esc` / backdrop.
- Query merges two sources, shown inline in the modal:
  1. **Built-in** via the Pagefind **JS API** (`import('/pagefind/pagefind.js')`, production only — same index `pagefind --site dist` already builds).
  2. **Uploaded topics** via a lightweight client filter over `userTopics` (title + checklist + body text).
- Results link to built-in lesson URLs (`/topics/.../...`) or user lessons (`/u?t=...&l=...`). Loading / empty / no-result states handled. Keep `data-pagefind-body` on built-in lesson articles.
- Note: built-in results only appear against a production build (Pagefind is build-time); uploaded-topic results work everywhere including `pnpm dev`.

## 10. Docs deliverables (per `~/.claude/DOCS.md`)

- This spec: `docs/specs/2026-06-27-part-2-user-content.md` (+ `.html` companion).
- `docs/specs/2026-06-27-topic-markdown-format.{html,md}`: a focused author's guide to §4 (fields, rules, full example, common errors) — the "rule doc" the user asked for.
- `public/templates/topic-template.md`: the downloadable starter offered in the upload modal.
- Update top-level `README.md` "Adding study content" to cover both repo-authored and in-app uploaded topics.

## 11. Tasks (TDD where pure)

1. Extend `AppData` (`rewards`, `userTopics`) + `migrate` seeding + version bump; unit tests. Files: `src/lib/types.ts`, `src/lib/persistence.ts`, `src/data/rewards.ts`.
2. `src/lib/parseTopic.ts` + `parseTopic.test.ts` — frontmatter, multi-subtopic split, checklist extraction/stripping, slug/id, error/warning cases.
3. `userTopicsAsIndex` + merged `ensureIndex` + new store actions (topic add/delete, reward CRUD); index-merge unit tests.
4. `src/lib/renderMarkdown.ts` (marked + mermaid/callout hooks + lazy Shiki).
5. `UserTopicView.svelte` + `src/pages/u.astro` (`client:only`) reusing `Checklist`/`Notes`.
6. `UploadTopicModal.svelte` + `AddTopicButton.svelte` + `UserTopics.svelte`; wire into `index.astro`.
7. Rewards: refactor `RewardShop` to read `$appData.rewards`; add `RewardEditor.svelte` on `/rewards`.
8. `SearchModal.svelte` (Pagefind API + userTopics filter) in `Base.astro`; header Search → button; delete `search.astro`.
9. Docs: this spec's HTML companion, the topic-markdown-format guide (html+md), `topic-template.md`, README update.

## 12. Verification

- `rtk pnpm test` — new `parseTopic` + index-merge tests pass alongside the existing 32.
- Upload the template `.md` (via preview MCP) → topic appears on home → open it → subtopics → lesson renders (highlighted code, callout, mermaid) with working checklist + notes; checking items awards coins and counts toward overall % / badges (verify `levelup:data`).
- Delete a user topic (with confirm) → removed; its `progress`/`notes` keys purged.
- `/rewards`: add a custom reward, edit it, delete a default, reset to defaults; redeem still works; custom rewards survive reload and an export → clear → import round-trip.
- Search: `Cmd/K` opens the modal; query returns built-in (production build) + uploaded results; `Esc` closes; `/search` route is gone.
- `rtk pnpm build` succeeds; PWA + Pagefind intact.
