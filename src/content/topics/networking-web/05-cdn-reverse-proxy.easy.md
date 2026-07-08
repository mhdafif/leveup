---
title: CDN and Reverse Proxy
order: 5
estMinutes: 10
difficulty: easy
checklist:
  - Explain reverse proxy traffic flow
  - Explain CDN edge caching
  - Understand origin servers
  - Read forwarding headers
  - Separate edge errors from origin errors
---

Two related ideas that speed up and protect websites: a **reverse proxy** and a **CDN**. Both sit *in front* of your actual server and handle incoming traffic before it reaches you.

## Reverse proxy: a receptionist for your server

A **reverse proxy** takes all incoming requests and forwards them to your real server (the "origin"). Why bother? It can add security, handle HTTPS, and hide your server's details — like a receptionist screening visitors before they reach the office.

```txt
Browser → Reverse proxy → Origin server
```

## CDN: copies of your site, worldwide

A **CDN** (Content Delivery Network) is a reverse proxy spread across the globe. It keeps cached copies of your files (images, CSS, JS) on servers near your users, so a visitor in Tokyo gets your site from a nearby Tokyo server instead of one across the world.

```txt
Browser → Nearest CDN server (cached) → (only if needed) Origin
```

The result: your site loads much faster, and your origin server handles less traffic.

> [!TIP]
> When a site breaks behind a CDN, it helps to figure out *where* it broke — is it the CDN (edge) or your actual server (origin)? Many CDN error pages tell you which side failed.

## In one sentence

A reverse proxy forwards incoming traffic to your real server (adding security and hiding it), and a CDN is a worldwide network of these that caches your files close to users for much faster loading.

## Want to go deeper?

Switch to **Expert** mode above for forwarding headers like `X-Forwarded-For` and telling edge errors apart from origin errors.
