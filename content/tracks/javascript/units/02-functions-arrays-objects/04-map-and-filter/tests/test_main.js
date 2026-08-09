test("doubleAll doubles every number", () => {
  expect(doubleAll([1, 2, 3])).toEqual([2, 4, 6]);
});

test("doubleAll of an empty array is an empty array", () => {
  expect(doubleAll([])).toEqual([]);
});

test("doubleAll returns a NEW array — the original is untouched", () => {
  const original = [3, 5];
  doubleAll(original);
  expect(original).toEqual([3, 5]);
});

test("evensOnly keeps only even numbers", () => {
  expect(evensOnly([1, 2, 3, 4, 5, 6])).toEqual([2, 4, 6]);
});

test("evensOnly of all-odd numbers is empty", () => {
  expect(evensOnly([1, 3, 5])).toEqual([]);
});

test("shoutAll uppercases and adds !", () => {
  expect(shoutAll(["hi", "yo"])).toEqual(["HI!", "YO!"]);
});
