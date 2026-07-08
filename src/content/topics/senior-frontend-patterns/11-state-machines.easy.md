---
title: State Machine Patterns
order: 11
estMinutes: 12
difficulty: easy
checklist:
  - Identify the boolean-flag antipattern and its failure modes
  - Model a UI flow as an explicit set of named states
  - Implement a minimal useStateMachine hook that prevents invalid transitions
  - Apply a state machine to a multi-step form or async fetch lifecycle
  - Evaluate XState as a full solution for complex state logic
---

Ever had a bug where a loading spinner shows *and* an error message shows at the same time? That happens when you track UI status with a pile of separate true/false flags. A **state machine** fixes this by saying: the UI is in exactly *one* named state at a time.

## The problem: flag soup

Say you track a data fetch with booleans:

```ts
isLoading, isError, isSuccess, isRetrying
```

Four flags = 16 possible combinations — but most are nonsense (loading *and* success?). It's easy to accidentally set two at once and get a weird UI.

## The fix: one state at a time

Instead of flags, name the states the UI can actually be in, and only allow sensible moves between them:

```ts
type State = 'idle' | 'loading' | 'success' | 'error'
```

It can be `loading` *or* `success`, never both. You define which events move you where:

- From `idle`, a "fetch" event → `loading`
- From `loading`, "resolve" → `success`, or "reject" → `error`
- From `error`, "retry" → `loading`

Any move that's not allowed simply does nothing — so you *can't* end up in an impossible combination.

## A tiny version

You can build this with a simple lookup table of "from this state, this event leads to that state." No library required for simple cases. For big, complex flows (checkout, onboarding), a library called **XState** adds powerful tools and even visual diagrams.

> [!WARNING]
> Four boolean flags on a component is a warning sign. If you're writing conditions like `if (isLoading && !isError)`, that's your cue to switch to named states instead.

## In one sentence

A state machine models a UI as exactly one named state at a time (`idle`/`loading`/`success`/`error`) with defined transitions — replacing tangled boolean flags that let impossible combos like "loading and success" slip through.

## Want to go deeper?

Switch to **Expert** mode above for a reusable `useStateMachine` hook, the full transition table, and when to reach for XState.
