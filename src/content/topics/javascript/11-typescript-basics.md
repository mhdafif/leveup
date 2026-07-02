---
title: TypeScript Basics
order: 11
estMinutes: 30
difficulty: medium
checklist:
  - Add type annotations to variables, function parameters, and return types
  - Explain the difference between interface and type alias and when to prefer each
  - Write a generic function and explain what the type parameter does
  - Use union types and type narrowing to handle multiple possible types
  - Apply optional chaining (?.) and nullish coalescing (??) to handle null/undefined safely
  - Configure tsconfig.json with the most important compiler options
---

TypeScript is a statically typed superset of JavaScript that compiles to plain JavaScript. It catches type errors at compile time, improves IDE autocompletion, and makes large codebases dramatically easier to refactor. Every valid JavaScript file is valid TypeScript — you can adopt it incrementally.

## Why TypeScript

```ts
// JavaScript: this fails silently at runtime if user is null
function getDisplayName(user) {
  return user.name.toUpperCase(); // TypeError: Cannot read property 'name'
}

// TypeScript: the error is caught before you run a single line
function getDisplayName(user: { name: string }): string {
  return user.name.toUpperCase(); // ✓ type-checked
}

getDisplayName(null); // TS error: Argument of type 'null' is not assignable
```

## Type Annotations

```ts
// Primitives
let count: number = 0;
let message: string = "hello";
let active: boolean = true;

// Arrays
let tags: string[] = ["ts", "js"];
let nums: Array<number> = [1, 2, 3];

// Tuples — fixed-length arrays with known types at each position
let point: [number, number] = [10, 20];

// Functions
function add(a: number, b: number): number {
  return a + b;
}

const greet = (name: string): string => `Hello, ${name}`;

// When you do not want to return anything
function log(msg: string): void {
  console.log(msg);
}
```

> [!NOTE]
> TypeScript infers types from assignments and return statements. You do not need to annotate everything — add annotations at public API boundaries (exported functions, class members) and let inference handle the rest.

## Interface vs Type Alias

Both describe the shape of an object. They overlap significantly, but have distinct strengths:

```ts
// Interface — extendable, supports declaration merging
interface User {
  id: number;
  name: string;
  email?: string; // optional property
}

interface AdminUser extends User {
  permissions: string[];
}

// Type alias — more flexible; can represent unions, intersections, primitives
type ID = number | string;

type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: Error };

type AdminUser2 = User & { permissions: string[] }; // intersection
```

**Rule of thumb**: use `interface` for object shapes (especially public API types that consumers may extend); use `type` for unions, intersections, and aliases of primitives.

## Generics

Generics let you write reusable code that works with multiple types while preserving type safety:

```ts
// Without generics — loses type information
function identity(value: any): any {
  return value;
}

// With generics — T is inferred from the argument
function identity<T>(value: T): T {
  return value;
}

identity("hello"); // T = string, returns string
identity(42);      // T = number, returns number

// Generic with constraint — T must have a `length` property
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

longest("hello", "hi");   // "hello"
longest([1, 2, 3], [1]);  // [1, 2, 3]
```

## Union Types and Type Narrowing

A **union type** (`A | B`) means "this value is either A or B". TypeScript tracks which type is active through **narrowing**:

```ts
type StringOrNumber = string | number;

function double(value: StringOrNumber): StringOrNumber {
  if (typeof value === "string") {
    // Narrowed to string here
    return value.repeat(2);
  }
  // Narrowed to number here
  return value * 2;
}

// Discriminated unions — a common pattern
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "square": return shape.side ** 2;
  }
}
```

> [!TIP]
> TypeScript will tell you if you forgot a case in a switch — add a `default: const _exhaustive: never = shape` at the end to get a compile error whenever you add a new variant without handling it.

## Optional Chaining and Nullish Coalescing

These two operators handle `null` and `undefined` without verbose null checks:

```ts
interface Post {
  author?: {
    name: string;
    address?: { city: string };
  };
}

// Optional chaining (?.) — short-circuits to undefined if any link is null/undefined
function getCity(post: Post): string | undefined {
  return post.author?.address?.city;
}

// Nullish coalescing (??) — falls back only when the left side is null or undefined
// (unlike ||, it does NOT fall back on 0 or "")
const city = getCity(post) ?? "Unknown";

// Optional method call
const result = obj.method?.(); // only calls if method exists
```

> [!WARNING]
> `??` and `||` look similar but differ: `0 || 5` → `5`, but `0 ?? 5` → `0`. Use `??` when `0`, `""`, or `false` are valid values you want to keep.

## Essential tsconfig Options

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",       // JavaScript version to compile to
    "module": "ESNext",       // Module system (ESNext for bundlers, CommonJS for Node)
    "moduleResolution": "bundler", // How to resolve imports
    "strict": true,           // Enables all strict checks — always turn this on
    "noUncheckedIndexedAccess": true, // arr[0] is T | undefined, not T
    "exactOptionalPropertyTypes": true, // Distinguishes undefined from missing
    "outDir": "./dist",       // Where to emit compiled .js files
    "rootDir": "./src",       // Where source .ts files live
    "lib": ["ES2022", "DOM"], // Type definitions to include
    "skipLibCheck": true      // Skip type checking of .d.ts files in node_modules
  }
}
```

> [!IMPORTANT]
> Always enable `strict: true`. It bundles `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, and more. Projects without it lose most of TypeScript's safety guarantees.

## Further Learning

Search these terms to go deeper:
- **"TypeScript Handbook"** on typescriptlang.org — the official and very thorough reference
- **"Total TypeScript" by Matt Pocock** — modern, practical TypeScript courses and free tips
- **"TypeScript generics explained"** — many good articles; Matt Pocock's free tutorials are excellent
- **"TypeScript discriminated unions"** — pattern for exhaustive type narrowing
- **"tsconfig cheat sheet"** — Matt Pocock's concise reference for which options to set and why
