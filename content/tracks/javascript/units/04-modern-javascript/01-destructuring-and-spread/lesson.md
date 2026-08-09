---
id: 01-destructuring-and-spread
title: Destructuring and Spread
language: javascript
runner: browser
estMinutes: 18
files:
  - path: main.js
    starter: starter/main.js
goal: "Write introduce, podium, and withDefaults using destructuring, rest, and spread — unpack objects and arrays by shape, merge settings without mutating anything — then print the four demo lines."
docs: [javascript/objects, javascript/arrays]
checks:
  - id: unpacking-works
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-demo
    type: stdout
    entry: main.js
    match: exact
    value: "Rin from Osaka\nSol from parts unknown\ngold Ada, silver Sam, 3 others\n{ theme: 'dark', fontSize: 16 }\n"
  - id: real-destructuring
    type: ai-judge
    rubric: "introduce uses object destructuring with a default value for city (no person.city dot-chains or if checks building the fallback), podium uses array destructuring with a ...rest element (no slice/index bookkeeping), and withDefaults returns a NEW object built by spreading DEFAULTS then settings — it never mutates DEFAULTS or settings (no Object.assign onto DEFAULTS), and nothing is hardcoded per demo input."
hints:
  - "The pattern mirrors the object: const { name, city = \"parts unknown\" } = person; — then template the two variables together."
  - "Arrays unpack by position: const [gold, silver, ...rest] = results; — rest collects everything after silver into a real array with a .length."
  - "Spread order is the whole rule in withDefaults: { ...DEFAULTS, ...settings } — whatever appears LAST wins the tie."
---
## Take it apart in one line

Welcome to the Intermediate tier. This unit is the JavaScript you'll meet
in every modern codebase — and it opens with the syntax professionals
type most: **destructuring**.

You've been reaching into objects one property at a time:

```js
const name = person.name;
const city = person.city;
```

Destructuring flips the assignment around — write the *shape*, and
JavaScript unpacks it:

```js
const { name, city } = person;
```

Same two variables, one line, and it reads like what it does. Put `=`
inside the pattern and missing pieces get a fallback:

```js
const { name, city = "parts unknown" } = person;
```

Arrays destructure by *position*, and three dots sweep up the leftovers:

```js
const [gold, silver, ...rest] = results;   // rest is a real array
```

When `...` collects like that, it's called **rest**. The same three dots
pointed the other way — **spread** — scatter a collection *into* a new
one:

```js
const merged = { ...DEFAULTS, ...settings };
```

Two rules make spread-merging the professional way to handle settings.
Later keys win, so `settings` overrides `DEFAULTS` where they collide.
And `merged` is a **new object** — neither input is touched. Copy, then
override; never mutate what you were handed. You'll recognize
`{ ...state, done: true }` in every React tutorial ever written, and one
of today's tests checks exactly that `DEFAULTS` survives unharmed.

The starter has the data waiting: two profiles (one missing its city), a
race result, and a `DEFAULTS` settings object. Three small functions,
each one pattern.

### Your goal

1. `introduce(person)` — destructure `name` and `city` (defaulting to
   `"parts unknown"`) and return `` `${name} from ${city}` ``.
2. `podium(results)` — destructure into `gold`, `silver`, and `...rest`;
   return `` `gold ${gold}, silver ${silver}, ${rest.length} others` ``.
3. `withDefaults(settings)` — spread `DEFAULTS`, then `settings`, into a
   fresh object and return it.
4. Print `introduce(rin)`, `introduce(sol)`, `podium(race)`, and
   `withDefaults({ fontSize: 16 })`:

```
Rin from Osaka
Sol from parts unknown
gold Ada, silver Sam, 3 others
{ theme: 'dark', fontSize: 16 }
```
