---
title: Design Systems
order: 10
estMinutes: 35
difficulty: medium
checklist:
  - Define design tokens for color, spacing, and typography
  - Design a component API that is flexible without being unpredictable
  - Set up Storybook to document and test components in isolation
  - Ensure design system components meet WCAG AA accessibility standards
  - Compare building a design system vs adopting an existing one
---

A design system is the single source of truth for visual and interactive decisions. It provides tokens, components, and documentation so that every team building on the same product speaks the same visual language. Done well, it accelerates development and enforces consistency. Done poorly, it becomes a maintenance liability that everyone works around.

## Design Tokens

Tokens are the smallest named design decisions — they give semantic names to raw values. Consumers reference the token, not the value, so changing the token propagates everywhere:

```ts
// tokens.ts — platform-agnostic source of truth
export const tokens = {
  color: {
    brand: {
      primary:   "#4f46e5", // indigo-600
      secondary: "#0ea5e9", // sky-500
    },
    semantic: {
      danger:  "#dc2626",
      success: "#16a34a",
      warning: "#d97706",
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  fontsize: {
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
  },
  radius: {
    sm: "4px",
    md: "8px",
    full: "9999px",
  },
} as const;
```

CSS custom properties are the delivery mechanism for the web:

```css
:root {
  --color-brand-primary: #4f46e5;
  --spacing-md: 16px;
  --radius-md: 8px;
}
```

> [!TIP]
> Tools like **Style Dictionary** transform a single token source (JSON or JS) into CSS custom properties, iOS Swift constants, Android XML, and Figma tokens — keeping all platforms in sync from one definition.

## Component API Design

A component's props are its API contract. Bad API choices compound as the system grows. Principles:

**Be explicit, not magical.** Prefer `<Button variant="destructive">` over `<Button danger>` — it scales to more variants without adding booleans indefinitely.

**Compose, don't grow.** Avoid adding dozens of props to one component. A `Card` component should not have a `headerBadgeText` prop — compose `<Card.Header>`, `<Badge>`, and `<Card.Body>` instead.

**Forward refs and spread props.** Allow consumers to attach refs and add arbitrary HTML attributes:

```tsx
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "destructive" }
>(({ variant = "primary", className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(buttonVariants[variant], className)}
    {...props}
  >
    {children}
  </button>
));
Button.displayName = "Button";
```

> [!NOTE]
> Using `React.ButtonHTMLAttributes<HTMLButtonElement>` in the type means consumers automatically get `disabled`, `onClick`, `aria-*`, `data-*`, and any other standard button attribute without you needing to list them explicitly.

## Storybook

Storybook renders components in isolation, outside your application. Every component gets a story that documents its variants and states:

```ts
// Button.stories.ts
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  component: Button,
  args: { children: "Click me" },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: "primary" } };
export const Destructive: Story = { args: { variant: "destructive" } };
export const Disabled: Story = { args: { disabled: true } };
```

Storybook's **a11y addon** (based on axe-core) runs accessibility checks on every story automatically. The **interactions addon** lets you write interaction tests directly in stories using Testing Library queries.

## Accessibility in Components

Every design system component must ship with correct accessibility behaviour baked in:

- Buttons must be `<button>` elements (keyboard activatable, correct role)
- Form inputs must be paired with `<label>` via `htmlFor`/`id` or `aria-label`
- Icon-only buttons must have `aria-label` or a visually-hidden span
- Color alone must never be the only differentiator (use icons, text, or patterns alongside color)
- Focus styles must be visible and meet the 3:1 contrast requirement

> [!IMPORTANT]
> Components that hard-code `outline: none` without providing a replacement are accessibility violations. Provide a custom focus ring using `:focus-visible` so keyboard users see it but mouse users do not.

## Versioning and Publishing

Publish as a private npm package with semantic versioning:

- **Patch** (1.0.1) — bug fixes, no API changes
- **Minor** (1.1.0) — new components or props, backward-compatible
- **Major** (2.0.0) — breaking API changes

Use **Changesets** to track changes per PR and automate changelog generation and version bumps. Publish to a private registry (GitHub Packages, Verdaccio) or to npm with scoped packages (`@myorg/ui`).

## Build vs Buy

| Factor | Build | Adopt (shadcn/ui, Radix, Chakra) |
|---|---|---|
| Unique brand requirements | High fit | Low fit |
| Team size | Large (>5 FE) | Any |
| Timeline | Long | Fast |
| Maintenance cost | High | Lower |
| Accessibility baseline | Must build | Often included |

For most teams, starting with **shadcn/ui** (unstyled Radix components with Tailwind) and customising tokens is faster and safer than building from zero.

## Further Learning

Search these terms to go deeper:
- **"Style Dictionary design tokens"** — multi-platform token transformation tool with examples
- **"Storybook component story format"** — official guide to writing stories with args and play functions
- **"Radix UI accessibility"** — how Radix handles ARIA and keyboard patterns in unstyled primitives
- **"Changesets monorepo versioning"** — automated changelog and version bump workflow
- **"Brad Frost atomic design"** — foundational methodology for organising design system components
