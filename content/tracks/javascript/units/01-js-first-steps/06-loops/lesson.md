---
id: 06-loops
title: Loops
language: javascript
runner: browser
estMinutes: 15
files:
  - path: main.js
    starter: starter/main.js
goal: "Print 1 through 5 with a for loop, count 3 down to 1 with a while loop, then print Liftoff! once."
docs: [javascript/loops]
checks:
  - id: prints-loops-output
    type: stdout
    entry: main.js
    match: exact
    value: "1\n2\n3\n4\n5\n3\n2\n1\nLiftoff!\n"
hints:
  - "The counting for loop: for (let i = 1; i <= 5; i++) { console.log(i); }"
  - "For the countdown, make a variable first — let countdown = 3; — then while (countdown > 0) print it and subtract 1."
  - "console.log(\"Liftoff!\") goes AFTER the while loop's closing brace, so it runs once."
---
## Repeat without repeating yourself

Printing 1 through 5 with five `console.log` lines works. Printing 1
through 500 that way is a punishment. Loops are how programs repeat, and
JavaScript's counting workhorse is the `for` loop:

```js
for (let i = 1; i <= 3; i++) {
  console.log(i);   // 1, 2, 3
}
```

The parentheses hold three parts, separated by semicolons:

1. `let i = 1` — **start**: make a counter
2. `i <= 3` — **keep going while** this is true
3. `i++` — **each trip**: add 1 to the counter (`i++` is shorthand for
   `i = i + 1`)

Read it aloud: "start `i` at 1; while `i` is at most 3; add 1 each time."

### When you don't know the trip count

The `while` loop is simpler: just a condition. It keeps going as long as
the condition is true — so something inside must change, or it loops
forever:

```js
let fuel = 3;
while (fuel > 0) {
  console.log(fuel);
  fuel--;             // fuel = fuel - 1
}
```

That prints `3, 2, 1` — a countdown. Code after the closing brace runs
once, when the loop is done.

### Your goal

Three stages, in order:

1. A `for` loop printing **1 through 5**, one per line.
2. A `while` loop counting **3 down to 1**, one per line.
3. After the while loop, print `Liftoff!` once.

```
1
2
3
4
5
3
2
1
Liftoff!
```
