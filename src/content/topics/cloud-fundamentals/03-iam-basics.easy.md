---
title: IAM Basics
order: 3
estMinutes: 10
difficulty: easy
checklist:
  - Explain identity and access management
  - Distinguish users, roles, and policies
  - Apply least privilege
  - Avoid long-lived admin credentials
  - Audit permissions regularly
---

**IAM** (Identity and Access Management) answers one question: *who* is allowed to do *what* in your cloud account? Getting this wrong is one of the most common causes of real cloud security incidents — usually because something had way more access than it actually needed.

## The basic flow

```
someone/something → a policy → what they're allowed to do → on which resources
```

Instead of giving broad access to everyone, you assign narrow, specific permissions — only what's actually needed for the job at hand.

## Give only what's needed (least privilege)

If your app only needs to *read* from one storage bucket, don't give it permission to delete every bucket in your account. This principle is called **least privilege**: grant the smallest amount of access that gets the job done.

## The one habit that prevents disasters

> [!WARNING]
> Never use your root/admin account's credentials for your actual running application. If that app is ever compromised (a bug, a leaked key), an attacker with admin access can do *anything* in your account. A narrowly-scoped role limits the damage to just what that specific role can touch.

## In one sentence

IAM controls who/what can do what in your cloud account — always grant the least access needed for the job (never run your app with full admin credentials), so a compromised piece can only do limited damage.

## Want to go deeper?

Switch to **Expert** mode above for roles vs policies and credential rotation practices.
