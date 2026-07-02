---
title: Clean Code
order: 2
estMinutes: 30
difficulty: medium
checklist:
  - Apply meaningful naming conventions for variables, functions, and classes
  - Write functions that do one thing and fit on a screen
  - Identify the most common code smells and name the refactoring that fixes each
  - Decide when a comment adds value versus when it masks a naming problem
  - Apply the boy scout rule when touching existing code
---

Robert C. Martin's *Clean Code* (2008) crystallised a body of craft knowledge that engineers had accumulated over decades: code is read far more than it is written, so the primary measure of quality is how easy it is to read and change. Clean code is not about style preferences — it is about reducing the cognitive load on the next person who opens the file, who is often yourself six months later.

## Naming

The name of a variable, function, or class is a contract with the reader. A good name makes the code self-documenting.

**Variables** should reveal intent. Avoid single letters except as loop counters (`i`, `j`) and avoid encodings like Hungarian notation (`strName`).

```ts
// Bad
const d = new Date();
const lst = users.filter(u => u.a);

// Good
const today = new Date();
const activeUsers = users.filter(user => user.isActive);
```

**Functions** should be verbs or verb phrases that describe what they do, not how they do it. Boolean-returning functions read naturally as predicates.

```ts
// Bad
function data(id: string) { ... }
function check(user: User) { ... }

// Good
function fetchUserById(id: string) { ... }
function isEligibleForDiscount(user: User) { ... }
```

**Classes** are nouns representing a single concept. Avoid vague suffixes like `Manager`, `Helper`, or `Processor` — they usually signal a class that does too much.

## Function Size and Single Responsibility

Martin's rule of thumb: a function should do one thing, do it well, and do it only. In practice this means it should operate at a single level of abstraction. A function that validates input, queries the database, formats a response, and logs a metric is doing four things.

Small functions (5–15 lines) have several advantages: they are easy to name, easy to test in isolation, and easy to reuse. If you cannot give a function a descriptive name without using "and" or "or", it probably does too much.

> [!NOTE]
> The stepdown rule: code should read like a narrative from top to bottom. High-level functions appear first and call lower-level helpers below them. Readers can skim the high-level flow and drill in only where needed.

## Comments: When and When Not

The best comment is a well-named function or variable that makes the comment unnecessary. Comments that re-state the code are noise; worse, they rot — the code changes and the comment does not.

**Good reasons to comment:**
- Explaining *why* a non-obvious decision was made ("we intentionally skip X because of Y edge case")
- Documenting public API contracts (JSDoc on exported functions)
- Warning about unexpected consequences
- TODO/FIXME markers (but clean them up regularly)

**Bad reasons to comment:**
- Explaining what the code does (rename or extract a function instead)
- Commented-out code (delete it — version control has it)
- Journal entries ("Added by Afif on 2025-01-01")

```ts
// Bad: comment restates the code
// increment counter by one
count++;

// Good: comment explains intent
// We skip the first element because the API always returns a sentinel value
for (const item of items.slice(1)) { ... }
```

## Code Smells

Martin Fowler catalogued code smells in *Refactoring* (1999, updated 2018) — symptoms that suggest (but don't prove) a structural problem:

| Smell | What it means |
|---|---|
| **Long method** | Function does too much; extract sub-functions |
| **Feature envy** | A method uses another object's data more than its own; move it |
| **Shotgun surgery** | One change requires edits across many files; consolidate |
| **Data clumps** | The same three parameters appear together everywhere; introduce a parameter object |
| **Switch statements** | Long switch/if-else on type; replace with polymorphism |
| **Magic numbers** | Unexplained literals; replace with named constants |
| **Dead code** | Unreachable or unused code; delete it |

## The Boy Scout Rule

> [!TIP]
> Leave the campground cleaner than you found it. Every time you touch a file, make one small improvement — rename a confusing variable, extract a long function, delete a stale comment. You don't need a dedicated refactoring sprint if every commit chips away at entropy.

This compounding habit prevents codebases from decaying. The key constraint: the improvement must not change behaviour. If you cannot make the change safely (no tests, unclear semantics), leave a TODO instead.

## Readability Over Cleverness

A one-liner that uses obscure language features impresses no one on code review and trips up everyone during maintenance. Code is a communication medium first, an execution instruction second.

```ts
// Clever but opaque
const result = arr.reduce((a, b) => ({ ...a, [b.id]: b }), {} as Record<string, Item>);

// Readable
const itemsById: Record<string, Item> = {};
for (const item of arr) {
  itemsById[item.id] = item;
}
```

Both compile to similar bytecode. The second version is unambiguous to a junior engineer and survives a tired 11pm bug-hunt.

## Further Learning

Search these terms to go deeper:
- **"Clean Code Robert C. Martin"** — the source book; chapters 2–5 cover naming, functions, comments, and formatting
- **"Code smells Martin Fowler refactoring catalog"** — an online reference to every named smell and its fix
- **"Jeff Atwood coding horror naming things"** — the famous claim that naming and cache invalidation are the two hardest problems
- **"readable code vs clever code Stack Overflow"** — community discussion on optimising for readers
- **"boy scout rule clean code blog Uncle Bob"** — Martin's original essay on incremental improvement
