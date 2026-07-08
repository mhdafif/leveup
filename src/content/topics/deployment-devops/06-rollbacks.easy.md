---
title: Rollbacks
order: 6
estMinutes: 10
difficulty: easy
checklist:
  - Explain rollback vs roll forward
  - Keep previous artifacts available
  - Know when rollback is unsafe
  - Separate config rollback from code rollback
  - Practice rollback before incidents
---

Sometimes a new release breaks something. A **rollback** means going back to the last known-good version — your emergency exit. Having this ready *before* you need it is what turns a scary incident into a quick, calm fix.

## The easy case

If your builds are saved and don't depend on anything that's changed, rolling back is simple: just redeploy the previous version. This works cleanly when nothing about the *data* has changed — only the code.

## The tricky case: when data already changed

> [!WARNING]
> If the new version already changed data in a way the *old* code can't understand, a rollback isn't safe anymore — the old code might crash or corrupt things when it hits the new data shape. In that situation, a small forward fix (patching the current version) is often safer than reverting.

## Practice it before you need it

> [!TIP]
> Test your rollback process on a calm day, not during a real outage at 2am. If nobody's ever actually run the rollback command, you don't really have a rollback plan — you have a hope.

## In one sentence

A rollback returns to the last known-good version — easy when only code changed, risky when data already changed in a way old code can't read — and you should practice it before you actually need it in an emergency.

## Want to go deeper?

Switch to **Expert** mode above for immutable build artifacts and database rollback risks.
