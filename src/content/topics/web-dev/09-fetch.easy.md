---
title: Fetch API & Async/Await
order: 9
estMinutes: 18
difficulty: easy
checklist:
  - Use fetch() to make a GET request and read the JSON response
  - Convert a Promise chain to async/await syntax
  - Handle network errors and non-2xx status codes correctly
  - Send a POST request with a JSON body and correct Content-Type header
  - Explain what CORS is and why it blocks cross-origin requests
  - Abort a fetch request with AbortController
---

Most apps need to talk to a server — to load a list of users, save a form, or check the weather. **`fetch`** is the browser's built-in way to ask a server for data. And because that request takes time (the server is somewhere far away), we use **`async/await`** to wait for the answer without freezing the page.

## Asking for data

```ts
async function getUsers() {
  const response = await fetch('https://api.example.com/users')
  const data = await response.json()  // turn the reply into usable data
  console.log(data)
}
```

`await` means "pause here until the answer comes back, then continue." The `async` keyword on the function is what lets you use `await` inside it.

## The trap everyone falls into

`fetch` does **not** treat a "404 Not Found" or "500 Server Error" as a failure. It only throws if the network itself fails (no internet). So you have to check yourself:

```ts
const res = await fetch('/api/user/999')

if (!res.ok) {  // .ok is true only for success codes (200–299)
  throw new Error(`Something went wrong: ${res.status}`)
}
const data = await res.json()
```

> [!IMPORTANT]
> Always check `res.ok`. Otherwise a "404" sails through as if it worked, and you end up trying to read data that isn't there.

## Sending data (POST)

To *send* something (like a signup form), add a few options:

```ts
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }, // "I'm sending JSON"
  body: JSON.stringify({ name: 'Alice', email: 'alice@example.com' }),
})
```

`JSON.stringify` turns your JavaScript object into text the server can read, and the `Content-Type` header tells the server what kind of text it is.

## Why "CORS" sometimes blocks you

If your page tries to fetch from a *different* website, the browser steps in and asks that other server, "Do you allow this?" If the server doesn't reply with the right permission headers, the browser blocks the response. That's **CORS**.

> [!NOTE]
> A CORS error doesn't mean the server rejected you — the server often replied fine, but the *browser* hid the answer for safety. That's why the same request can work in a tool like `curl` but fail in the browser. The fix lives on the server (it must send the right permission headers).

## Cancelling a request

Sometimes you start a request and no longer need the answer (the user typed something new). You can cancel it:

```ts
const controller = new AbortController()
fetch('/api/search?q=cats', { signal: controller.signal })
controller.abort()  // never mind, cancel it
```

## In one sentence

`fetch` asks a server for data, `await` waits for the reply, and you must check `res.ok` yourself because `fetch` treats 404s and 500s as "successful" responses.

## Want to go deeper?

Switch to **Expert** mode above for full error handling, auth headers, `AbortController` with timeouts, and a real GitHub API example.
