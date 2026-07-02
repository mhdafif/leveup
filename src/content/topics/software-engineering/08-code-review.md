---
title: Code Review
order: 8
estMinutes: 20
difficulty: easy
checklist:
  - Articulate the three goals of code review beyond finding bugs
  - Identify what to look for when reviewing a pull request
  - Write a code review comment that is kind, specific, and actionable
  - Apply PR size guidelines to keep your own pull requests reviewable
  - Respond to review feedback without defensiveness
---

Code review is the practice of having one or more engineers read and comment on a colleague's code before it is merged. Done well, it is one of the highest-leverage activities in software engineering — it distributes knowledge, prevents bugs, and raises the quality of the entire codebase. Done poorly, it becomes a bottleneck, a gatekeeping ritual, or a source of demoralisation. The difference is almost entirely in the culture and communication around it, not in the tools.

## The Goals of Code Review

It is tempting to frame code review as "finding bugs," but that is too narrow. The full set of goals, roughly in order of importance:

1. **Knowledge sharing** — reviewers learn about changes to the codebase; authors learn from feedback. No one is the single point of failure for a module.
2. **Shared ownership** — a PR that multiple people have read is a PR that multiple people understand and feel responsible for.
3. **Quality improvement** — bugs, logic errors, missing edge cases, and design problems caught before production.
4. **Style and consistency** — enforcing team conventions that automated linters cannot fully capture.

> [!NOTE]
> Code review is not a gatekeeping ritual where a senior engineer approves work from juniors. Juniors can and should review senior engineers' code — fresh eyes catch things that familiarity misses, and the review is an excellent learning opportunity for both parties.

## What to Look For

A structured checklist prevents both over-focus on style nits and under-focus on logic:

**Correctness**
- Does the code do what the PR description claims?
- Are there off-by-one errors, null/undefined cases, or race conditions?
- Does error handling cover realistic failure modes?

**Design**
- Does this change fit the existing architecture or introduce an inconsistency?
- Is the responsibility distribution clean, or has a new function been bolted onto a class that already does too much?

**Testability and tests**
- Are new code paths covered by tests?
- Are the tests testing behaviour or implementation details?

**Security**
- Is user input validated and sanitised?
- Are secrets or sensitive data handled correctly?

**Readability**
- Would a new team member understand this code in six months?
- Are names clear? Is the level of abstraction consistent?

## How to Give Constructive Feedback

The tone of a review comment shapes the entire culture of the team. Prefer:

- **Specific over vague:** "This will throw if `user` is null — consider adding a null check before line 12" beats "this looks fragile."
- **Questions over assertions:** "Could we use `Array.findIndex` here instead? I think it's more readable — what do you think?" is less confrontational than "change this to `Array.findIndex`."
- **Label the severity:** Use explicit prefixes so the author knows what is blocking and what is optional.

```
// Blocking — must be fixed before merge
nit: Typo in variable name: "recieve" → "receive"
[blocking]: This mutation happens before the async operation resolves — it'll use stale data

// Non-blocking suggestions
[optional]: We have a `formatCurrency` utility in `/lib/format.ts` that handles this already
[question]: Is there a reason we're not using the existing `useUser` hook here?
```

> [!TIP]
> The "nit:" prefix (short for nitpick) signals that you noticed something small — a style preference or minor improvement — but it is not blocking merge. This prevents minor style comments from blocking progress.

## How to Receive Feedback

Receiving a code review is a professional skill, not just a formality.

- Assume good intent. Comments about your code are not comments about you.
- Respond to every comment — either address it, or explain why you disagree and ask for clarification.
- Disagreements are healthy. If you believe the reviewer is wrong, explain your reasoning calmly. The PR is a discussion, not a verdict.
- Say thank you for non-trivial insights. Positive reinforcement improves review culture.

## PR Size Guidelines

Large pull requests are the most common cause of poor code review. When a diff exceeds 600–800 lines, reviewers lose focus, miss bugs, and start rubber-stamping to escape the cognitive load.

| PR size | Expected outcome |
|---|---|
| < 200 lines | Reviewed thoroughly in 10–15 min; catches the most bugs |
| 200–400 lines | Reviewable with effort; most teams' realistic sweet spot |
| 400–800 lines | Reviewers skim; bugs slip through |
| > 800 lines | Effectively unreviewed; nearly always approved with LGTM |

> [!IMPORTANT]
> If a feature genuinely requires thousands of lines, break the PR into a series of preparatory refactoring PRs followed by a thin feature PR. Stacked PRs (feature branches off feature branches) also work well with tools like GitHub's PR stacking support or tools like Graphite.

## Further Learning

Search these terms to go deeper:
- **"Google Engineering Practices code review guide"** — Google's publicly available, battle-tested code review standards
- **"conventional comments Grafton Adams"** — a formal specification for labelling review comment severity
- **"Accelerate Forsgren Humble Kim code review"** — the research connecting code review practices to delivery performance
- **"stacked pull requests Graphite"** — tooling for managing chains of dependent, reviewable PRs
- **"code review anxiety imposter syndrome"** — the human side of giving and receiving feedback
