---
title: Clean Code
order: 2
estMinutes: 15
difficulty: easy
checklist:
  - Apply meaningful naming conventions for variables, functions, and classes
  - Write functions that do one thing and fit on a screen
  - Identify the most common code smells and name the refactoring that fixes each
  - Decide when a comment adds value versus when it masks a naming problem
  - Apply the boy scout rule when touching existing code
---

Code is read far more often than it's written — usually by a future teammate, or *you* six months from now. **Clean code** just means writing so that the next reader understands it quickly. It's not about fancy tricks; it's about kindness to whoever reads it next.

## Name things clearly

A good name tells you what something is without a comment:

```ts
// ❌ mystery meat
const d = new Date()
const lst = users.filter(u => u.a)

// ✅ obvious
const today = new Date()
const activeUsers = users.filter(user => user.isActive)
```

Functions should say what they do, as a verb: `fetchUserById`, `isEligibleForDiscount`. If naming something clearly is hard, that's often a sign it's doing too much.

## Keep functions small and focused

Aim for functions that do **one thing** and fit on your screen. A function that validates input *and* saves to the database *and* sends an email is really three functions wearing a trench coat.

> [!TIP]
> If you can't name a function without using "and" or "or," it probably does too much — split it up.

## Comment *why*, not *what*

The best comment is a good name that makes the comment unnecessary. Save comments for things the code *can't* say — the reasoning behind a surprising decision:

```ts
// ❌ pointless — the code already says this
// increment counter
count++

// ✅ useful — explains a non-obvious choice
// Skip the first row; the API always returns a placeholder there.
for (const row of rows.slice(1)) { ... }
```

And delete commented-out code — Git remembers it for you.

## Prefer clear over clever

A dense one-liner that shows off obscure syntax helps no one at 11pm during a bug hunt. Write the version a beginner could follow:

```ts
// clever but murky
const byId = arr.reduce((a, b) => ({ ...a, [b.id]: b }), {})

// clear
const byId = {}
for (const item of arr) byId[item.id] = item
```

## The Boy Scout rule

> [!NOTE]
> "Leave the campground cleaner than you found it." Whenever you touch a file, make one tiny improvement — a better name, a deleted stale comment. Do this consistently and the codebase slowly gets *better* instead of rotting.

## In one sentence

Clean code optimizes for the next reader: use clear names, keep functions small and single-purpose, comment *why* not *what*, favor clear over clever, and tidy a little every time you touch a file.

## Want to go deeper?

Switch to **Expert** mode above for the stepdown rule, a catalog of common "code smells," and their refactorings.
