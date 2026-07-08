---
title: Git Workflow
order: 1
estMinutes: 15
difficulty: easy
checklist:
  - Understand the Git object model (blob, tree, commit, tag)
  - Compare trunk-based development with Gitflow and know when to use each
  - Write commit messages following the Conventional Commits specification
  - Choose between rebase and merge for integrating branches
  - Describe the pull request lifecycle from branch to merge
---

**Git** is the tool that saves your project's history — every change, who made it, and when — so you can go back, work in parallel with others, and never lose work. A **commit** is a saved snapshot; a **branch** is a separate line of work.

## The everyday flow

Most teams follow the same rhythm:

1. **Branch** off the main code: `git switch -c feat/login`
2. **Make changes and commit** them as you go.
3. **Push** your branch and open a **pull request** (PR) — a request to merge your work in.
4. Automated checks run; teammates **review** it.
5. Once approved, it's **merged** into `main`, and you delete the branch.

The idea: `main` always stays working, and new work happens safely on branches until it's ready.

## Write clear commit messages

A popular style called **Conventional Commits** puts a little label on each message so everyone (and tools) can scan history easily:

```
feat: add Google login
fix: correct off-by-one in pagination
docs: update setup instructions
```

Common labels: `feat` (new feature), `fix` (bug fix), `docs`, `refactor`, `test`, `chore`.

> [!TIP]
> Keep pull requests small — under ~400 lines of changes. Reviewers give better feedback on focused changes, and small PRs merge faster with fewer conflicts.

## Merge vs rebase (the short version)

Both combine one branch's work into another:

- **Merge** keeps the full branching history (you can see when things came together).
- **Rebase** replays your commits to make a clean, straight-line history.

> [!WARNING]
> Never rebase commits you've already pushed to a *shared* branch — it rewrites history and breaks things for teammates who already have the old version. Rebasing your own local, unpushed commits to tidy them up is fine.

## In one sentence

Git tracks your project's history in commits; the daily flow is branch → commit → open a pull request → review → merge into `main` — with clear Conventional-Commit messages and small PRs.

## Want to go deeper?

Switch to **Expert** mode above for Git's internal object model (blobs, trees, commits), trunk-based vs Gitflow, and interactive rebase.
