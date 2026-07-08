---
title: Users, Permissions, and Sudo
order: 3
estMinutes: 10
difficulty: easy
checklist:
  - Create a non-root user
  - Understand file owner, group, and mode
  - Use chmod and chown carefully
  - Grant sudo access
  - Avoid running apps as root
---

On Linux, **root** is the all-powerful super-user account. Running your app as root is risky — if something goes wrong (a bug, an attack), it has full access to *everything*. Best practice: create a normal user for your app to run as.

## Making a safer user

```bash
sudo adduser deploy          # create a new user called "deploy"
sudo usermod -aG sudo deploy  # let them run sudo when needed
```

Now your app runs as `deploy`, with only the access `deploy` actually needs — not full system control.

## Who can touch a file

Every file has an **owner**, a **group**, and permission bits for each:

```bash
ls -l app.log
-rw-r-----  deploy deploy  app.log
```

That reads: the owner (`deploy`) can read/write, the group can only read, and everyone else gets nothing.

```bash
sudo chown deploy:deploy app.log   # change who owns it
chmod 640 app.log                  # set who can read/write
```

## The command to avoid

> [!WARNING]
> `chmod 777` (which lets *anyone* read, write, and execute a file) is almost never the right fix. It's usually a lazy patch for an ownership problem you should actually solve properly — and it opens the door to real security issues.

## In one sentence

Run your app as a dedicated non-root user (not `root`), understand a file's owner/group/permissions before changing them with `chown`/`chmod`, and never reach for `chmod 777` as a shortcut.

## Want to go deeper?

Switch to **Expert** mode above for the full permission-bit breakdown and sudoers configuration.
