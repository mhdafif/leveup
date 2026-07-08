---
title: Form Validation Patterns
order: 9
estMinutes: 12
difficulty: easy
checklist:
  - Implement field-level sync validation that runs on blur
  - Implement debounced async validation for server-checked fields
  - Show field errors accessibly using aria-describedby
  - Distinguish between field-level and form-level validation errors
  - Prevent form submission when validation errors are present
---

Good form validation *helps* people fill out a form, instead of nagging them. The secret is mostly about **timing** — showing the right error at the right moment, not the instant they click into an empty field.

## Two kinds of checks

- **Instant checks** — things you can verify on the spot: "email is required," "must be a valid format," "password too short." No server needed.
- **Server checks** — things only the server knows: "is this username taken?" These require an API call.

## Timing: validate on blur, not on every keystroke

Don't yell at someone the moment they start typing. A good rule: check a field when they **leave** it (blur), then keep it updated as they fix it:

```ts
function validateEmail(value) {
  if (!value.trim()) return 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email.'
  return null   // null = no error
}
```

## Server checks: wait and debounce

For "is this username taken?", don't hit the server on every keystroke. Wait until they pause typing (debounce), and only check if the *instant* checks already passed — no point asking the server about an obviously invalid value:

```ts
// only after ~350ms of no typing, and only if format is valid
const available = await checkUsername(value)
```

## Make errors accessible

Screen-reader users need errors announced too. Link each error message to its input with `aria-describedby`, and mark the field `aria-invalid` when it has an error. This is easy to add and matters a lot.

> [!TIP]
> Show instant errors eagerly (on blur), but server checks lazily (after a pause, and only if the instant checks pass). And never show an error on a field the user hasn't touched yet.

## In one sentence

Validate helpfully by timing it right — check instant rules when a field loses focus, debounce server checks (only after instant checks pass), and wire errors to inputs with `aria-describedby` for accessibility.

## Want to go deeper?

Switch to **Expert** mode above for the debounced async validator, full accessibility props, and field-vs-form-level errors.
