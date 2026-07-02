---
title: State Machine Patterns
order: 11
estMinutes: 35
difficulty: hard
checklist:
  - Identify the boolean-flag antipattern and its failure modes
  - Model a UI flow as an explicit set of named states
  - Implement a minimal useStateMachine hook that prevents invalid transitions
  - Apply a state machine to a multi-step form or async fetch lifecycle
  - Evaluate XState as a full solution for complex state logic
---

Boolean flags feel convenient until they multiply. `isLoading`, `isError`, `isSuccess`, and `isRetrying` create sixteen possible combinations, but most are invalid. State machines replace flag soup with explicit named states and allowed transitions.

## Named States

Start by naming what the UI can actually be. An async request might be `idle`, `loading`, `success`, `error`, or `retrying`. Each event moves from one state to another only if that transition is allowed.

```ts
type FetchState = "idle" | "loading" | "success" | "error" | "retrying";
type FetchEvent = "FETCH" | "RESOLVE" | "REJECT" | "RETRY" | "RESET";

const transitions: Record<FetchState, Partial<Record<FetchEvent, FetchState>>> = {
  idle: { FETCH: "loading" },
  loading: { RESOLVE: "success", REJECT: "error" },
  success: { RESET: "idle", FETCH: "loading" },
  error: { RETRY: "retrying", RESET: "idle" },
  retrying: { RESOLVE: "success", REJECT: "error" },
};

export function transition(state: FetchState, event: FetchEvent): FetchState {
  return transitions[state][event] ?? state;
}
```

Invalid transitions do nothing, which prevents impossible states such as loading and success at the same time.

## Minimal Hook Shape

In React, a small hook can wrap this transition table. In Svelte or nanostores, the same transition function can sit in a shared store.

```ts
import { useCallback, useState } from "react";

export function useStateMachine<TState extends string, TEvent extends string>(
  initialState: TState,
  table: Record<TState, Partial<Record<TEvent, TState>>>,
) {
  const [state, setState] = useState(initialState);

  const send = useCallback((event: TEvent) => {
    setState((current) => table[current][event] ?? current);
  }, [table]);

  return { state, send };
}
```

For complex flows, XState adds guards, actions, invoked services, actors, parallel states, and visual tooling. Reach for it when the statechart is central to the product, such as onboarding, checkout, collaborative editing, or multi-step approvals.

> [!WARNING]
> Four boolean flags on a component is a smell. If you catch yourself writing if (isLoading && !isError), model it as a state machine instead.

## Further Learning

Search these terms to go deeper:
- **"finite state machines UI state"** — modeling interfaces as states and events
- **"XState guards actions actors"** — full-featured statechart architecture
- **"boolean flag antipattern frontend"** — recognizing impossible UI combinations
- **"statechart multi step form"** — applying machines to user flows
