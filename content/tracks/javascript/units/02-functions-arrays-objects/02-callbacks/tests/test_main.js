test("applyTwice applies the function two times", () => {
  expect(applyTwice((n) => n + 1, 0)).toBe(2);
});

test("applyTwice works with any callback", () => {
  expect(applyTwice((s) => s + "!", "hey")).toBe("hey!!");
});

test("applyTwice returns the result (doesn't just print it)", () => {
  expect(applyTwice((n) => n * 3, 2)).toBe(18);
});

test("forEachItem calls the callback once per item, in order", () => {
  const seen = [];
  forEachItem([1, 2, 3], (n) => seen.push(n * 2));
  expect(seen).toEqual([2, 4, 6]);
});

test("forEachItem does nothing for an empty array", () => {
  const seen = [];
  forEachItem([], (item) => seen.push(item));
  expect(seen).toEqual([]);
});
