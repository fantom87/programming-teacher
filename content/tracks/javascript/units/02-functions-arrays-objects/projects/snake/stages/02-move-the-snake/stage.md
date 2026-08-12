---
id: 02-move-the-snake
title: Move the snake
goal: Write step() so the snake slides one square in its current direction, and wraps around the edges instead of falling off.
estMinutes: 20
docs: [javascript/arrays, javascript/functions-and-closures]
checks:
  - id: movement
    type: tests
    entry: snake.js
    testFile: tests.js
hints:
  - "Movement is: work out where the head is going, put that square on the FRONT of the array, and take one off the BACK. unshift() and pop() are the two methods you want."
  - "A direction is just a change in x and y. \"right\" means x + 1, \"up\" means y - 1. A lookup object — { right: { x: 1, y: 0 }, ... } — beats four if statements."
  - "Wrapping is the remainder operator. (x + width) % width keeps x on the board going both ways; the + width is what saves you at x = -1."
---
## Making it move

Here's the trick that makes Snake simple, and it's genuinely delightful: **the
snake doesn't move — it grows at the front and shrinks at the back.**

Every step:

1. Work out the square in front of the head.
2. `unshift()` it onto the front of the array.
3. `pop()` the last square off the back.

The array is the same length it was, every square has shifted along by one, and
you never had to move anything. That's the whole animation.

### Directions

`game.direction` is one of `"up"`, `"down"`, `"left"`, `"right"`. Each one is
really just a pair of numbers to add to the head:

| direction | x | y |
|---|---|---|
| `"right"` | +1 | 0 |
| `"left"` | −1 | 0 |
| `"up"` | 0 | −1 |
| `"down"` | 0 | +1 |

Note `"up"` is **minus** one on y. Screen coordinates count downwards — row 0 is
the top — and this catches everyone at least once.

Four `if` statements would work here. An object that maps each direction to its
pair is nicer, and it's the kind of thing this unit is about:

```js
const MOVES = {
  right: { x: 1, y: 0 },
  // ...
};
```

### Falling off the edge

If the head walks off the right-hand side, it should come back on the left. The
remainder operator does this in one expression, but watch the negative case:
`-1 % 10` is `-1` in JavaScript, not `9`. Adding the width first fixes it —
`(x + width) % width`.

### Your goal

Write `step(game)`. It changes the game in place (no need to return anything)
and moves the snake exactly one square. Length stays the same — eating comes
next stage.
