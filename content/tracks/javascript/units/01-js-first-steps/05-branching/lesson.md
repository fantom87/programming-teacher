---
id: 05-branching
title: Branching
language: javascript
runner: browser
estMinutes: 15
files:
  - path: main.js
    starter: starter/main.js
goal: "Write an if/else if/else chain that turns the given temperature of 35 into an advice variable holding Stay hydrated, then print it."
docs: [javascript/conditionals]
checks:
  - id: advice-correct
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-advice
    type: stdout
    entry: main.js
    match: exact
    value: "Stay hydrated\n"
hints:
  - "The shape is: if (condition) { ...set advice... } — condition in parentheses, block in curly braces."
  - "else if means \"otherwise, check this\" — JavaScript runs the FIRST block whose condition is true, then skips the rest."
  - "if (temperature >= 30) { advice = \"Stay hydrated\"; } else if (temperature >= 15) { advice = \"Nice day\"; } else { advice = \"Bring a jacket\"; }"
---
## Programs that choose

Until now, every line of your program runs, every time. The `if` statement
gives your code a fork in the road — a block that runs **only when** a
condition is `true`:

```js
const temperature = 35;
if (temperature >= 30) {
  console.log("It's hot!");
}
```

The anatomy: condition in **parentheses**, then the block in **curly
braces**. The braces mark exactly which lines belong to the `if`.

### More than two roads

Chain choices with `else if` and `else`. JavaScript checks each condition
top to bottom, runs the **first** block that matches, and skips the rest:

```js
if (temperature >= 30) {
  console.log("Hot");
} else if (temperature >= 15) {
  console.log("Mild");
} else {
  console.log("Cold");
}
```

Order matters — by the time the `else if` is checked, you already know
the temperature isn't 30 or more, so there's no need to write `>= 15 &&
< 30`. The chain handles it.

Branches can set variables, not just print. Declare the variable with
`let` *before* the chain (it needs to exist outside the braces), then
assign inside:

```js
let label;
if (temperature >= 30) {
  label = "hot";
} else {
  label = "not hot";
}
```

### Your goal

The starter sets `temperature = 35` (leave it alone). Declare `advice`
with `let`, then write one `if / else if / else` chain:

- 30 or above → `"Stay hydrated"`
- 15 up to 29 → `"Nice day"`
- below 15 → `"Bring a jacket"`

Then print `advice`. At 35 degrees, your output should be exactly
`Stay hydrated`.
