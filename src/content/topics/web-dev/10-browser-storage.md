---
title: Browser Storage
order: 10
estMinutes: 20
difficulty: easy
checklist:
  - Explain the difference between localStorage and sessionStorage
  - Serialize and deserialize objects to/from localStorage correctly
  - Describe what cookies are and when to use them instead of Web Storage
  - Identify the security attributes that make cookies safe (httpOnly, Secure, SameSite)
  - Know the approximate size limits for each storage type
  - Decide which storage mechanism fits a given use case
---

Every web application needs to persist some data on the client — a user's preferences, a session token, a cached API response, or a shopping cart. Browsers provide several mechanisms for this, each with different capabilities, size limits, and security properties. Picking the right one matters for both correctness and security.

## localStorage vs sessionStorage

Both `localStorage` and `sessionStorage` implement the same synchronous `Storage` API and store string key-value pairs. The only difference is their lifetime:

| Property | localStorage | sessionStorage |
|----------|-------------|----------------|
| Persists across | Browser restarts | Browser tab close |
| Shared across tabs | Yes (same origin) | No — each tab is isolated |
| Size limit | ~5 MB | ~5 MB |
| Accessible from JS | Yes | Yes |
| Sent to server | Never | Never |

```ts
// localStorage — persists until explicitly cleared
localStorage.setItem('theme', 'dark')
const theme = localStorage.getItem('theme')  // 'dark' | null
localStorage.removeItem('theme')
localStorage.clear()  // removes all keys for this origin

// sessionStorage — same API, tab-scoped lifetime
sessionStorage.setItem('draft', JSON.stringify({ title: 'My Post' }))
const draft = JSON.parse(sessionStorage.getItem('draft') ?? 'null')
```

## Storing Objects with JSON

Web Storage only stores strings. Use `JSON.stringify` and `JSON.parse` for objects:

```ts
interface UserPreferences {
  theme: 'light' | 'dark'
  fontSize: number
  language: string
}

function savePreferences(prefs: UserPreferences): void {
  localStorage.setItem('prefs', JSON.stringify(prefs))
}

function loadPreferences(): UserPreferences | null {
  const raw = localStorage.getItem('prefs')
  if (!raw) return null
  try {
    return JSON.parse(raw) as UserPreferences
  } catch {
    // Handle corrupted storage gracefully
    localStorage.removeItem('prefs')
    return null
  }
}
```

> [!CAUTION]
> `JSON.parse` throws if the stored string is malformed (e.g. corrupted by an older version of your app). Always wrap it in a try/catch and handle the error — otherwise a single bad value can prevent your entire app from initializing.

## Cookies

Cookies are key-value pairs that the browser automatically attaches to every HTTP request to the matching domain. This makes them the right choice for **session tokens** and **authentication** — the server needs to see them on every request.

```http
HTTP/1.1 200 OK
Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400
```

| Attribute | Effect |
|-----------|--------|
| `HttpOnly` | JavaScript cannot access `document.cookie` — protects against XSS token theft |
| `Secure` | Cookie is only sent over HTTPS — never over plain HTTP |
| `SameSite=Lax` | Cookie is not sent on cross-site requests (form POSTs are still allowed) |
| `SameSite=Strict` | Cookie is never sent on cross-site requests — maximum CSRF protection |
| `Max-Age` / `Expires` | How long the cookie lives; session cookie if omitted |

> [!IMPORTANT]
> Authentication tokens belong in `HttpOnly` cookies, not `localStorage`. A `HttpOnly` cookie cannot be read by JavaScript at all — so even if your site has an XSS vulnerability, the attacker cannot steal the token. `localStorage` offers no such protection.

## IndexedDB

IndexedDB is a full transactional database built into the browser. It is asynchronous, stores structured data (not just strings), and supports indexes for fast queries.

| Property | IndexedDB |
|----------|-----------|
| Size limit | 50–2000 MB (varies by browser) |
| Data types | Objects, blobs, files — not just strings |
| API style | Asynchronous (Promise-based with wrappers) |
| Best for | Offline-capable apps, large datasets, binary data |

The raw IndexedDB API is verbose; most developers use a wrapper library like **idb** or **Dexie.js**.

## When to Use What

| Use case | Recommended storage |
|----------|-------------------|
| Auth/session token | `HttpOnly` cookie |
| User preferences (theme, language) | `localStorage` |
| Draft form data (lost on tab close is OK) | `sessionStorage` |
| Cached API responses (large) | IndexedDB |
| Offline app data | IndexedDB |
| CSRF token | Cookie or JS variable |

> [!NOTE]
> All browser storage is **origin-scoped** — data stored on `https://app.example.com` is completely isolated from `https://other.example.com` and even from `http://app.example.com` (different scheme). This is enforced by the browser's same-origin policy.

## Further Learning

Search these terms to go deeper:
- **"Web Storage API MDN"** — complete reference for localStorage and sessionStorage
- **"HTTP cookie security attributes"** — in-depth coverage of SameSite, HttpOnly, and Secure attributes
- **"Dexie.js IndexedDB wrapper"** — the most popular library for using IndexedDB with a clean Promise API
- **"CSRF cross-site request forgery"** — why SameSite cookies prevent CSRF attacks
- **"Storage quota estimation browser"** — the `navigator.storage.estimate()` API for checking how much space you have
