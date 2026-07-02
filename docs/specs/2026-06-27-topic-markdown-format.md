# Topic markdown format — author's guide

> Reference · v1 · 2026-06-27
> Companion human doc: `2026-06-27-topic-markdown-format.html`
> Downloadable starter: `public/templates/topic-template.md`

How to write a `.md` file you can upload in LevelUp (home → **Add topic**). One
file becomes one topic with any number of subtopics.

## 1. Shape of the file

```markdown
---
title: My Topic
icon: "📦"
description: One-line summary shown on the card.
---

# First Subtopic

Theory markdown goes here.

## Checklist
- [ ] First thing to learn
- [ ] Second thing to learn

# Second Subtopic

More theory…

## Checklist
- [ ] Another item
```

## 2. Frontmatter (topic info)

A `---` fenced block at the very top. Flat `key: value` pairs only.

| Field | Required | Notes |
| --- | --- | --- |
| `title` | **yes** | The topic name shown on the card and headings. |
| `icon` | no | A single emoji, e.g. `"📦"`. Quotes optional. |
| `description` | no | One-line summary shown on the topic card. |

## 3. Subtopics

- Every `#` (H1) heading starts a new subtopic; the heading text is its title.
- Subtopics appear in the order they're written.
- A topic needs at least one subtopic.

## 4. Checklists

- Inside a subtopic, add a `## Checklist` heading followed by a task list.
- Each `- [ ]` (or `- [x]`) line is one tickable item.
- The `## Checklist` section is removed from the rendered theory, so it isn't
  shown twice — the interactive checklist renders it instead.
- A subtopic may omit the checklist (it just renders theory).

```markdown
## Checklist
- [ ] Understand the idea
- [ ] Do one practice problem
```

## 5. Supported markdown in the theory

The body of each subtopic supports the same features as built-in lessons:

- **Headings** (`##`–`######`), **bold**, *italic*, lists, tables, links, images.
- **Code blocks** with syntax highlighting:
  ````markdown
  ```js
  console.log("hello");
  ```
  ````
- **Callouts** — GitHub-style alerts:
  ```markdown
  > [!NOTE]
  > Also: [!TIP], [!WARNING], [!CAUTION], [!IMPORTANT].
  ```
- **Diagrams** with Mermaid:
  ````markdown
  ```mermaid
  flowchart LR
    A --> B
  ```
  ````

## 6. Common errors

| Message | Fix |
| --- | --- |
| "Missing `title` in frontmatter." | Add a `---` block at the top with `title:`. |
| "No subtopics found…" | Add at least one `# Subtopic` H1 heading. |
| "Subtopic … has no checklist items." | Warning only — add a `## Checklist` if you want tracking. |

## 7. Uploading

Home → **Add topic** → choose your `.md` file or paste its contents. A preview
shows the topic, its subtopics, and item counts before you confirm. Your topics
are saved in this browser and included in your export/import backup.
