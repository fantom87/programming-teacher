# Modules

As programs grow, one giant file becomes a headache. **Modules** let you split code into files that share things with each other using `export` and `import`.

## Exporting

A file becomes a module by exporting something:

```js
// math.js
export function add(a, b) {
  return a + b;
}

export const PI = 3.14159;
```

These are **named exports** — a file can have as many as it likes.

## Importing

```js
// app.js
import { add, PI } from "./math.js";

console.log(add(2, 3));   // 5
console.log(PI);          // 3.14159
```

The names in braces must match the exported names. The path starts with `./` (same folder) or `../` (parent folder) for your own files.

## Default exports

Each file may also have **one** default export — its "main thing":

```js
// greet.js
export default function greet(name) {
  return `Hello, ${name}!`;
}
```

```js
// app.js
import greet from "./greet.js";   // no braces, and YOU choose the name

greet("Ada");
```

Braces = named import, no braces = default import. Mixing them is fine:

```js
import greet, { add } from "./stuff.js";
```

## Renaming and grabbing everything

```js
import { add as sum } from "./math.js";       // rename on the way in
import * as math from "./math.js";            // everything, namespaced

math.add(1, 2);
```

## Using modules in the browser

Tell the browser your script is a module:

```html
<script type="module" src="app.js"></script>
```

Module scripts load politely (they don't block the page) and their variables stay private — nothing leaks into other scripts unless exported.

## Importing packages

When you install packages with npm, you import them by bare name — no `./`:

```js
import confetti from "canvas-confetti";
```

Rule of thumb: one focused job per file, export the pieces others need, and let `import` wire your app together.
