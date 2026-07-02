---
title: Fetch API & Async/Await
order: 9
estMinutes: 30
difficulty: medium
checklist:
  - Use fetch() to make a GET request and read the JSON response
  - Convert a Promise chain to async/await syntax
  - Handle network errors and non-2xx status codes correctly
  - Send a POST request with a JSON body and correct Content-Type header
  - Explain what CORS is and why it blocks cross-origin requests
  - Abort a fetch request with AbortController
---

Modern web applications rarely live in isolation — they fetch data from APIs, send form submissions, and stream responses from servers. The Fetch API is the browser's built-in way to make HTTP requests from JavaScript. Combined with `async/await`, it reads almost like synchronous code while remaining fully non-blocking.

## Basic GET Request

```ts
// Promise chain style
fetch('https://api.example.com/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Failed:', error))

// async/await style — functionally identical, much more readable
async function getUsers() {
  const response = await fetch('https://api.example.com/users')
  const data = await response.json()
  console.log(data)
}
```

## Why fetch() Doesn't Throw on HTTP Errors

This is the most common mistake when learning the Fetch API:

```ts
// ❌ This only catches network failures (no internet, DNS error)
// A 404 or 500 response does NOT throw — fetch() resolves successfully
async function badFetch() {
  try {
    const res = await fetch('/api/user/999')
    const data = await res.json()  // ← you'll get an error body, not a throw
    return data
  } catch (e) {
    console.error('Only fires on network failure, not 404/500')
  }
}

// ✅ Always check response.ok (true for 200–299 status codes)
async function goodFetch() {
  try {
    const res = await fetch('/api/user/999')
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error('Request failed:', error)
    throw error  // re-throw so callers can handle it
  }
}
```

> [!IMPORTANT]
> `fetch()` only rejects (throws) for network-level failures: no internet connection, DNS resolution failure, or a request that was blocked. A server returning `404 Not Found` or `500 Internal Server Error` is still a successful HTTP response — always check `response.ok`.

## Sending Data (POST Request)

```ts
interface CreateUserPayload {
  name: string
  email: string
}

async function createUser(payload: CreateUserPayload) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    throw new Error(errorBody?.message ?? `HTTP ${response.status}`)
  }

  return response.json() as Promise<{ id: string; name: string; email: string }>
}

// Usage
const user = await createUser({ name: 'Alice', email: 'alice@example.com' })
console.log('Created user:', user.id)
```

## CORS: Cross-Origin Resource Sharing

**CORS** is a browser security mechanism that blocks JavaScript from making requests to a different origin (scheme + host + port) than the current page. The browser sends a preflight `OPTIONS` request to ask the server if the cross-origin request is allowed.

```
Page at:    https://myapp.com
Fetch to:   https://api.other.com/data  ← cross-origin → browser checks CORS headers
```

The **server** must respond with the right CORS headers:

```http
Access-Control-Allow-Origin: https://myapp.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type, Authorization
```

> [!NOTE]
> CORS is enforced by the **browser**, not the server. A CORS block does not mean the server rejected the request — the server likely responded fine, but the browser hid the response from JavaScript. This is why `curl` works when `fetch` does not.

## Cancelling a Fetch with AbortController

Long-running requests (especially in React or similar frameworks) should be cancellable to prevent state updates after a component unmounts:

```ts
async function searchUsers(query: string) {
  const controller = new AbortController()

  // Cancel after 5 seconds
  const timeoutId = setTimeout(() => controller.abort(), 5000)

  try {
    const res = await fetch(`/api/users?q=${encodeURIComponent(query)}`, {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.log('Request cancelled')
      return null
    }
    throw error
  }
}
```

## Practical Example: Fetching from a Public API

```ts
interface GitHubUser {
  login: string
  name: string
  public_repos: number
  followers: number
}

async function fetchGitHubProfile(username: string): Promise<GitHubUser> {
  const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  })

  if (res.status === 404) {
    throw new Error(`User "${username}" not found`)
  }
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`)
  }

  return res.json()
}

// Usage
try {
  const user = await fetchGitHubProfile('torvalds')
  console.log(`${user.name} has ${user.public_repos} public repos`)
} catch (error) {
  console.error(error)
}
```

> [!TIP]
> Use `encodeURIComponent()` whenever you insert user-provided strings into a URL — it escapes characters like `&`, `?`, and spaces that would break the URL structure.

## Further Learning

Search these terms to go deeper:
- **"MDN Fetch API using fetch"** — the comprehensive reference including streaming responses and credentials
- **"CORS in depth web.dev"** — how CORS headers work, simple vs preflighted requests
- **"async await error handling patterns"** — strategies beyond basic try/catch for complex async flows
- **"Response.body ReadableStream"** — how to handle streaming responses from APIs like Server-Sent Events
- **"SWR TanStack Query data fetching"** — libraries that add caching, revalidation, and loading states on top of fetch
