test("isTeen is true (16 is between 13 and 19)", () => {
  expect(isTeen).toBe(true);
});

test("canWatch is true (the ticket saves the day)", () => {
  expect(canWatch).toBe(true);
});

test("isAdult is false (16 is not 18 yet)", () => {
  expect(isAdult).toBe(false);
});

test("exactlyFive is false (=== never converts types)", () => {
  expect(exactlyFive).toBe(false);
});
