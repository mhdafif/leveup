---
title: SSH Keys and Hardening
order: 2
estMinutes: 12
difficulty: easy
checklist:
  - Generate an SSH key pair
  - Add a public key to authorized_keys
  - Disable password login
  - Disable direct root login
  - Know how to avoid locking yourself out
---

**SSH** is how you remotely log into and control a server. Logging in with a **key** (instead of a password) is much safer — the secret half of the key never leaves your own computer.

## Setting up key-based login

```bash
ssh-keygen -t ed25519 -C "you@example.com"   # generate a key pair on your machine
ssh user@server-ip                            # connect using it
```

You get a *public* key (safe to share, goes on the server) and a *private* key (stays secret, on your machine only).

## Locking the door behind you

Once key-based login works, you can turn *off* password login entirely — so even a guessed/leaked password can't get anyone in. Edit `/etc/ssh/sshd_config`:

```
PasswordAuthentication no
PermitRootLogin no
```

Then apply the change:

```bash
sudo systemctl reload ssh
```

## The one rule that saves you from disaster

> [!CAUTION]
> Before you close your current SSH session, open a **second** one to test the new settings work. If you disable password login and something's wrong with your key setup, closing your only session could lock you out entirely, with no way back in.

## In one sentence

SSH keys are safer than passwords for logging into a server — generate a key pair, add the public half to the server, then disable password/root login entirely, but always test a second session before closing your first to avoid locking yourself out.

## Want to go deeper?

Switch to **Expert** mode above for the full `authorized_keys` setup and hardening checklist.
