---
title: TLS Certificates
order: 4
estMinutes: 10
difficulty: easy
checklist:
  - Explain certificate authority trust
  - Understand domain validation
  - Know certificate expiry risks
  - Distinguish edge and origin certificates
  - Debug certificate errors
---

That little padlock in your browser's address bar is backed by a **TLS certificate** — a digital ID card that proves a website really is who it says it is. It's what makes HTTPS trustworthy.

## How trust works

Your browser doesn't just take a website's word for it. Certificates are issued by trusted **Certificate Authorities** (CAs) — official ID-issuers the browser already trusts. When a site presents a certificate that traces back to a trusted CA, the browser shows the padlock. If it can't verify it, you get the scary "Not Secure" warning.

The good news: getting a certificate is **free and automatic** now. Services like Let's Encrypt (and hosts like Vercel/Netlify) handle it for you.

## Why certificates break

When you see a certificate error, it's almost always one of these:

- **Expired** — certificates have an expiry date and must be renewed.
- **Wrong name** — the certificate is for `example.com` but you're on `www.example.com`.
- **Clock is wrong** — your device's date/time is off, so it thinks a valid cert is expired.

> [!IMPORTANT]
> An expired certificate takes your whole site down with a security warning — and it's completely avoidable. Set up auto-renewal (most hosts do this automatically) or monitor expiry dates.

## In one sentence

A TLS certificate is a site's verified ID card, issued by a trusted authority, that powers the HTTPS padlock — and the main thing to watch is not letting it expire.

## Want to go deeper?

Switch to **Expert** mode above for the certificate chain, domain validation, and edge-vs-origin certificates with CDNs.
