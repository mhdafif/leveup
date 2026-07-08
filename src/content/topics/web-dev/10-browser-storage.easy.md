---
title: Browser Storage
order: 10
estMinutes: 12
difficulty: easy
checklist:
  - Explain the difference between localStorage and sessionStorage
  - Serialize and deserialize objects to/from localStorage correctly
  - Describe what cookies are and when to use them instead of Web Storage
  - Identify the security attributes that make cookies safe (httpOnly, Secure, SameSite)
  - Know the approximate size limits for each storage type
  - Decide which storage mechanism fits a given use case
---

Sometimes you want the browser to *remember* something — a dark-mode preference, an unfinished form, a login. The browser gives you a few little storage boxes for exactly this. The trick is knowing which box to use.

## localStorage vs sessionStorage

Both work the same way (save a key and a value), but they forget at different times:

- **`localStorage`** — remembers forever (until you clear it), even after closing the browser. Great for preferences.
- **`sessionStorage`** — forgets the moment you close the tab. Great for temporary stuff like a form draft.

```ts
localStorage.setItem('theme', 'dark')       // save
const theme = localStorage.getItem('theme') // read → 'dark'
localStorage.removeItem('theme')            // delete
```

Both hold about 5 MB and are only readable by *your* site.

## Storing objects (they only hold text)

These boxes can only store text, not objects. So you convert your object to text on the way in and back on the way out:

```ts
// Save an object
localStorage.setItem('prefs', JSON.stringify({ theme: 'dark', fontSize: 16 }))

// Read it back
const prefs = JSON.parse(localStorage.getItem('prefs'))
```

> [!CAUTION]
> `JSON.parse` crashes if the saved text is somehow broken. Wrap it in a `try/catch` so one bad value can't break your whole app.

## Cookies (for logins)

A **cookie** is a small piece of data the browser automatically sends to the server on every request. That's what makes it right for logins — the server needs to see "who are you?" each time.

Cookies have safety switches you should know:

| Switch | What it does |
|-----------|--------|
| `HttpOnly` | JavaScript can't read it — protects your login token from theft |
| `Secure` | Only sent over HTTPS (encrypted) |
| `SameSite` | Not sent to other sites — blocks a class of attacks |

> [!IMPORTANT]
> Login tokens belong in an `HttpOnly` cookie, **not** in `localStorage`. Because JavaScript can't read an `HttpOnly` cookie at all, an attacker who sneaks code onto your page still can't steal the token. `localStorage` gives no such protection.

## Which box do I use?

| I want to store... | Use |
|----------|-------------------|
| A login/session token | `HttpOnly` cookie |
| Theme, language, preferences | `localStorage` |
| A form draft (ok to lose on tab close) | `sessionStorage` |
| Lots of data / offline data | IndexedDB (a bigger, database-like box) |

## In one sentence

Use `localStorage` for preferences that should stick around, `sessionStorage` for temporary tab-only data, and `HttpOnly` cookies for login tokens — and remember these boxes only hold text, so `JSON.stringify` your objects.

## Want to go deeper?

Switch to **Expert** mode above for the full cookie attribute list, IndexedDB, and the same-origin rules.
