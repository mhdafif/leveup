---
title: IP, Ports, TCP, and UDP
order: 1
estMinutes: 12
difficulty: easy
checklist:
  - Explain IP addresses and ports
  - Distinguish TCP from UDP
  - Identify common web ports
  - Understand listening services
  - Debug whether a port is reachable
---

Computers on a network find each other the same way you find a friend: with an address, and then the right apartment number. On the internet, the **IP address** is the building, and the **port** is the apartment (which specific service on that machine).

## IP + port

- **IP address** — identifies a machine (like `142.250.80.46`).
- **Port** — identifies a service *on* that machine.

When you visit `https://example.com`, you're really connecting to that server on port **443** (the standard port for secure web traffic). Plain (non-secure) web uses port **80**.

```txt
https://example.com  →  example.com:443
```

## TCP vs UDP: two ways to send data

- **TCP** is like a phone call with confirmation — it guarantees everything arrives, in order, nothing lost. Web pages use TCP.
- **UDP** is like shouting across a room — faster, but no guarantee everything arrives. Good for things where speed beats perfection, like live video or games.

For almost all web work, you're using TCP without thinking about it.

> [!TIP]
> When an app is down, check three things in order: is the **address** (DNS) right, is the **port open**, and is a **program actually listening** on it?

## In one sentence

An IP address points to a machine and a port points to a service on it (web = 443 for HTTPS, 80 for HTTP) — and web traffic rides on TCP, which reliably delivers everything in order.

## Want to go deeper?

Switch to **Expert** mode above for the TCP/UDP trade-offs in detail and tools for inspecting listening ports.
