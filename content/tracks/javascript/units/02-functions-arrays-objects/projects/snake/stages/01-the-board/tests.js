test("createGame remembers the board size", () => {
  const g = createGame(5, 3);
  expect(g.width).toBe(5);
  expect(g.height).toBe(3);
});

test("a new game starts with one snake square, in the middle", () => {
  const g = createGame(10, 6);
  expect(g.snake.length).toBe(1);
  expect(g.snake[0]).toEqual({ x: 5, y: 3 });
});

test("a new game has no food, no score, and heads right", () => {
  const g = createGame(8, 8);
  expect(g.food).toBe(null);
  expect(g.score).toBe(0);
  expect(g.direction).toBe("right");
});

test("render draws the snake on an empty board", () => {
  const g = createGame(3, 3);
  g.snake = [{ x: 0, y: 0 }];
  expect(render(g)).toBe("#..\n...\n...");
});

test("render draws food, and gets rows and columns the right way round", () => {
  const g = createGame(3, 2);
  g.snake = [{ x: 2, y: 1 }];
  g.food = { x: 0, y: 0 };
  expect(render(g)).toBe("*..\n..#");
});

test("render draws every square of a longer snake", () => {
  const g = createGame(4, 2);
  g.snake = [{ x: 2, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 0 }];
  expect(render(g)).toBe("###.\n....");
});
