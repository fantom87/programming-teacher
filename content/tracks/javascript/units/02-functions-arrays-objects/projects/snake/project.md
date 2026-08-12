---
id: snake
title: Build Snake
language: javascript
runner: browser
entry: snake.js
summary: Build the game logic behind Snake — a board, a moving snake, food and a score — one piece at a time.
workspace: workspace
stages:
  - 01-the-board
  - 02-move-the-snake
  - 03-eat-and-grow
estMinutes: 50
---
## The game you're building

Snake is the game where you steer a growing line around a grid, eating food and
trying not to bite yourself. It's a good first project because the whole thing
is *arrays and functions* — the two things this unit is about — and because you
can hold the entire game in your head.

You'll build it in three stages:

1. **The board** — a grid, and a way to draw it as text so you can see it.
2. **Moving** — the snake slithers one square at a time in the direction you set.
3. **Eating and growing** — food, a longer snake, and a score.

## How a project works

Unlike a lesson, **this is one program that you keep**. Your code carries from
each stage into the next — including the parts you did your own way. Each stage
adds a goal and its own checks; finishing all three finishes the project.

There's no drawing on screen here and no arrow keys yet. That's on purpose: the
*logic* is the hard part and the part worth testing. Once these three stages
pass, hooking the same functions up to a canvas and a keydown listener is a
short afternoon — and by then you'll understand exactly what you're hooking up.

One rule worth knowing before you start: **keep the exported function names**.
Everything inside them is yours to write however you like, but the checks call
them by name.
