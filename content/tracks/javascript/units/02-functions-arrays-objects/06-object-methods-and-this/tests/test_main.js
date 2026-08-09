test("hero starts as Ada", () => {
  expect(hero.name).toBe("Ada");
});

test("describe() builds the string from this", () => {
  expect(hero.describe()).toBe("Ada has 50 points");
});

test("addPoints(10) raises the score to 60", () => {
  hero.addPoints(10);
  expect(hero.score).toBe(60);
});

test("describe() reflects the NEW score (not a hardcoded string)", () => {
  expect(hero.describe()).toBe("Ada has 60 points");
});

test("addPoints works with any amount", () => {
  hero.addPoints(40);
  expect(hero.describe()).toBe("Ada has 100 points");
});
