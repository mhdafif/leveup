---
title: Structural Patterns
order: 5
estMinutes: 30
difficulty: medium
checklist:
  - Apply the Adapter pattern to integrate an incompatible third-party API
  - Use the Decorator pattern to add behaviour without modifying the original class
  - Identify when a Facade simplifies a complex subsystem
  - Explain what a Proxy adds over a direct reference and give two use cases
  - Recognise these patterns in frontend codebases (HOCs, service layers, lazy loading)
---

Structural patterns describe how classes and objects are composed to form larger structures. They are concerned with *relationships* — how to connect interfaces that were not designed to work together, how to add behaviour without inheritance, how to simplify complex subsystems. The Gang of Four documented these in *Design Patterns* (1994). In frontend work, structural patterns appear constantly: API adapters normalise inconsistent data shapes, decorators extend React components, and facades hide the complexity of third-party SDKs.

## Adapter

**Problem:** you have an existing interface that a client expects, but a third-party library or legacy system provides a different, incompatible interface.

**Solution:** write an Adapter class that wraps the incompatible class and translates its interface to the one the client expects.

```ts
// What our app expects
interface UserRepository {
  findById(id: string): Promise<{ id: string; name: string; email: string }>;
}

// What the legacy API actually returns
interface LegacyUserAPI {
  getUser(userId: number): Promise<{ user_id: number; full_name: string; email_address: string }>;
}

// Adapter: translates between the two
class LegacyUserAdapter implements UserRepository {
  constructor(private legacy: LegacyUserAPI) {}

  async findById(id: string) {
    const raw = await this.legacy.getUser(Number(id));
    return {
      id: String(raw.user_id),
      name: raw.full_name,
      email: raw.email_address,
    };
  }
}

// The rest of the app only knows UserRepository — legacy details are isolated
const repo: UserRepository = new LegacyUserAdapter(legacyAPI);
```

**Frontend use:** normalising REST or GraphQL responses at the data layer so UI components always receive a consistent shape, regardless of which backend endpoint is called.

## Decorator

**Problem:** you want to add behaviour to an object dynamically, without modifying its class or creating a deep inheritance hierarchy.

**Solution:** wrap the object in a Decorator that implements the same interface, delegates to the wrapped object, and adds behaviour before or after.

```ts
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string) { console.log(message); }
}

// Decorator: adds timestamps without changing ConsoleLogger
class TimestampLogger implements Logger {
  constructor(private inner: Logger) {}
  log(message: string) {
    this.inner.log(`[${new Date().toISOString()}] ${message}`);
  }
}

// Decorator: adds log level prefix
class LevelLogger implements Logger {
  constructor(private inner: Logger, private level: string) {}
  log(message: string) {
    this.inner.log(`${this.level.toUpperCase()}: ${message}`);
  }
}

// Decorators compose: timestamp → level → console
const logger = new TimestampLogger(new LevelLogger(new ConsoleLogger(), "info"));
logger.log("Server started"); // [2025-01-01T00:00:00Z] INFO: Server started
```

> [!NOTE]
> React Higher-Order Components (HOCs) like `withAuth(Component)` or `withErrorBoundary(Component)` are the Decorator pattern applied to React components — they wrap a component with new behaviour without touching the original.

## Facade

**Problem:** a subsystem (payment processing, video transcoding, analytics SDK) has a complex interface with many classes and configuration steps. Callers should not need to understand all of that.

**Solution:** provide a Facade — a single, simplified class that covers the common use cases of the subsystem.

```ts
// Complex subsystem (simplified)
class StripeClient { /* many methods */ }
class WebhookVerifier { /* many methods */ }
class InvoiceGenerator { /* many methods */ }

// Facade: exposes only what the app needs
class PaymentService {
  private stripe = new StripeClient(process.env.STRIPE_KEY!);
  private webhook = new WebhookVerifier(process.env.STRIPE_WEBHOOK_SECRET!);
  private invoices = new InvoiceGenerator();

  async chargeCustomer(customerId: string, amountCents: number) {
    const intent = await this.stripe.createPaymentIntent({ amount: amountCents, currency: "usd" });
    return { clientSecret: intent.client_secret };
  }

  async handleWebhook(body: string, signature: string) {
    const event = this.webhook.constructEvent(body, signature);
    if (event.type === "payment_intent.succeeded") {
      await this.invoices.generate(event.data.object);
    }
  }
}
```

A Facade does not prevent access to the subsystem — callers who need fine-grained control can still use it directly. The Facade is a *convenience*, not a restriction.

## Proxy

**Problem:** you want to control access to an object — to add lazy initialisation, access control, logging, caching, or remote communication — without changing the object's interface.

**Solution:** a Proxy implements the same interface as the real object, intercepts calls, and optionally delegates to the real object.

```ts
interface ImageLoader {
  display(): void;
}

class RealImage implements ImageLoader {
  constructor(private filename: string) {
    console.log(`Loading ${filename} from disk...`); // Expensive
  }
  display() { console.log(`Displaying ${this.filename}`); }
}

// Virtual proxy: defers expensive loading until display() is actually called
class LazyImageProxy implements ImageLoader {
  private real?: RealImage;
  constructor(private filename: string) {} // Does NOT load yet

  display() {
    if (!this.real) this.real = new RealImage(this.filename);
    this.real.display();
  }
}

const img = new LazyImageProxy("hero.png"); // No disk I/O yet
img.display(); // Loads now, then displays
```

> [!TIP]
> JavaScript's built-in `Proxy` object (ES2015) is the language-level implementation of this pattern. It intercepts property access, assignment, function calls, and more — used by Vue 3's reactivity system, Immer, and many mocking libraries.

Other Proxy use cases: **caching proxy** (memoises repeated calls), **protection proxy** (checks permissions before delegating), **remote proxy** (makes network calls look like local method calls — the foundation of RPC).

## Further Learning

Search these terms to go deeper:
- **"Design Patterns GoF structural chapter"** — the original coverage of Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy
- **"React Higher-Order Components pattern"** — Decorator pattern applied to React components
- **"JavaScript Proxy MDN"** — the native language Proxy with practical examples for validation and reactive state
- **"Adapter pattern API integration frontend"** — real-world usage normalising REST/GraphQL responses
- **"Facade pattern SDK wrapper"** — how SDK wrappers are designed using the Facade pattern
