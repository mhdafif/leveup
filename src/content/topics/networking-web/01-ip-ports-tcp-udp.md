---
title: IP, Ports, TCP, and UDP
order: 1
estMinutes: 25
difficulty: easy
checklist:
  - Explain IP addresses and ports
  - Distinguish TCP from UDP
  - Identify common web ports
  - Understand listening services
  - Debug whether a port is reachable
---

An IP address identifies a machine on a network. A port identifies a service on that machine. Web traffic usually uses TCP: `80` for HTTP and `443` for HTTPS.

```txt
https://example.com -> example.com:443
```

TCP gives reliable ordered delivery. UDP is lighter and used where latency matters more than perfect delivery, such as DNS and real-time media.

> [!TIP]
> If an app is down, ask three questions: is DNS correct, is the port open, and is a process listening?

## Further Learning

- **"TCP vs UDP web developers"** — protocol tradeoffs
- **"ss listening ports Linux"** — inspect services
- **"common TCP ports HTTP HTTPS SSH"** — port basics
