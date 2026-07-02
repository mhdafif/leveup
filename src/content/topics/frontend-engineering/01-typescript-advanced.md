---
title: Advanced TypeScript
order: 1
estMinutes: 40
difficulty: hard
checklist:
  - Understand conditional types and the infer keyword
  - Write mapped types to transform existing types
  - Use template literal types to model string patterns
  - Apply utility types (Partial, Required, Pick, Omit, ReturnType) correctly
  - Build discriminated unions with exhaustive type guards
---

TypeScript's type system is Turing-complete, which means it can express arbitrarily complex constraints. Knowing the advanced features lets you encode domain rules directly into types, so incorrect usage becomes a compile error rather than a runtime bug.

## Conditional Types and `infer`

A conditional type chooses between two types based on whether a constraint holds:

```ts
type IsArray<T> = T extends any[] ? true : false;
type A = IsArray<string[]>; // true
type B = IsArray<number>;   // false
```

The `infer` keyword extracts a type from within a condition, letting you "reach inside" a structure:

```ts
type ElementOf<T> = T extends (infer U)[] ? U : never;
type Num = ElementOf<number[]>; // number

type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
```

> [!NOTE]
> `infer` can only appear in the `extends` clause of a conditional type — it captures the matched type rather than asserting it.

## Mapped Types

Mapped types iterate over a union of keys to produce a new type:

```ts
type Readonly<T> = { readonly [K in keyof T]: T[K] };
type Optional<T> = { [K in keyof T]?: T[K] };

// Key remapping with `as`
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
```

You can filter keys using conditional types inside a mapped type:

```ts
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};
```

## Template Literal Types

Template literal types compose string types the same way template literals compose strings:

```ts
type EventName = "click" | "focus" | "blur";
type Handler = `on${Capitalize<EventName>}`; // "onClick" | "onFocus" | "onBlur"

type Route = `/api/${string}`;
const endpoint: Route = "/api/users"; // OK
```

> [!TIP]
> Template literal types work well with `Extract` and `Exclude` to narrow string unions at the type level rather than at runtime.

## Utility Types

TypeScript ships with built-in generic utility types for common transformations:

```ts
type User = { id: number; name: string; email: string };

type PartialUser = Partial<User>;        // all optional
type RequiredUser = Required<PartialUser>; // all required again
type UserPreview = Pick<User, "id" | "name">;
type UserWithoutEmail = Omit<User, "email">;

function getUser(): User { ... }
type GetUserReturn = ReturnType<typeof getUser>; // User
```

## Discriminated Unions and Type Guards

A discriminated union is a union where every member shares a literal property that uniquely identifies it. TypeScript narrows the union when you check that property:

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "rect"; width: number; height: number };

function area(s: Shape): number {
  switch (s.kind) {
    case "circle": return Math.PI * s.radius ** 2;
    case "square": return s.side ** 2;
    case "rect":   return s.width * s.height;
    default:
      // Exhaustiveness check — compile error if a case is missing
      const _never: never = s;
      throw new Error("Unhandled shape");
  }
}
```

> [!WARNING]
> Without the `never` exhaustiveness check, adding a new union member silently falls through to `default` instead of producing a type error.

A user-defined type guard narrows the type in the caller's scope using the `is` return type:

```ts
function isCircle(s: Shape): s is { kind: "circle"; radius: number } {
  return s.kind === "circle";
}
```

> [!IMPORTANT]
> Prefer discriminated unions over optional properties — `{ kind: "circle"; radius: number } | { kind: "square"; side: number }` is safer than `{ kind: string; radius?: number; side?: number }` because the latter doesn't enforce that `radius` exists when `kind` is `"circle"`.

## Further Learning

Search these terms to go deeper:
- **"TypeScript handbook conditional types"** — the official deep-dive with distributive behavior and deferred evaluation
- **"type-challenges GitHub"** — community repo of progressively harder type puzzles to build fluency
- **"TypeScript mapped types key remapping"** — how `as` clauses enable key filtering and renaming
- **"Matt Pocock Total TypeScript"** — premium course and free tips covering all advanced patterns
- **"TypeScript discriminated unions exhaustive check"** — patterns for safe variant modeling in real applications
