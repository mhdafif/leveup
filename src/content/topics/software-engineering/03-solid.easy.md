---
title: SOLID Principles
order: 3
estMinutes: 15
difficulty: easy
checklist:
  - Explain each of the five SOLID principles in plain language
  - Identify SRP violations and split a class that does too much
  - Apply OCP using extension points instead of modifying existing code
  - Distinguish a proper subtype (LSP-compliant) from one that breaks assumptions
  - Apply DIP by depending on abstractions and injecting concrete implementations
---

**SOLID** is five guidelines for organizing code so it's easier to change without breaking things. Don't memorize them as rules — think of them as five nudges toward code that's easy to understand and modify. Here they are in plain English.

## S — Single Responsibility

**Each piece of code should have one job.** If a function both calculates prices *and* formats emails, a change to either forces you to touch it. Split them so each has a single reason to change.

## O — Open/Closed

**Add new behavior without editing old, working code.** Instead of a giant `if/else` you keep editing every time there's a new case:

```ts
// ❌ must edit this function for every new discount
if (user.type === 'premium') return 0.2
if (user.type === 'student') return 0.1

// ✅ add a new rule as a new item — old code untouched
const rules = [premiumDiscount, studentDiscount]
```

Adding a "senior" discount becomes *adding* something, not *changing* tested code.

## L — Liskov Substitution

**A subtype should work anywhere its parent type works, without surprises.** If code expects a `Bird` and you hand it a `Penguin` that throws when asked to `fly()`, you've broken this. In short: don't create "child" types that violate what people expect of the "parent."

## I — Interface Segregation

**Don't force code to depend on things it doesn't use.** If a read-only report is forced to implement `write()` and `delete()` methods it can't support (leaving them throwing errors), the interface is too big. Split it into smaller, focused ones.

## D — Dependency Inversion

**Depend on a general idea, not a specific thing.** Instead of a service hard-wiring itself to "MySQL," have it depend on a generic "storage" idea and get the specific one handed to it:

```ts
// ❌ locked to MySQL — hard to test or swap
class OrderService {
  repo = new MySQLOrderRepository()
}

// ✅ accepts any storage — easy to test with a fake one
class OrderService {
  constructor(repo) { this.repo = repo }
}
```

> [!TIP]
> This last one is what makes testing easy — you can hand your code a fake database in tests instead of hitting a real one.

## A caution

> [!IMPORTANT]
> SOLID is a set of *guidelines*, not laws. Applied thoughtfully, they make code flexible. Applied dogmatically, they create a maze of needless abstractions. Reach for them when code is getting hard to change — not on day one.

## In one sentence

SOLID is five nudges toward changeable code: one job per piece (S), extend instead of edit (O), subtypes shouldn't surprise you (L), keep interfaces small (I), and depend on general ideas you can swap out (D).

## Want to go deeper?

Switch to **Expert** mode above for full code examples of each principle, the Rectangle/Square LSP case, and how DIP powers dependency injection.
