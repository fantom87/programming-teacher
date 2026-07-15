test("player is an object", () => {
  expect(typeof player).toBe("object");
});

test("player.name is \"Ada\"", () => {
  expect(player.name).toBe("Ada");
});

test("player.score ended up at 150", () => {
  expect(player.score).toBe(150);
});

test("player.level went from 1 to 2", () => {
  expect(player.level).toBe(2);
});
