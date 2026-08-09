---
id: 05-testing-with-vitest
title: Testing with Vitest
language: javascript
runner: local
estMinutes: 20
files:
  - path: main.js
    starter: starter/main.js
goal: "Work a real test-first loop: read the failing suite as a spec, then implement slugify(title) — trim, lowercase, strip punctuation, collapse spaces to dashes — until every test is green."
docs: [javascript/strings, javascript/functions-and-closures, javascript/npm-basics]
checks:
  - id: the-suite-is-the-spec
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: demo-slugs
    type: stdout
    entry: main.js
    match: exact
    value: "getting-started-with-vitest\nwhy-tests-are-a-spec\nred-green-refactor\n"
  - id: a-real-transform
    type: ai-judge
    rubric: "slugify is a genuine general-purpose transform: a chain of string operations (trim, toLowerCase, and regex/replace steps that remove characters outside letters-digits-spaces-dashes, then collapse whitespace runs to single dashes) that would work on ANY title — not a lookup table, not if/else branches keyed on the suite's or the demo's specific inputs, and none of the expected slug strings appear as literals. The demo output comes from looping the TITLES array through slugify, not from printing prepared strings."
hints:
  - "Read the suite in tests/test_main.js top to bottom first — each test name is one requirement. Implement in that order and watch the failure count fall."
  - "A chain does it: title.trim().toLowerCase().replace(/[^a-z0-9\\s-]/g, \"\").replace(/\\s+/g, \"-\") — strip what doesn't belong, then collapse whitespace runs into single dashes."
  - "Punctuation disappears BEFORE spaces collapse, so \"Node & Tooling\" becomes \"node  tooling\" (two spaces) and then \"node-tooling\" — if you collapse first, the & leaves a dangling dash behind."
---
## Red, then green

Professionals don't check their code by squinting at output — they
write tests that check it forever. In the JS world the tool is
**Vitest** (`npm i -D vitest`), and its dialect will look eerily
familiar:

```js
// slugify.test.js
import { test, expect } from "vitest";
import { slugify } from "./slugify.js";

test("lowercases the title", () => {
  expect(slugify("Hello World")).toBe("hello-world");
});
```

Familiar because it's *exactly* the harness this course has been
running your `tests` checks with all along: `test(name, fn)`,
`expect(actual)`, `.toBe` for primitives, `.toEqual` for arrays and
objects. Today the training wheels come off the *workflow* too. On a
real project you'd run `npx vitest` and it would watch your files,
rerunning on every save — a red list of failures shrinking toward
green. `vitest run` does one pass, which is what CI calls (remember
`"test": "vitest run"` in the linkdrop manifest?).

The deeper lesson is what a suite *is*: **the spec, written as code**.
Open `tests/test_main.js` before you write anything. Each test name is
a requirement — lowercases, trims, collapses runs of spaces, strips
punctuation, keeps existing dashes. That's the whole assignment,
stated more precisely than prose ever could. This inversion — tests
first, implementation until green — is test-driven development, and
for a well-specified function it's genuinely faster than guessing.

Your target is `slugify(title)`: the function every blog engine has,
turning `"Node & Tooling: Part 2!"` into `"node-tooling-part-2"` for a
URL. Make it a real transform — regexes and string methods — because
the reviewer will read it, and because a lookup table dies on the
first title it hasn't met.

### Your goal

1. Read the suite; implement `slugify(title)` until every test
   passes.
2. Keep the starter's demo loop printing each `TITLES` entry slugged:

```
getting-started-with-vitest
why-tests-are-a-spec
red-green-refactor
```
