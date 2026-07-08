---
title: Structural Patterns
order: 5
estMinutes: 15
difficulty: easy
checklist:
  - Apply the Adapter pattern to integrate an incompatible third-party API
  - Use the Decorator pattern to add behaviour without modifying the original class
  - Identify when a Facade simplifies a complex subsystem
  - Explain what a Proxy adds over a direct reference and give two use cases
  - Recognise these patterns in frontend codebases (HOCs, service layers, lazy loading)
---

**Structural** patterns are about how you *connect* pieces of code — fitting mismatched parts together, adding behavior cleanly, or hiding complexity. You've almost certainly used these without knowing their names.

## Adapter: a translator between mismatched shapes

When some outside code gives you data in the wrong shape, an **adapter** sits in the middle and translates it into what your app expects:

```ts
// The old API returns { user_id, full_name }, but your app wants { id, name }
class LegacyUserAdapter {
  async findById(id) {
    const raw = await legacyApi.getUser(Number(id))
    return { id: String(raw.user_id), name: raw.full_name }
  }
}
```

Now the rest of your app deals with one clean shape, and all the messy translation lives in one spot. (Frontend devs do this constantly to normalize API responses.)

## Decorator: wrap something to add behavior

A **decorator** wraps an object to add features *without* changing the original:

```ts
// Add a timestamp to any logger, without editing the logger itself
const logger = new TimestampLogger(new ConsoleLogger())
logger.log('Started')  // [2025-01-01...] Started
```

> [!NOTE]
> React's Higher-Order Components (like `withAuth(Component)`) are this exact pattern — they wrap a component to add behavior without touching it.

## Facade: a simple front door to something complicated

A **facade** is one friendly interface that hides a messy, multi-step subsystem behind it:

```ts
// Instead of juggling Stripe's many classes, expose one simple method
class PaymentService {
  async chargeCustomer(customerId, amount) { /* ...handles all the Stripe steps... */ }
}
```

Callers just call `chargeCustomer()` and don't need to learn the whole payment SDK.

## Proxy: a stand-in that controls access

A **proxy** looks like the real object but sits in front of it to add something — like loading it only when needed (lazy loading), caching results, or checking permissions first.

> [!TIP]
> JavaScript even has a built-in `Proxy` object. Vue's reactivity system uses it to notice when your data changes.

## In one sentence

Structural patterns connect code: an **Adapter** translates mismatched shapes, a **Decorator** wraps to add behavior, a **Facade** hides a complex subsystem behind one simple interface, and a **Proxy** stands in front to control access.

## Want to go deeper?

Switch to **Expert** mode above for full code examples of each and how they show up in real frontend and backend systems.
