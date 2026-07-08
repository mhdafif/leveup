---
title: Frontend Architecture
order: 9
estMinutes: 15
difficulty: easy
checklist:
  - Organise a codebase with feature-based folder structure
  - Separate UI, logic, and data concerns within a feature
  - Implement compound components for flexible, context-aware UI
  - Explain the container/presenter pattern and its trade-offs
  - Describe micro-frontend approaches and when they are appropriate
---

**Architecture** is just "how you organize your code so it doesn't turn into spaghetti as it grows." These are the decisions that are painful to change later, so it helps to know a few good habits early.

## Organize by feature, not by type

A common beginner setup dumps everything by kind — all components in one folder, all hooks in another. That works until it doesn't: to change one feature you're jumping across five folders.

Better: group everything for a feature *together*:

```
src/
  features/
    auth/
      components/   LoginForm.tsx
      hooks/        useAuth.ts
      api/          auth.api.ts
    dashboard/
      ...
  shared/           Button.tsx, formatDate.ts  (used everywhere)
```

Now everything about "auth" lives in one place. Much easier to find, change, or even delete.

## Separate three concerns

Within a feature, try to keep three jobs apart:

- **UI** — components that just *display* things.
- **Logic** — hooks that manage state and rules.
- **Data** — functions that fetch/save (talk to the server).

When a single component fetches data, transforms it, *and* renders it, it's hard to test and reuse. Splitting them makes each piece simple.

## A handy pattern: keep display components "dumb"

A really useful habit is separating "how to get the data" from "how to show it":

```tsx
// smart: knows about data
function UserCardContainer({ userId }) {
  const { data, isLoading } = useUser(userId)
  if (isLoading) return <Skeleton />
  return <UserCard user={data} />
}

// dumb: just shows what it's given — easy to test & preview
function UserCard({ user }) {
  return <div><h2>{user.name}</h2></div>
}
```

The "dumb" `UserCard` is a pure display component — easy to test, easy to reuse anywhere.

## What about micro-frontends?

You might hear about **micro-frontends** — splitting one app so different teams can build and deploy separate pieces. It's powerful but adds a lot of complexity. For almost everyone, a single well-organized app (like the feature folders above) is simpler and better. Reach for micro-frontends only when *team size*, not tech, forces it.

## In one sentence

Organize code by feature (everything for "auth" together), keep UI / logic / data separate, and let display components stay "dumb" so they're easy to test and reuse.

## Want to go deeper?

Switch to **Expert** mode above for compound components, the container/presenter pattern in depth, enforcing import boundaries, and micro-frontend approaches.
