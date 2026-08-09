test("sum totals a numbers array", () => {
  expect(sum([1, 2, 3, 4])).toBe(10);
});

test("sum of an empty array is 0 (starting value!)", () => {
  expect(sum([])).toBe(0);
});

test("sum of a single number is that number", () => {
  expect(sum([7])).toBe(7);
});

test("totalScore adds up player scores", () => {
  const team = [
    { name: "a", score: 10 },
    { name: "b", score: 5 },
  ];
  expect(totalScore(team)).toBe(15);
});

test("totalScore of an empty roster is 0", () => {
  expect(totalScore([])).toBe(0);
});
