---
id: 03-numbers-and-strings
title: Numbers and Strings
language: javascript
runner: browser
estMinutes: 12
files:
  - path: main.js
    starter: starter/main.js
goal: "Compute 7 * 6 into a variable and print `The answer is 42` using a template literal."
docs: [javascript/numbers, javascript/strings]
checks:
  - id: prints-answer
    type: stdout
    entry: main.js
    match: exact
    value: "The answer is 42\n"
hints:
  - "Multiplication uses the * symbol: 7 * 6"
  - "A template literal uses backticks and ${...}: `The answer is ${answer}`"
  - "Backtick is the key above Tab on most keyboards."
---
## Math and text, together

JavaScript does arithmetic with the symbols you'd expect — plus one surprise:

```js
console.log(2 + 3);   // 5
console.log(10 - 4);  // 6
console.log(7 * 6);   // 42   (* means multiply)
console.log(9 / 2);   // 4.5  (real division, no rounding)
```

You can store a computation in a variable:

```js
const total = 4 * 25;
```

### Putting values inside text

The clumsy way is gluing strings with `+`. The modern way is a
**template literal** — text in backticks where `${...}` drops a value in:

```js
const total = 4 * 25;
console.log(`You scored ${total} points`);  // You scored 100 points
```

### Your goal

1. Create a variable `answer` holding the result of `7 * 6` — write the
   multiplication, don't just type 42.
2. Use a template literal to print exactly:

```
The answer is 42
```
