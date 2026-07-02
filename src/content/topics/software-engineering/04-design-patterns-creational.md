---
title: Creational Patterns
order: 4
estMinutes: 30
difficulty: medium
checklist:
  - Explain the problem each creational pattern solves
  - Implement a Factory Method that returns different subtypes based on input
  - Use the Builder pattern to construct a complex object step by step
  - Implement a thread-safe Singleton and explain why it is often an antipattern
  - Choose between Factory Method and Abstract Factory for a given scenario
---

Creational patterns abstract the instantiation process — they decouple the code that *uses* an object from the code that *creates* it. The "Gang of Four" (Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides) catalogued these patterns in *Design Patterns: Elements of Reusable Object-Oriented Software* (1994), the foundational text on the subject. In TypeScript, factory functions and builder objects appear constantly; Singleton is ubiquitous but often misused.

## Factory Method

**Problem:** you want to create objects, but you don't know at compile time which concrete class to instantiate — or you want subclasses to decide.

**Solution:** define a `create()` method in a base class or interface and let subclasses (or callers) provide the concrete implementation.

```ts
interface Notifier {
  send(message: string): Promise<void>;
}

class EmailNotifier implements Notifier {
  async send(message: string) { /* send email */ }
}

class SlackNotifier implements Notifier {
  async send(message: string) { /* post to Slack */ }
}

// Factory Method: the "which one?" decision is isolated here
function createNotifier(channel: "email" | "slack"): Notifier {
  switch (channel) {
    case "email": return new EmailNotifier();
    case "slack": return new SlackNotifier();
  }
}

// Callers depend only on the Notifier interface
const notifier = createNotifier(config.channel);
await notifier.send("Deployment succeeded");
```

**Use when** you need to defer the choice of concrete class to runtime configuration, a command-line flag, or a feature flag.

## Abstract Factory

**Problem:** you need to create *families* of related objects that must be used together, without specifying their concrete classes.

**Solution:** define a factory interface with a method for each product in the family. Each concrete factory produces a consistent set.

```ts
interface Button { render(): string; }
interface TextInput { render(): string; }

interface UIFactory {
  createButton(): Button;
  createTextInput(): TextInput;
}

class MaterialUIFactory implements UIFactory {
  createButton() { return { render: () => "<MuiButton />" }; }
  createTextInput() { return { render: () => "<MuiTextField />" }; }
}

class TailwindUIFactory implements UIFactory {
  createButton() { return { render: () => '<button class="btn">' }; }
  createTextInput() { return { render: () => '<input class="input">' }; }
}

function renderForm(factory: UIFactory) {
  const btn = factory.createButton();
  const input = factory.createTextInput();
  return `${input.render()} ${btn.render()}`;
}
```

**Versus Factory Method:** Factory Method produces one product; Abstract Factory produces a *family* of related products that must be consistent with each other.

## Builder

**Problem:** constructing a complex object requires many steps or configurations, and telescoping constructors (`new Foo(a, b, c, d, e, f)`) become unreadable.

**Solution:** separate object construction from its representation using a builder that accumulates configuration through a fluent interface.

```ts
class QueryBuilder {
  private table = "";
  private conditions: string[] = [];
  private columns: string[] = ["*"];
  private limitValue?: number;

  from(table: string): this { this.table = table; return this; }
  select(...cols: string[]): this { this.columns = cols; return this; }
  where(condition: string): this { this.conditions.push(condition); return this; }
  limit(n: number): this { this.limitValue = n; return this; }

  build(): string {
    let sql = `SELECT ${this.columns.join(", ")} FROM ${this.table}`;
    if (this.conditions.length) sql += ` WHERE ${this.conditions.join(" AND ")}`;
    if (this.limitValue) sql += ` LIMIT ${this.limitValue}`;
    return sql;
  }
}

const query = new QueryBuilder()
  .from("users")
  .select("id", "email")
  .where("is_active = true")
  .where("created_at > '2024-01-01'")
  .limit(50)
  .build();
// SELECT id, email FROM users WHERE is_active = true AND created_at > '2024-01-01' LIMIT 50
```

Builder is common in test fixtures, SQL query constructors, HTTP request builders, and configuration objects.

## Singleton

**Problem:** a class should have exactly one instance, accessible globally (e.g. a database connection pool, a config registry).

**Solution:** make the constructor private and expose a static `getInstance()` method.

```ts
class DatabasePool {
  private static instance: DatabasePool;
  private pool: Connection[];

  private constructor() {
    this.pool = createConnections();
  }

  static getInstance(): DatabasePool {
    if (!DatabasePool.instance) {
      DatabasePool.instance = new DatabasePool();
    }
    return DatabasePool.instance;
  }

  query(sql: string) { /* ... */ }
}

// Usage
const pool = DatabasePool.getInstance();
```

> [!CAUTION]
> **Singleton is frequently an antipattern.** It introduces hidden global state, makes unit testing nearly impossible (you cannot inject a mock), and creates tight coupling between all callers. Before reaching for Singleton, ask whether dependency injection — passing a single shared instance through constructors — solves the same problem without the drawbacks. In Node.js, ES module caching often makes Singleton redundant: a module-level object is naturally a singleton within a process.

## Further Learning

Search these terms to go deeper:
- **"Design Patterns Gang of Four creational"** — the original catalogue; chapters 3.1–3.5
- **"Builder pattern fluent interface TypeScript"** — practical examples including test data builders
- **"Singleton antipattern dependency injection"** — why DI containers have mostly replaced Singletons
- **"Abstract Factory vs Factory Method difference"** — StackOverflow and Refactoring.Guru comparisons
- **"Refactoring.Guru design patterns"** — high-quality free online reference with interactive diagrams
