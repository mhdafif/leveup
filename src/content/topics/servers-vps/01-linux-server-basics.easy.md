---
title: Linux Server Basics
order: 1
estMinutes: 12
difficulty: easy
checklist:
  - Navigate common Linux directories
  - Inspect CPU, memory, disk, and processes
  - Install packages with the system package manager
  - Edit config files safely
  - Reboot and update a server deliberately
---

A **VPS** (Virtual Private Server) is basically a Linux computer you access remotely instead of sitting in front of. Learning a handful of basic commands lets you look around, check on its health, and install things.

## The must-know commands

```bash
pwd          # where am I right now?
ls -la       # what's in this folder?
df -h        # how much disk space is left?
free -m      # how much memory is used?
top          # what's running, and how busy is the CPU?
sudo apt update && sudo apt upgrade   # get the latest software updates
```

`top` in particular is your go-to when something feels slow — it shows exactly what's eating CPU or memory right now.

## Places worth knowing

- **`/etc`** — configuration files for the system and installed services.
- **`/var/log`** — log files (your first stop when debugging).
- **`/home`** — each user's personal folder.

## Before you edit a config file

> [!TIP]
> Before changing a system configuration file, make a backup copy first (`cp file file.bak`). If your change breaks something, you can instantly put the original back.

## In one sentence

A VPS is a remote Linux machine — a handful of commands (`ls`, `df`, `top`, `apt update`) let you explore it, check its health, and keep it updated, and it's always worth backing up a config file before you edit it.

## Want to go deeper?

Switch to **Expert** mode above for the fuller directory map and system resource inspection.
