---
title: SSH Keys and Hardening
order: 2
estMinutes: 30
difficulty: medium
checklist:
  - Generate an SSH key pair
  - Add a public key to authorized_keys
  - Disable password login
  - Disable direct root login
  - Know how to avoid locking yourself out
---

SSH is the normal way to administer a VPS. Key-based login is safer than password login because the private key stays on your machine.

```bash
ssh-keygen -t ed25519 -C "you@example.com"
ssh user@server-ip
```

Hardening usually means editing `/etc/ssh/sshd_config`:

```txt
PasswordAuthentication no
PermitRootLogin no
```

Then reload SSH:

```bash
sudo systemctl reload ssh
```

> [!CAUTION]
> Keep one active SSH session open while changing SSH settings. Test a second login before closing the first session.

## Further Learning

- **"OpenSSH authorized_keys"** — key-based auth
- **"sshd_config PasswordAuthentication"** — disabling password login
- **"SSH hardening VPS"** — practical security baseline
