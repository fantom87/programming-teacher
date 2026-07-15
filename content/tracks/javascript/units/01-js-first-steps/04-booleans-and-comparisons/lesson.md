---
id: 04-booleans-and-comparisons
title: Booleans and Comparisons
language: javascript
runner: browser
estMinutes: 12
files:
  - path: main.js
    starter: starter/main.js
goal: "Using the given age and hasTicket constants, build four boolean constants with comparisons, &&, ||, and ===."
docs: [javascript/conditionals, javascript/variables-and-types]
checks:
  - id: boolean-variables
    type: tests
    entry: main.js
    testFile: tests/test_main.js
hints:
  - "A comparison like age >= 18 produces a value — true or false. Store it with const like any other value."
  - "&& needs both sides true; || needs at least one; === is strict equality (no type conversion)."
  - "const isTeen = age >= 13 && age <= 19; — the other three follow the same shape."
---
## The yes/no type

Meet JavaScript's smallest type: **booleans**. There are two values,
`true` and `false` (lowercase). You rarely type them — you *make* them
with comparisons:

```js
const age = 16;
console.log(age >= 18);   // false
console.log(age < 18);    // true
```

A comparison is an expression, so its answer can live in a variable:

```js
const isAdult = age >= 18;   // isAdult holds false
```

### Three equals signs?

JavaScript's equality check is `===` — yes, three. It asks "same value
**and** same type?":

```js
console.log(5 === 5);     // true
console.log("5" === 5);   // false — a string is never a number
```

There's an older two-equals `==` that silently converts types before
comparing (`"5" == 5` is `true`!). That "helpfulness" causes real bugs,
so modern JavaScript style is simple: **always `===`** (and `!==` for
"not equal").

### Combining answers

Compound questions use two symbols:

```js
age >= 13 && age <= 19    // AND — true only if BOTH sides are true
age >= 18 || hasTicket    // OR  — true if AT LEAST ONE side is true
```

### Your goal

The starter gives you `age = 16` and `hasTicket = true`. Build these four
constants from them (write comparisons — don't type `true`/`false`):

1. `isTeen` — age is between 13 and 19 (use `&&`)
2. `canWatch` — age is at least 18 *or* there's a ticket (use `||`)
3. `isAdult` — age is at least 18
4. `exactlyFive` — the string `"5"` compared to the number `5` with `===`

Print a few of them to see what they hold.
