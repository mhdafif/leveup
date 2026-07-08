---
title: CORS and Preflight
order: 7
estMinutes: 12
difficulty: easy
checklist:
  - Explain same-origin policy
  - Know when CORS is needed
  - Understand preflight OPTIONS requests
  - Configure allowed origins carefully
  - Debug CORS errors in the browser
---

Ever seen a scary red "CORS error" in the console when trying to `fetch` from another site? **CORS** is a browser safety rule, and once you understand it, it stops being mysterious.

## The rule: sites can't freely read from other sites

By default, JavaScript on `your-site.com` can't read a response from `another-site.com`. This protects users — otherwise any site could quietly read your data from other sites you're logged into. This is the **same-origin policy**.

**CORS** is how a server says "it's okay, I allow this site to read my responses." The server sends back a permission header:

```http
Access-Control-Allow-Origin: https://app.example.com
```

If that header allows your site, the browser lets your code read the response. If not, it blocks it — that's the CORS error.

## The key insight

> [!IMPORTANT]
> A CORS error doesn't mean the server *rejected* your request — the server usually responded fine. The **browser** hid the response because the permission header was missing. That's why the same request works in a tool like `curl` (no browser) but fails in your web app. The fix lives on the **server**, which must send the right `Access-Control-Allow-Origin` header.

## Preflight: the "may I?" check

For some requests, the browser first sends a quick `OPTIONS` request asking "am I allowed to do this?" before the real one. This is a **preflight**. If the server approves, the real request goes through. You don't write this — the browser does it automatically.

## In one sentence

CORS is a browser rule that blocks reading responses from other sites unless that server sends a header allowing your site — so a CORS error means "fix the server's permission headers," not "the request failed."

## Want to go deeper?

Switch to **Expert** mode above for preflight details, credentialed requests, and safely configuring allowed origins.
