test("placeFood puts food on the board", () => {
  const g = createGame(5, 5);
  placeFood(g, 1, 4);
  expect(g.food).toEqual({ x: 1, y: 4 });
});

test("eating grows the snake by one", () => {
  const g = createGame(6, 6);
  g.snake = [{ x: 2, y: 0 }, { x: 1, y: 0 }];
  g.direction = "right";
  placeFood(g, 3, 0);
  step(g);
  expect(g.snake.length).toBe(3);
});

test("eating scores a point and clears the food", () => {
  const g = createGame(6, 6);
  g.snake = [{ x: 2, y: 0 }];
  g.direction = "right";
  placeFood(g, 3, 0);
  step(g);
  expect(g.score).toBe(1);
  expect(g.food).toBe(null);
});

test("the grown snake keeps its old tail", () => {
  const g = createGame(6, 6);
  g.snake = [{ x: 2, y: 0 }, { x: 1, y: 0 }];
  g.direction = "right";
  placeFood(g, 3, 0);
  step(g);
  expect(g.snake).toEqual([{ x: 3, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 0 }]);
});

test("moving onto an empty square still doesn't grow", () => {
  const g = createGame(6, 6);
  g.snake = [{ x: 2, y: 0 }, { x: 1, y: 0 }];
  g.direction = "right";
  placeFood(g, 5, 5);
  step(g);
  expect(g.snake.length).toBe(2);
  expect(g.score).toBe(0);
  expect(g.food).toEqual({ x: 5, y: 5 });
});

test("earlier stages still work", () => {
  const g = createGame(4, 4);
  g.snake = [{ x: 3, y: 1 }];
  g.direction = "right";
  step(g);
  expect(g.snake[0]).toEqual({ x: 0, y: 1 });
  expect(render(createGame(2, 1))).toBe(".#");
});
