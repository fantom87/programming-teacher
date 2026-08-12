test("step moves the head one square to the right", () => {
  const g = createGame(6, 6);
  g.snake = [{ x: 2, y: 2 }];
  g.direction = "right";
  step(g);
  expect(g.snake[0]).toEqual({ x: 3, y: 2 });
});

test("up is minus one on y, not plus one", () => {
  const g = createGame(6, 6);
  g.snake = [{ x: 2, y: 2 }];
  g.direction = "up";
  step(g);
  expect(g.snake[0]).toEqual({ x: 2, y: 1 });
});

test("left and down go the other ways", () => {
  const g = createGame(6, 6);
  g.snake = [{ x: 2, y: 2 }];
  g.direction = "left";
  step(g);
  expect(g.snake[0]).toEqual({ x: 1, y: 2 });
  g.direction = "down";
  step(g);
  expect(g.snake[0]).toEqual({ x: 1, y: 3 });
});

test("the snake keeps its length — the tail follows the head", () => {
  const g = createGame(6, 6);
  g.snake = [{ x: 3, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 0 }];
  g.direction = "right";
  step(g);
  expect(g.snake.length).toBe(3);
  expect(g.snake).toEqual([{ x: 4, y: 0 }, { x: 3, y: 0 }, { x: 2, y: 0 }]);
});

test("walking off the right edge comes back on the left", () => {
  const g = createGame(4, 4);
  g.snake = [{ x: 3, y: 1 }];
  g.direction = "right";
  step(g);
  expect(g.snake[0]).toEqual({ x: 0, y: 1 });
});

test("walking off the top comes back on the bottom", () => {
  const g = createGame(4, 4);
  g.snake = [{ x: 1, y: 0 }];
  g.direction = "up";
  step(g);
  expect(g.snake[0]).toEqual({ x: 1, y: 3 });
});

test("stage 1 still works", () => {
  const g = createGame(3, 3);
  g.snake = [{ x: 0, y: 0 }];
  expect(render(g)).toBe("#..\n...\n...");
});
