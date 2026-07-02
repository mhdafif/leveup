---
title: Form Validation Patterns
order: 9
estMinutes: 25
difficulty: medium
checklist:
  - Implement field-level sync validation that runs on blur
  - Implement debounced async validation for server-checked fields
  - Show field errors accessibly using aria-describedby
  - Distinguish between field-level and form-level validation errors
  - Prevent form submission when validation errors are present
---

Good validation helps users complete forms, not fight them. Synchronous rules catch local issues such as required fields, length, and format. Asynchronous validation checks server-owned facts such as username availability. Treat them differently so the form feels responsive and fair.

## Field-Level Sync Validation

Run sync validation on blur, then on change after the field has been touched. This avoids showing errors before the user has a chance to type.

```ts
type FieldState = {
  value: string;
  touched: boolean;
  error: string | null;
};

export function validateEmail(value: string): string | null {
  if (!value.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email.";
  return null;
}

export function onEmailBlur(field: FieldState): FieldState {
  return {
    ...field,
    touched: true,
    error: validateEmail(field.value),
  };
}
```

## Debounced Async Validation

Async validation should run only after sync validation passes. Otherwise the app wastes server calls checking values that are already invalid locally.

```ts
export function createUsernameValidator(
  checkAvailability: (username: string) => Promise<boolean>,
  delayMs = 350,
) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (username: string) =>
    new Promise<string | null>((resolve) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        const available = await checkAvailability(username);
        resolve(available ? null : "Username is already taken.");
      }, delayMs);
    });
}
```

## Accessible Errors

Connect each error message to its input with `aria-describedby`, and set `aria-invalid` when an error exists. Form-level errors belong in a summary near the top, ideally in a focusable or announced region after submission fails.

```ts
export function inputA11yProps(fieldId: string, error: string | null) {
  return {
    id: fieldId,
    "aria-invalid": error ? "true" : "false",
    "aria-describedby": error ? `${fieldId}-error` : undefined,
  };
}
```

> [!NOTE]
> Run sync validation eagerly (on blur), async validation lazily (debounced, only after sync passes). Never block the user with a spinner on a field they haven't touched yet.

## Further Learning

Search these terms to go deeper:
- **"aria-describedby form validation"** — connecting errors to fields accessibly
- **"debounced async validation username"** — server-backed field checks
- **"form error summary screen reader"** — accessible submission failure patterns
- **"schema validation client server shared"** — keeping rules consistent across boundaries
