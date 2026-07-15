---
id: 02-values-and-variables
title: Values and Variables
language: javascript
runner: browser
estMinutes: 12
files:
  - path: main.js
    starter: starter/main.js
goal: "Create a `name` variable with let, a `birthYear` constant with const, and print both — then reassign `name` and print it again."
docs: [javascript/variables-and-types, concepts/naming-things]
checks:
  - id: prints-three-lines
    type: stdout
    entry: main.js
    match: regex
    value: "^.+\\n\\d{4}\\n.+\\n$"
hints:
  - "let creates a variable you can change later; const creates one you can't."
  - "Reassigning looks like: name = \"Something new\";  (no let the second time)"
  - "Print a variable by passing its name without quotes: console.log(name);"
---
## Remembering things

Programs need memory. A **variable** is a named box you can put a value in:

```js
let color = "blue";   // make a box called color, put "blue" in it
console.log(color);    // prints: blue
```

`let` means the box's contents can change later:

```js
color = "green";       // same box, new contents (no `let` this time)
```

`const` makes a box that can **never** be changed — perfect for things that
shouldn't drift, like a birth year:

```js
const birthYear = 1987;
```

Try changing a `const` and running — the error you get is one you'll meet
many times. Reading it now, on purpose, takes away its power.

### Your goal

1. Create a variable `name` with `let`, holding your name.
2. Create a constant `birthYear` with `const`, holding a 4-digit year.
3. Print `name`, then `birthYear`.
4. Reassign `name` to something new, and print it again.

Your output should be three lines: a name, a year, a different name.
