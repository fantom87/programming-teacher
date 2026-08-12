---
id: 01-the-board
title: The board
goal: Write createGame() so it builds a game object, and render() so it draws that board as text.
estMinutes: 15
docs: [javascript/arrays, javascript/objects]
checks:
  - id: board-and-render
    type: tests
    entry: snake.js
    testFile: tests.js
hints:
  - "createGame just returns an object. Every field it needs is listed in the comment above the function."
  - "For render, build one string per row, then join them: rows.join(\"\\n\"). A row is width characters long."
  - "To decide what character a square gets, ask: is any snake square at this x and y? Is the food here? Otherwise it's a dot. game.snake.some(s => s.x === x && s.y === y) answers the first one."
---
## Start with the shape of the thing

Before anything moves, you need something to move *around*. That's this stage:
a game object, and a way to look at it.

### The game object

Everything about a running game lives in one plain object:

```js
{
  width: 10,
  height: 10,
  snake: [{ x: 5, y: 5 }],   // head first
  direction: "right",
  food: null,
  score: 0,
}
```

That's the whole game. `snake` is an array of squares and the **first one is the
head** — that ordering matters a lot in the next stage, so it's worth fixing in
your mind now.

Start the snake as a single square near the middle: `Math.floor(width / 2)` and
`Math.floor(height / 2)`.

### Drawing it

`render(game)` turns that object into a string you can print:

```
....
..#.
....
```

One line per row, `#` for snake, `*` for food, `.` for empty, rows joined with
`\n` and no newline at the end.

The natural shape is a loop over rows, and inside it a loop over columns,
building a string as you go. For each square you're answering one question:
what's here?

### Your goal

Write both functions. When they work, `render(createGame(10, 10))` should give
you a 10-line square of dots with a single `#` in the middle — the first time
you'll actually see your game.
