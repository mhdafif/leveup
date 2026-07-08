---
title: Advanced TypeScript
order: 1
estMinutes: 15
difficulty: easy
checklist:
  - Understand conditional types and the infer keyword
  - Write mapped types to transform existing types
  - Use template literal types to model string patterns
  - Apply utility types (Partial, Required, Pick, Omit, ReturnType) correctly
  - Build discriminated unions with exhaustive type guards
---

Once you're comfortable with basic TypeScript, there's a set of power tools that let you describe complex rules in types — so bad code won't even compile. This lesson keeps it gentle: the goal is to *recognize* these tools and use the everyday ones, not to master type wizardry.

## Ready-made helper types

TypeScript ships with handy "type transformers." You give them a type, they give you a tweaked version:

```ts
type User = { id: number; name: string; email: string }

type PartialUser = Partial<User>          // every field optional
type Preview = Pick<User, 'id' | 'name'>  // only id and name
type NoEmail = Omit<User, 'email'>        // everything except email
```

These five are the ones you'll actually reach for: `Partial`, `Required`, `Pick`, `Omit`, and `ReturnType`. They save you from rewriting variations of a type by hand.

## Discriminated unions: the most useful pattern

This is the big one worth learning. When something can be one of a few *shapes*, give each shape a label field. TypeScript then knows exactly which one you have after you check the label:

```ts
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number }

function area(s: Shape) {
  switch (s.kind) {
    case 'circle': return Math.PI * s.radius ** 2  // TS knows it has radius
    case 'square': return s.side ** 2              // TS knows it has side
  }
}
```

> [!IMPORTANT]
> This is much safer than one object with optional fields (`{ kind: string; radius?: number; side?: number }`), because that version wouldn't guarantee a circle actually has a radius. The labeled-union version does.

## A peek at the fancy stuff

TypeScript can also do genuinely advanced things — building types out of other types (mapped types), pattern-matching strings (template literal types), and conditional logic in types. You'll bump into these in libraries. For now, just know they exist; you can reach for the Expert version when you need them.

```ts
// template literal type — a string that must start with /api/
type Route = `/api/${string}`
const ok: Route = '/api/users'   // ✅
```

## In one sentence

Lean on built-in helpers like `Partial`, `Pick`, and `Omit` to reshape types, and use **discriminated unions** (a shared `kind` label) to model "one of several shapes" safely.

## Want to go deeper?

Switch to **Expert** mode above for conditional types, `infer`, mapped types, template literal types, and exhaustive type guards.
