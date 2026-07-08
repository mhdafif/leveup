---
title: Design Systems
order: 10
estMinutes: 15
difficulty: easy
checklist:
  - Define design tokens for color, spacing, and typography
  - Design a component API that is flexible without being unpredictable
  - Set up Storybook to document and test components in isolation
  - Ensure design system components meet WCAG AA accessibility standards
  - Compare building a design system vs adopting an existing one
---

A **design system** is a shared kit of reusable buttons, colors, spacing, and rules so that everything across an app looks and behaves consistently. Instead of each developer inventing their own button, everyone uses *the* button. It saves time and keeps things looking like one product.

## Design tokens: name your decisions

A **token** is a name for a design value. Instead of scattering `#4f46e5` everywhere, you name it once:

```css
:root {
  --color-primary: #4f46e5;
  --spacing-md: 16px;
  --radius-md: 8px;
}
```

Now everyone uses `var(--color-primary)`. Want to rebrand? Change it in one place and the whole app updates. That's the whole point.

## Designing good components

When you build a shared component, its **props are its contract**. A couple of habits keep them from becoming a mess:

- **Be explicit:** `<Button variant="danger">` scales better than piling on booleans like `<Button danger primary big>`.
- **Compose instead of cramming:** rather than a `Card` with 20 props, let people build it from `<Card.Header>`, `<Card.Body>`, etc.

## Preview components in isolation with Storybook

**Storybook** is a tool that shows each component on its own, in every state, outside your app. It's like a catalog page for your UI:

```ts
export const Primary = { args: { variant: 'primary' } }
export const Disabled = { args: { disabled: true } }
```

Great for building, documenting, and testing components without clicking through the whole app.

## Build it, or use one?

You don't always have to build from scratch. Popular ready-made kits like **shadcn/ui**, **Radix**, and **Chakra** give you accessible components out of the box — you just style them with your tokens. For most teams, starting from one of these is faster and safer than building everything yourself.

> [!IMPORTANT]
> Whatever you use, make sure components are accessible: real `<button>`s, labels on inputs, and visible focus rings. Good kits handle a lot of this for you.

## In one sentence

A design system is a shared, consistent kit of components and **tokens** (named values like `--color-primary`) — design clean component props, preview them in Storybook, and consider adopting an accessible kit like shadcn/ui instead of building from zero.

## Want to go deeper?

Switch to **Expert** mode above for multi-platform tokens, `forwardRef` component APIs, Storybook add-ons, versioning, and a full build-vs-buy comparison.
