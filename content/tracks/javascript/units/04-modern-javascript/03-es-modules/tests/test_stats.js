test("mean averages a list", () => {
  expect(mean([2, 4, 6])).toBe(4);
});

test("mean handles non-integer answers", () => {
  expect(mean([1, 2])).toBe(1.5);
});

test("median finds the middle of an odd-length list", () => {
  expect(median([9, 1, 5])).toBe(5);
});

test("median sorts NUMERICALLY, not alphabetically", () => {
  expect(median([100, 2, 30])).toBe(30);
});

test("median never mutates the caller's array", () => {
  const laps = [3, 1, 2];
  median(laps);
  expect(laps).toEqual([3, 1, 2]);
});

test("summarize reports through mean and median", () => {
  expect(summarize([1, 2, 3])).toBe("3 runs — mean 2, median 2");
});
