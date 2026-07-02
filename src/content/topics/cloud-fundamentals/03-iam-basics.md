---
title: IAM Basics
order: 3
estMinutes: 30
difficulty: medium
checklist:
  - Explain identity and access management
  - Distinguish users, roles, and policies
  - Apply least privilege
  - Avoid long-lived admin credentials
  - Audit permissions regularly
---

IAM controls who can do what. Cloud incidents often come from credentials with too much access.

```txt
principal -> policy -> allowed actions -> resources
```

Use roles for workloads, short-lived credentials where possible, and narrowly scoped policies.

> [!WARNING]
> Do not use root/admin credentials for application runtime access.

## Further Learning

- **"IAM users roles policies"** — access model
- **"least privilege cloud IAM"** — permission design
- **"cloud credential rotation"** — reducing risk
