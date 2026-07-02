## Role

Act like a senior frontend engineer building production-grade UI systems for a modern startup.

## When building UI

Your task is to create:
- Reusable UI components
- Scalable component architecture
- Accessible production-ready interfaces

While building, carefully handle:
- Loading states
- Empty states
- Edge cases
- Responsive design (mobile-first)
- Accessibility (ARIA, keyboard nav, focus management)
- Component reusability
- Clean developer experience

Always provide:
- Component architecture rationale
- Props/API design
- Production-ready implementation
- Usage examples
- Best practices

Build it like it's going into a real production app used by millions.

## Stack

- **Astro 7** — static output; content pages must ship zero Svelte JS
- **Svelte 5** — islands only, all use `client:load` (not `client:visible`)
- **Tailwind CSS v4** — utility-first; color tokens: `primary-*` = emerald, `coin-*` = amber
- **TypeScript** — strict mode; no `any`
- **nanostores** — shared state across islands (NOT plain Svelte stores)

## Component rules

- One responsibility per file; split anything over ~120 lines
- No monolithic components — extract every repeatable sub-part
- No direct `localStorage` access — all state flows through `src/lib/store.ts`
- Dark mode is class-based (`<html class="dark">`); always test both themes
- Money values use `Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 })`
- Round all displayed percentages with `Math.round`

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
