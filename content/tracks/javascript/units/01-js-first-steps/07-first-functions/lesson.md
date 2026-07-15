---
id: 07-first-functions
title: First Functions
language: javascript
runner: browser
estMinutes: 15
files:
  - path: main.js
    starter: starter/main.js
goal: "Write two functions — double(n) returning n * 2, and greet(name) returning Hello, <name>! — then call both and print the results."
docs: [javascript/functions-and-closures, concepts/naming-things]
checks:
  - id: functions-work
    type: tests
    entry: main.js
    testFile: tests/test_main.js
hints:
  - "The shape: function double(n) { return n * 2; } — the parameter n is a placeholder for whatever you pass in."
  - "return hands a value BACK to the caller; console.log only displays it. The checks call your functions and look at what they return."
  - "greet builds its answer with a template literal: return `Hello, ${name}!`;"
---
## Teaching the computer a new trick

So far you've used built-in abilities like `console.log`. A **function**
is an ability you define yourself — a named recipe your program can run
whenever it wants:

```js
function double(n) {
  return n * 2;
}

console.log(double(5));    // 10
console.log(double(21));   // 42
```

Three parts to notice:

- **`function double(n)`** — the name, and a **parameter** `n`: a
  placeholder variable that receives whatever value you pass in.
- **`return`** — hands the answer back to whoever called. The function's
  job ends the instant `return` runs.
- **`double(5)`** — the **call**. The whole expression *becomes* the
  returned value, so you can print it, store it, or pass it along.

### Return, don't print

This trips up every beginner once, so let's face it head-on:
`console.log` *shows* a value on the screen; `return` *gives* the value
back to the code that asked. A function that prints instead of returning
is like a calculator that shouts the answer at a stranger instead of
showing you. The checks for this lesson call your functions directly and
inspect what comes back — so make sure you `return`.

### Your goal

Write two functions, then call each at least once and print the results:

1. `double(n)` — **returns** `n * 2`
2. `greet(name)` — **returns** the string `Hello, <name>!` — so
   `greet("Ada")` returns `"Hello, Ada!"` (template literal time)
