---
title: Documentation
order: 10
estMinutes: 12
difficulty: easy
checklist:
  - Identify the four types of documentation (README, ADR, API docs, inline comments)
  - Write a JSDoc comment for a public function with params, return, and example
  - Create an Architecture Decision Record using the standard template
  - Decide when to write documentation versus when clear code is sufficient
  - Apply a strategy for keeping documentation up to date with code changes
---

**Documentation** is a note to future readers — teammates, and the you who comes back in six months having forgotten everything. Good docs aren't "explain every line"; they're the *right* info in the *right* place. Too little leaves people lost; too much buries the useful bits.

## The main kinds of docs

- **README** — the front door of a project. Answers: what is this, how do I run it, how do I contribute? A newcomer should go from zero to running in ~15 minutes.
- **API docs** — what a function/endpoint takes and returns. (Often written as JSDoc, see below.)
- **Inline comments** — short notes in the code for anything surprising. Explain the *why*, not the *what*.
- **Decision records (ADRs)** — a short note explaining *why* a big choice was made.

## Comment the *why*, not the *what*

Clear code beats a comment explaining unclear code. Save comments for reasoning the code can't express:

```ts
// ❌ just repeats the code
// loop over users
for (const user of users) { ... }

// ✅ explains a non-obvious reason
// Process newest first so the dashboard shows recent activity immediately.
```

## JSDoc: docs your editor shows you

Writing a JSDoc comment above a function makes your editor show helpful hints when anyone uses it:

```ts
/**
 * Formats an amount as currency.
 * @param cents - amount in the smallest unit (e.g. cents)
 * @param currency - ISO code like "USD"
 * @example formatCurrency(1250, "USD") // "$12.50"
 */
export function formatCurrency(cents, currency) { ... }
```

High value for shared/reusable functions.

## Decision records (ADRs)

When your team makes a notable choice ("we picked PostgreSQL over MongoDB because..."), jot a short note: the context, the decision, and the trade-offs. Months later, when someone asks "why is it done this way?", the answer's written down.

> [!IMPORTANT]
> Stale docs are *worse* than no docs — they actively mislead. When you change behavior, update (or delete) the related docs as part of the job. If in doubt, delete outdated docs rather than leave them wrong.

## In one sentence

Documentation serves future readers: a README to get started, API docs (JSDoc) for reusable functions, inline comments for the *why*, and decision records for big choices — and keeping docs current (or deleting stale ones) matters more than having lots of them.

## Want to go deeper?

Switch to **Expert** mode above for the full ADR template, the docs-per-reader table, and strategies to keep docs in sync with code.
