---
title: Error Handling
order: 9
estMinutes: 20
difficulty: easy
checklist:
  - Use try/catch/finally correctly and explain what each block does
  - Identify the built-in Error subtypes and when each is thrown
  - Create and throw a custom Error subclass with extra context
  - Handle errors in async/await code and in Promise chains
  - Explain the difference between recoverable errors and programming mistakes
  - Decide when to throw, when to return an error value, and when to log and continue
---

Errors are inevitable — networks fail, inputs are invalid, code has bugs. A consistent error-handling strategy makes your program predictable: crashes are rare and contained, failure modes are documented, and debugging is faster.

## try / catch / finally

```ts
try {
  // Code that might throw
  const data = JSON.parse(rawInput); // throws SyntaxError on bad JSON
  process(data);
} catch (err) {
  // Runs only if something in `try` throws
  // `err` is typed `unknown` in TypeScript — always narrow it
  if (err instanceof SyntaxError) {
    console.error("Invalid JSON:", err.message);
  } else {
    throw err; // re-throw what we cannot handle
  }
} finally {
  // Always runs — use for cleanup (close connections, release locks)
  cleanup();
}
```

> [!NOTE]
> In TypeScript, the catch parameter is typed `unknown` (not `any`), so you must narrow it before accessing properties. Use `instanceof` for known error types or `typeof err === "string"` for string throws.

## Built-in Error Types

JavaScript has several built-in `Error` subtypes, each thrown by the engine in specific situations:

| Type | When thrown |
|------|------------|
| `Error` | Generic base class |
| `SyntaxError` | Invalid syntax (`JSON.parse`, `eval`) |
| `TypeError` | Wrong type — calling a non-function, accessing a property on `null` |
| `RangeError` | Value out of valid range — `new Array(-1)`, max call stack exceeded |
| `ReferenceError` | Accessing an undeclared variable or TDZ binding |
| `URIError` | Malformed URI passed to `decodeURIComponent` |
| `EvalError` | (Rare) errors related to `eval` |

## Custom Error Classes

Extend `Error` to add domain-specific context:

```ts
class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string
  ) {
    super(message);
    this.name = "ApiError"; // set name explicitly for stack traces
    // Fix prototype chain in some older transpiler targets
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, "NOT_FOUND");
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Usage
function getUser(id: number) {
  if (!db.has(id)) throw new NotFoundError(`User #${id}`);
  return db.get(id);
}

try {
  getUser(99);
} catch (err) {
  if (err instanceof NotFoundError) {
    // Handle 404
  } else if (err instanceof ApiError) {
    // Handle other API errors
  } else {
    throw err; // unexpected — re-throw
  }
}
```

> [!IMPORTANT]
> Always call `Object.setPrototypeOf(this, new.target.prototype)` in custom Error subclasses when targeting environments that transpile classes (e.g., TypeScript targeting ES5). Without it, `instanceof` checks break.

## Error Handling in Async Code

### async/await

```ts
async function fetchData(url: string): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch (err) {
    // Network failure — fetch itself threw (DNS error, connection refused)
    throw new Error(`Network error: ${String(err)}`);
  }

  if (!response.ok) {
    // HTTP error status (4xx, 5xx) — fetch does NOT throw for these
    throw new ApiError(response.statusText, response.status, "HTTP_ERROR");
  }

  return response.json();
}
```

> [!WARNING]
> `fetch` only rejects (throws) on network failures. A `404` or `500` response resolves successfully — you must check `response.ok` yourself.

### Promise chains

```ts
fetchData("/api/users")
  .then(handleData)
  .catch((err) => {
    if (err instanceof ApiError && err.status === 401) {
      redirectToLogin();
    } else {
      showErrorToast(err.message);
    }
  });
```

## Throw vs Return an Error Value

**Throw** when the error is exceptional and the caller should not silently ignore it:
- Invalid arguments that indicate a programming mistake
- Unexpected network / system failures

**Return an error value** (result pattern) when failure is a normal, expected outcome:

```ts
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function parseAge(input: string): Result<number> {
  const n = Number(input);
  if (Number.isNaN(n) || n < 0 || n > 150) {
    return { ok: false, error: new RangeError(`Invalid age: ${input}`) };
  }
  return { ok: true, value: n };
}

const result = parseAge("abc");
if (!result.ok) {
  console.error(result.error.message);
}
```

> [!TIP]
> The result pattern (popular in Rust and Go) forces callers to acknowledge the failure path. Libraries like `neverthrow` bring this pattern to TypeScript with full type support.

## Further Learning

Search these terms to go deeper:
- **"MDN: Error"** — reference for all built-in error types and properties
- **"TypeScript error handling patterns"** — articles on narrowing `unknown` errors and the result pattern
- **"neverthrow library"** — TypeScript library implementing the Result/Either pattern
- **"fetch error handling JavaScript"** — specifically covers the confusing `response.ok` vs promise rejection distinction
- **"JavaScript global error handling"** — `window.onerror`, `unhandledrejection` events for last-resort error capture
