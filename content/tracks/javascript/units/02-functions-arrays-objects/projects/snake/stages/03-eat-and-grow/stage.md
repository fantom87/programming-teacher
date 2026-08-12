---
id: 03-eat-and-grow
title: Eat and grow
goal: Make the snake grow and the score go up when the head lands on food, and write placeFood() to put the next one down.
estMinutes: 15
docs: [javascript/arrays, javascript/objects]
checks:
  - id: eating
    type: tests
    entry: snake.js
    testFile: tests.js
hints:
  - "You already have the growth mechanic — it's the pop() in step(). Skip the pop and the snake keeps the square it just gained."
  - "Check for food AFTER working out the new head but using the head's new position: if the food is there, score += 1, food = null, and don't pop."
  - "placeFood(game, x, y) is a one-liner. It exists so the game has one place that decides where food goes — later you can make it random without touching step()."
---
## The one-line change that makes it a game

Right now your snake slides around forever, exactly the same length, with
nothing to do. One line stands between that and an actual game.

Look at `step()`. Every move you `unshift()` a new head and `pop()` the tail —
grow at the front, shrink at the back, length unchanged. So:

> **To grow the snake, just don't pop.**

That's it. The square it gained at the front stays, and the snake is one longer.

### What eating looks like

After you work out the new head position, ask whether the food is sitting
there. If it is:

- don't `pop()` — the snake grows by one
- add one to `game.score`
- set `game.food` to `null`, because it's been eaten

If it isn't, `pop()` as before.

### Putting food down

`placeFood(game, x, y)` sets `game.food` to that square. It's barely a function,
and that's fine — it exists so there's *one* place that decides where food
appears. When you later want food to land somewhere random, you change this
function and nothing else. That's worth more than the line it saves.

### Your goal

Teach `step()` to eat, and add `placeFood()`. When it works you'll have a
complete game loop: place food, steer, eat, grow, repeat.

### Where this goes next

You now have every rule of Snake as plain functions with tests around them.
What's missing is only the *presentation* — a canvas to draw on instead of
`render()`, a `keydown` listener to set `game.direction`, and a `setInterval`
calling `step()`. None of that is game logic, and none of it can break the
rules you've just proven. That's what a good separation buys you.
