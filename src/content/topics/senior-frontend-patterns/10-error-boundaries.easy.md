---
title: Error Boundaries & Graceful Degradation
order: 10
estMinutes: 12
difficulty: easy
checklist:
  - Implement a React ErrorBoundary class component with a fallback UI
  - Identify which subtree to wrap to limit the blast radius of an error
  - Log caught errors to an error monitoring service
  - "Apply the Svelte {#await} error slot for async component errors"
  - Design a fallback UI that helps the user recover
---

Bugs happen in production no matter how careful you are. The question is: when one part of your app crashes, does the *whole page* go blank, or just that one broken piece? An **error boundary** makes sure it's just the one piece.

## Contain the damage

Imagine a dashboard with a nav bar, a feed, and a chart. If the chart hits a bug, you don't want the nav and feed to disappear too. An error boundary wraps a section, catches any crash inside it, and shows a friendly fallback there — while everything else keeps working.

## In React

React error boundaries are a special component that catches errors in whatever they wrap:

```tsx
<ErrorBoundary fallback={<p>This chart failed to load.</p>}>
  <Chart />
</ErrorBoundary>
```

If `<Chart>` crashes, the user sees "This chart failed to load" *there*, and the rest of the page is fine.

> [!TIP]
> Wrap each independently-useful section (sidebar, feed, chart) in its own boundary. A broken chart shouldn't take down the navigation.

## Make the fallback helpful

A good fallback is honest and useful: say something went wrong, keep the surrounding page working, and — when possible — offer a **"Try again"** button. A blank screen tells the user nothing; "Something went wrong loading comments — retry?" lets them recover.

## Log it so you can fix it

When a boundary catches an error, send it to an error-tracking service (like Sentry) with helpful context — which page, which release version — so you actually find out it happened and can fix it. (Just don't log private user data.)

## In one sentence

An error boundary catches a crash in one part of the UI and shows a fallback there instead of blanking the whole page — wrap each independent section in its own boundary, make the fallback offer recovery, and log the error so you can fix it.

## Want to go deeper?

Switch to **Expert** mode above for the full React `ErrorBoundary` class, Svelte's `{#await}` catch blocks, and logging with useful context.
