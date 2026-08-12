// Snake — the game logic.
//
// You'll fill this in over three stages. Each stage tells you which function to
// write next; the ones you've already written stay exactly as you left them.
//
// Keep the function NAMES as they are — the checks call them by name. What goes
// inside is yours.

/**
 * Build a fresh game.
 *
 * A game is a plain object shaped like this:
 *   { width, height, snake: [{ x, y }], direction: "right", food: null, score: 0 }
 *
 * The snake is an array of squares, HEAD FIRST. Start it as a single square in
 * roughly the middle of the board: x = half the width, y = half the height,
 * rounded down.
 */
function createGame(width, height) {
  return {
    width,
    height,
    snake: [{ x: Math.floor(width / 2), y: Math.floor(height / 2) }],
    direction: "right",
    food: null,
    score: 0,
  };
}

/**
 * Draw the board as a string so you can actually see it.
 *
 * One line per row, "#" for a snake square, "*" for food, "." for empty.
 * Lines are joined with "\n" and there's no newline on the end.
 */
function render(game) {
  const rows = [];
  for (let y = 0; y < game.height; y++) {
    let row = "";
    for (let x = 0; x < game.width; x++) {
      if (game.snake.some((part) => part.x === x && part.y === y)) row += "#";
      else if (game.food && game.food.x === x && game.food.y === y) row += "*";
      else row += ".";
    }
    rows.push(row);
  }
  return rows.join("\n");
}
