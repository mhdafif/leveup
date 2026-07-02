---
title: TLS Certificates
order: 4
estMinutes: 25
difficulty: medium
checklist:
  - Explain certificate authority trust
  - Understand domain validation
  - Know certificate expiry risks
  - Distinguish edge and origin certificates
  - Debug certificate errors
---

TLS certificates prove that a server is allowed to serve a domain. Browsers trust certificates because they chain back to trusted certificate authorities.

Common certificate errors come from expiry, wrong hostname, missing intermediate certs, or invalid local time.

> [!IMPORTANT]
> Certificate expiry is an avoidable outage. Monitor expiry dates for production domains.

CDNs can use one certificate at the edge and a different certificate between CDN and origin.

## Further Learning

- **"TLS certificate chain explained"** — trust chain
- **"Let's Encrypt domain validation"** — issuing certs
- **"openssl s_client certificate debug"** — terminal inspection
