---
id: 01-hello-javascript
title: Hello, JavaScript
language: javascript
runner: browser
estMinutes: 10
files:
  - path: main.js
    starter: starter/main.js
goal: "Use console.log to print exactly: Hello, JavaScript!"
docs: [concepts/what-is-a-program, javascript/syntax-cheatsheet]
checks:
  - id: prints-hello
    type: stdout
    entry: main.js
    match: exact
    value: "Hello, JavaScript!\n"
hints:
  - "console.log(...) prints whatever you put between the parentheses."
  - "Text (a *string*) must be wrapped in quotes: \"like this\"."
  - "The exact line is: console.log(\"Hello, JavaScript!\");"
---
## Your first program

A **program** is a list of instructions the computer follows, top to bottom.

Right now the editor has one instruction in it — but it's wrapped in `//`, which
makes it a **comment**: a note for humans that the computer skips.

Your first job:

1. Write an instruction that prints text to the output.
2. In JavaScript, that instruction is `console.log(...)`.

For example, this prints the word *hi*:

```js
console.log("hi");
```

The quotes matter — they tell JavaScript "this is text, not code."

### Your goal

Make the program print exactly:

```
Hello, JavaScript!
```

Press **Run** (or `Ctrl+Enter`) to try it. You can run as many times as you like —
running code is free, and mistakes are how this works.
