// Snake — the game logic.
//
// Keep the function NAMES as they are — the checks call them by name. What goes
// inside is yours.

/** Which way each direction pushes the head. Screen y counts downwards. */
const MOVES = {
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 },
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
};

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

/** Drop food on a square. One function owns this so making it random later
 *  doesn't mean touching step(). */
function placeFood(game, x, y) {
  game.food = { x, y };
}

/**
 * Move the snake one square: grow at the head, shrink at the tail — unless the
 * head just landed on food, in which case skipping the pop IS the growth.
 *
 * Adding the width/height before taking the remainder is what makes the wrap
 * work going left and up — in JavaScript, -1 % 10 is -1, not 9.
 */
function step(game) {
  const move = MOVES[game.direction];
  const head = game.snake[0];
  const next = {
    x: (head.x + move.x + game.width) % game.width,
    y: (head.y + move.y + game.height) % game.height,
  };
  game.snake.unshift(next);

  const eating = game.food && game.food.x === next.x && game.food.y === next.y;
  if (eating) {
    game.score += 1;
    game.food = null;
  } else {
    game.snake.pop();
  }
}
