---
title: Modules (ESM & CJS)
order: 7
estMinutes: 12
difficulty: easy
checklist:
  - Explain why modules exist and what problem they solve vs global scripts
  - Write named exports and the corresponding named imports
  - Write a default export and import it with any local name
  - Use dynamic import() for code splitting and conditional loading
  - Explain the key differences between ESM and CommonJS
  - Describe how browsers load ES modules natively
---

As your app grows, you split code across many files. **Modules** are how those files share code with each other on purpose — one file "exports" things, another "imports" them. This keeps each file tidy and private instead of everything piling into one global mess.

## Sharing code: export and import

One file offers things with `export`:

```ts
// math.js
export function add(a, b) { return a + b }
export const PI = 3.14159
```

Another file grabs what it needs with `import`:

```ts
// main.js
import { add, PI } from './math.js'
add(1, 2)  // 3
```

The `{ }` names must match what was exported. You can rename on the way in with `as`:

```ts
import { add as sum } from './math.js'
```

## Default export: the "main thing"

A file can mark one export as its default — the star of the file. You import it *without* braces and can call it anything:

```ts
// logger.js
export default function log(msg) { console.log(msg) }
```

```ts
// main.js
import log from './logger.js'   // any name works
```

> [!NOTE]
> Named exports (`export function add`) are usually preferred because the name is spelled out on both ends, which helps your editor and search. Default exports fit the "one main thing per file" case, like a React component.

## Loading code only when needed

Regular imports load right away. If something is heavy and rarely used, load it on demand with `import()` (note the parentheses — it's a function):

```ts
async function openChart() {
  const { Chart } = await import('./chart.js')  // loads only now
  new Chart()
}
```

This is called **code splitting** — instead of shipping one giant file, you ship small pieces that load when required, so the page starts faster.

## Two flavors: ESM and CommonJS

You'll see two syntaxes in the wild:

- **ESM** (modern, what you should write): `import` / `export`.
- **CommonJS** (older Node.js style): `require()` / `module.exports`.

```js
// CommonJS — common in older packages
const { add } = require('./math.js')
module.exports = { add }
```

They do the same job; ESM is the current standard and works natively in browsers via `<script type="module">`.

## In one sentence

Modules let files share code deliberately with `export` and `import`, keeping each file's other variables private — write ESM (`import`/`export`), and use `import()` to lazy-load heavy code.

## Want to go deeper?

Switch to **Expert** mode above for the full ESM-vs-CommonJS table, live bindings, tree-shaking, and how Node decides which flavor a file is.
