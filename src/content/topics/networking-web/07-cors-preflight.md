---
title: CORS and Preflight
order: 7
estMinutes: 35
difficulty: medium
checklist:
  - Explain same-origin policy
  - Know when CORS is needed
  - Understand preflight OPTIONS requests
  - Configure allowed origins carefully
  - Debug CORS errors in the browser
---

CORS is a browser security mechanism. It controls whether frontend JavaScript from one origin can read responses from another origin.

```http
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type, Authorization
```

Preflight requests use `OPTIONS` to ask the server whether the real request is allowed.

> [!CAUTION]
> `Access-Control-Allow-Origin: *` is not safe for credentialed private APIs.

## Further Learning

- **"CORS preflight explained"** — browser flow
- **"same-origin policy"** — security model
- **"credentials CORS cookies"** — authenticated requests
