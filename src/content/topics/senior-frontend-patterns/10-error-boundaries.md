---
title: Error Boundaries & Graceful Degradation
order: 10
estMinutes: 25
difficulty: medium
checklist:
  - Implement a React ErrorBoundary class component with a fallback UI
  - Identify which subtree to wrap to limit the blast radius of an error
  - Log caught errors to an error monitoring service
  - "Apply the Svelte {#await} error slot for async component errors"
  - Design a fallback UI that helps the user recover
---

Component errors should not collapse the entire product. Error boundaries catch JavaScript errors in a subtree, show a fallback, and let the rest of the page keep working. They are not a replacement for fixing bugs; they are a containment strategy for failures that happen in production anyway.

## React Boundary

React error boundaries are class components because they rely on lifecycle methods. Wrap independently useful regions such as navigation, feed, chart, editor, or settings panel.

```ts
import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback: ReactNode;
  logError: (error: Error, info: ErrorInfo) => void;
};

type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.logError(error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
```

Send caught errors to monitoring with enough context to debug: route, user session identifier, release version, and component stack. Avoid logging private form data.

## Svelte Async Failures

Svelte does not use React-style error boundaries, but async UI can degrade with `{#await}` catch blocks. The concept is the same: localize failure and provide a recovery path.

```ts
type AsyncState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };

export function toAsyncState<T>(promise: Promise<T>): Promise<AsyncState<T>> {
  return promise
    .then((data) => ({ status: "success", data }) as const)
    .catch((error: Error) => ({ status: "error", error }) as const);
}
```

Fallback UI should be honest and useful: state that something failed, preserve surrounding navigation, and offer retry or reload when that can work.

> [!TIP]
> Wrap each independently-functional section (sidebar, feed, chart) in its own boundary. A broken chart shouldn't crash the nav.

## Further Learning

Search these terms to go deeper:
- **"React error boundary componentDidCatch"** — class boundary mechanics
- **"Svelte await catch block"** — async fallback patterns in Svelte
- **"frontend graceful degradation patterns"** — keeping partial interfaces usable
- **"Sentry component stack React"** — logging boundary errors with useful context
