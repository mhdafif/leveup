---
title: Code Review
order: 8
estMinutes: 12
difficulty: easy
checklist:
  - Articulate the three goals of code review beyond finding bugs
  - Identify what to look for when reviewing a pull request
  - Write a code review comment that is kind, specific, and actionable
  - Apply PR size guidelines to keep your own pull requests reviewable
  - Respond to review feedback without defensiveness
---

**Code review** is when a teammate reads your code before it merges and leaves comments. It's one of the most valuable habits in software — and it's as much about *communication* as it is about code.

## It's not just about catching bugs

Finding bugs is only part of it. Review also:

- **Spreads knowledge** — now more than one person understands the change.
- **Shares ownership** — the whole team feels responsible for the code.
- **Keeps quality up** — catches problems before users do.

> [!NOTE]
> Review isn't seniors judging juniors. Juniors reviewing senior code is great too — fresh eyes catch things, and everyone learns.

## What to look at when reviewing

A quick mental checklist:

- **Correctness** — does it do what it claims? Any missed edge cases (null, empty, etc.)?
- **Clarity** — will someone understand this in six months? Are names clear?
- **Tests** — are the new paths covered?
- **Security** — is user input handled safely?

## Leave kind, specific comments

The *tone* of your comments shapes the whole team's culture. Aim for specific and friendly:

```
❌ "this is fragile"
✅ "This will crash if `user` is null — maybe add a check above?"

❌ "change this"
✅ "Could we use `findIndex` here? I think it reads a bit clearer — wdyt?"
```

> [!TIP]
> Use a `nit:` prefix for tiny, optional suggestions ("nit: typo — recieve → receive") so the author knows it's not blocking the merge.

## Receiving feedback well

- Assume good intent — comments are about the *code*, not you.
- Reply to each comment: fix it, or explain why you disagree.
- Disagreeing is fine — a PR is a discussion, not a verdict.
- Say thanks for good catches.

## Keep your PRs small

The #1 cause of bad reviews is huge pull requests. Reviewers lose focus and start rubber-stamping. Aim for **under ~400 lines** of changes. If a feature is big, split it into a few smaller PRs.

## In one sentence

Code review shares knowledge and ownership (not just catches bugs) — review for correctness/clarity/tests/security, leave kind and specific comments, receive feedback without defensiveness, and keep your own PRs small.

## Want to go deeper?

Switch to **Expert** mode above for a fuller review checklist, comment-severity labels, PR-size data, and stacked PRs.
