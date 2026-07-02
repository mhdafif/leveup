---
title: Secrets Management
order: 8
estMinutes: 30
difficulty: medium
checklist:
  - Identify secrets in an app
  - Keep secrets out of git
  - Rotate compromised secrets
  - Scope secrets with least privilege
  - Audit where secrets are used
---

Secrets include API keys, database passwords, signing keys, OAuth client secrets, and tokens. They should be stored in deployment platform secrets, vault tools, or protected environment config.

> [!IMPORTANT]
> If a secret is committed to git, assume it is compromised. Remove it from code and rotate the actual secret.

Least privilege means a secret should only allow the actions the app needs.

## Further Learning

- **"secrets management best practices"** — general strategy
- **"git leaked secret rotate"** — incident response
- **"least privilege API keys"** — limiting blast radius
