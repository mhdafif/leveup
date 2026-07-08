---
title: Secrets Management
order: 8
estMinutes: 10
difficulty: easy
checklist:
  - Identify secrets in an app
  - Keep secrets out of git
  - Rotate compromised secrets
  - Scope secrets with least privilege
  - Audit where secrets are used
---

**Secrets** are the sensitive values your app needs but must never be publicly visible: API keys, database passwords, signing keys, OAuth tokens. Handling them carelessly is one of the most common (and most damaging) security mistakes.

## Where secrets should live

Never hardcode secrets in your source code — they belong in your hosting platform's dedicated secrets/environment settings (things designed specifically to keep them out of Git and out of your codebase).

## If one leaks, treat it as compromised

> [!IMPORTANT]
> If a secret ever ends up committed to Git — even briefly, even if you delete the commit later — assume it's compromised. Git history is hard to truly erase, and the secret may already be cached or scraped. The fix is: remove it from the code, **and** actually rotate (change) the real secret at its source.

## Give secrets the least access they need

A secret should only be able to do what your app actually needs — not more. A key that can read *and delete* your entire database is riskier than one scoped to just "read this one table," even if your app only ever reads.

## In one sentence

Keep secrets (API keys, passwords, tokens) out of your code entirely, store them in your platform's dedicated secrets settings, treat any leaked secret as compromised and rotate it immediately, and give each secret only the access it actually needs.

## Want to go deeper?

Switch to **Expert** mode above for incident response after a leaked secret and auditing where secrets are used.
