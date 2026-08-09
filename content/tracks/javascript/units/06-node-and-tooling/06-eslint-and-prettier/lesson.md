---
id: 06-eslint-and-prettier
title: ESLint and Prettier
language: javascript
runner: local
estMinutes: 15
files:
  - path: main.js
    starter: starter/main.js
goal: "Play the linter: the starter carries four kinds of ESLint findings — including a typo bug that silently zeroes the subtotal — fix them all without changing what the program means, until the receipt prints its true numbers."
docs: [javascript/variables-and-types, javascript/loops, javascript/conditionals]
checks:
  - id: honest-receipt
    type: stdout
    entry: main.js
    match: exact
    value: "3 items\nsubtotal: 19.75\nwith tax: 21.73\n"
  - id: every-finding-fixed
    type: ai-judge
    rubric: "All four finding families are resolved without changing the program's intent: (1) no `var` remains — bindings never reassigned are const, the accumulator (and a loop index, if one survives) is let or replaced by for...of; (2) the unused oldRate declaration is deleted entirely; (3) the no-undef typo is fixed so the loop genuinely accumulates into the declared total (total = total + ... or +=) — not by declaring a second variable to match the typo; (4) the == comparison became === comparing prices.length to the NUMBER 3, not the string \"3\". The prices array and taxRate value are unchanged, no numbers from the expected output are hardcoded into strings, and formatting is consistent (even indentation, statements terminated alike)."
hints:
  - "Take the findings one at a time, top to bottom, running between fixes. The no-undef one is the bug: `totl` silently creates a brand-new global and the real total never grows — that's why the receipt says 0.00."
  - "var → const everywhere nothing is reassigned; total stays let. The index loop can become for (const price of prices) — then there's no i to declare at all."
  - "eqeqeq: prices.length == \"3\" only works because == coerces. Compare number to number: prices.length === 3."
---
## The robot code reviewers

Two tools run on every professional JS repo before a human ever reviews
it. **ESLint** reads your code for *mistakes*: rules like `no-undef`
(you used a name that doesn't exist), `no-unused-vars` (you declared
one you never use), `no-var` (use `const`/`let`), `eqeqeq` (use `===`,
because `==` coerces types before comparing). **Prettier** handles
*formatting* — indentation, quotes, line width — by rewriting your file
on save, which ends every style argument a team could have. The split
matters: Prettier makes code look right, ESLint keeps it *being* right.
Both install as devDependencies, run as `npx eslint .` (config in
`eslint.config.js`) and `npx prettier --write .`, and live in your
editor so findings appear as you type.

Why teams bother is today's starter. It runs without a single error —
and prints a receipt that's quietly, completely wrong. One typo'd
variable name (`totl`) makes JavaScript invent a fresh global on every
loop pass while the real `total` stays 0. No crash. No warning. `npx
eslint` would have flagged that line before the program ever ran —
`no-undef` is a *bug detector* wearing a style-rule costume, and it's
the reason linting runs in CI next to the tests you met last lesson.

The runners here can't launch eslint's own binary, so today you *are*
the linter: the starter's header comment is the finding list a real
`npx eslint main.js` would print. Work through it like the tool would —
mechanically, one rule at a time, changing what the code *says* but
never what it *means*. When the subtotal comes back to life, you'll
know exactly which finding was load-bearing.

### Your goal

Fix every finding in the starter's lint report — `no-var` (six
places), `no-unused-vars`, `no-undef`, `eqeqeq` — leaving the data and
logic otherwise untouched, so the receipt finally tells the truth:

```
3 items
subtotal: 19.75
with tax: 21.73
```
