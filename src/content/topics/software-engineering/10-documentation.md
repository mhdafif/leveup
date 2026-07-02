---
title: Documentation
order: 10
estMinutes: 20
difficulty: easy
checklist:
  - Identify the four types of documentation (README, ADR, API docs, inline comments)
  - Write a JSDoc comment for a public function with params, return, and example
  - Create an Architecture Decision Record using the standard template
  - Decide when to write documentation versus when clear code is sufficient
  - Apply a strategy for keeping documentation up to date with code changes
---

Documentation is the interface between your present self and future readers — teammates, open-source contributors, and the version of yourself that returns to a codebase after six months. Good documentation is not comprehensive coverage of every line; it is the right information, in the right place, at the right level of detail. The most common failure modes are too little (the reader has no map) and too much (the reader cannot find the signal in the noise).

## Types of Documentation

**README** — the entry point. Every repository needs one. It should answer: what is this? how do I run it? how do I contribute? A good README takes a new engineer from zero to running the project in under 15 minutes. It is not a changelog, a full API reference, or a tutorial.

**Architecture Decision Records (ADRs)** — lightweight documents that capture *why* a significant architectural decision was made, along with the alternatives considered and the tradeoffs accepted. ADRs answer the most common question in any mature codebase: "why is it done this way?"

**API documentation** — generated or hand-written reference for public interfaces. Describes what each function, method, or endpoint accepts, returns, and throws. This is the "what" layer; the ADR is the "why" layer.

**Inline comments** — annotations within the code explaining non-obvious intent, constraints, or warnings. These should be rare in well-named code. When present, they explain the *why*, not the *what*.

## When to Write Docs vs Trust the Code

Clear code with well-named functions and types is always preferable to a comment that explains unclear code. The question is not "should I document this?" but "who is the reader and what do they need?"

| Reader | They need | Best format |
|---|---|---|
| New engineer joining the team | Orientation, setup, project map | README |
| Engineer working on a module | Design rationale, constraints | ADR, module header comment |
| API consumer (internal or external) | What to call, what to expect | JSDoc / OpenAPI |
| Future maintainer | Why this hack exists | Inline comment |

> [!NOTE]
> The "docs or code" debate is a false dichotomy. Types catch a category of mistakes that comments cannot. Comments explain things that types cannot. Both belong, in their place.

## JSDoc for Public APIs

JSDoc is the standard format for documenting TypeScript/JavaScript functions and types. TypeScript-aware editors surface JSDoc inline as you type, making it the most impactful documentation you can write.

```ts
/**
 * Formats a monetary amount for display in the given locale.
 *
 * @param amountCents - The amount in the smallest currency unit (e.g. cents for USD).
 * @param currencyCode - ISO 4217 currency code (e.g. "USD", "EUR", "GBP").
 * @param locale - BCP 47 locale string. Defaults to the user's browser locale.
 * @returns A formatted string, e.g. "$12.50" or "€12,50".
 * @throws {RangeError} If `currencyCode` is not a valid ISO 4217 code.
 *
 * @example
 * formatCurrency(1250, "USD");      // "$12.50"
 * formatCurrency(1250, "EUR", "de-DE"); // "12,50 €"
 */
export function formatCurrency(
  amountCents: number,
  currencyCode: string,
  locale?: string
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(amountCents / 100);
}
```

Document *every* exported symbol in a shared library or package. For application-internal code, document functions whose purpose or constraints are non-obvious.

## Architecture Decision Records

An ADR is a short document (typically 1–2 pages) that records a significant architectural decision. The most widely used format is the MADR (Markdown Architectural Decision Records) template by Michael Nygard:

```markdown
# ADR-0003: Use PostgreSQL as the primary database

## Status
Accepted

## Context
The application needs to store relational data with complex queries.
We evaluated SQLite (too limited for concurrent writes), MongoDB (mismatch
for relational data), and PostgreSQL.

## Decision
We will use PostgreSQL 16 with Prisma as the ORM.

## Consequences
- ✅ Full ACID compliance, excellent JSON support, mature ecosystem
- ✅ Prisma provides type-safe queries and migration tooling
- ❌ Requires a running Postgres instance for local development (solved with Docker)
- ❌ More complex than SQLite for simple CRUD; acceptable given our scale
```

Store ADRs as files in the repository (`docs/decisions/`) so they are versioned alongside the code. A decision that was made and then reconsidered should be marked "Superseded by ADR-0012" — never deleted.

> [!TIP]
> Write ADRs for decisions that caused debate, decisions that might surprise a future engineer, and decisions you know you will revisit. You do not need an ADR for choosing `const` over `let`.

## Keeping Docs Up to Date

Stale documentation is worse than no documentation — it actively misleads. Strategies for keeping docs current:

- **Treat docs like tests.** If a PR changes behaviour, updating the relevant docs is part of the definition of done, not optional.
- **Automate what you can.** Generated API docs (TypeDoc, JSDoc tooling) stay in sync automatically. OpenAPI specs generated from route definitions cannot drift from the routes.
- **Docs-as-code review.** Include a documentation check in your PR template: "Does this change require a README or ADR update?"
- **Remove dead docs.** A deleted feature's documentation should be deleted with it.

> [!IMPORTANT]
> The most dangerous documentation is the kind that was accurate when written and is now silently wrong. Prioritise deleting stale docs over updating them — it is faster and reduces the risk of misleading readers.

## Further Learning

Search these terms to go deeper:
- **"MADR Michael Nygard Architecture Decision Records"** — the original ADR format and a large community collection of examples
- **"Divio documentation system"** — a framework dividing docs into tutorials, how-to guides, reference, and explanation
- **"TypeDoc TSDoc"** — the standard for JSDoc in TypeScript projects and how to generate HTML from it
- **"Docs as code Anne Gentle"** — treating documentation with the same rigor as code (version control, review, CI)
- **"Write the Docs community"** — the largest community of technical writers and documentation practitioners
