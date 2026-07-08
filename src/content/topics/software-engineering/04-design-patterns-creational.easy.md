---
title: Creational Patterns
order: 4
estMinutes: 15
difficulty: easy
checklist:
  - Explain the problem each creational pattern solves
  - Implement a Factory Method that returns different subtypes based on input
  - Use the Builder pattern to construct a complex object step by step
  - Implement a thread-safe Singleton and explain why it is often an antipattern
  - Choose between Factory Method and Abstract Factory for a given scenario
---

**Design patterns** are named, proven solutions to problems that come up again and again. **Creational** patterns are specifically about *how you make objects*. Learning them mostly helps you recognize and name things you'll see in real code.

## Factory: one place to decide *which* thing to build

When you need to create one of several similar things based on some input, put that decision in a single "factory" function instead of scattering `if` checks everywhere:

```ts
function createNotifier(channel) {
  if (channel === 'email') return new EmailNotifier()
  if (channel === 'slack') return new SlackNotifier()
}

const notifier = createNotifier(config.channel)
notifier.send('Deploy succeeded')
```

Now the rest of your code doesn't care *which* notifier it got — it just calls `.send()`. Swapping or adding types only touches the factory.

## Builder: assemble something complex step by step

When an object needs lots of settings, a long constructor like `new Thing(a, b, c, d, e)` is unreadable. A **builder** lets you set things by name, one call at a time:

```ts
const query = new QueryBuilder()
  .from('users')
  .select('id', 'email')
  .where('is_active = true')
  .limit(50)
  .build()
```

Each method returns the builder, so you can chain them. Much clearer than a pile of positional arguments.

## Singleton: exactly one shared instance

Sometimes you want just *one* of something app-wide — like a single database connection. A **singleton** ensures everyone shares the same instance.

> [!CAUTION]
> Singletons are often overused. They create hidden global state and make testing hard (you can't easily swap in a fake). Before reaching for one, consider just *passing* a shared instance where it's needed. In Node.js, a plain exported object from a module is already effectively a singleton — you rarely need the formal pattern.

## In one sentence

Creational patterns handle *making* objects: a **Factory** centralizes the "which type?" decision, a **Builder** assembles complex objects step-by-step and readably, and a **Singleton** shares one instance (but is easy to overuse).

## Want to go deeper?

Switch to **Expert** mode above for Abstract Factory (families of objects), full Builder/Singleton code, and the Gang of Four background.
