test("square is a function", () => {
  expect(typeof square).toBe("function");
});

test("square(5) returns 25", () => {
  expect(square(5)).toBe(25);
});

test("square(9) returns 81", () => {
  expect(square(9)).toBe(81);
});

test("half(10) returns 5", () => {
  expect(half(10)).toBe(5);
});

test("half(7) returns 3.5", () => {
  expect(half(7)).toBe(3.5);
});

test("shout(\"hi\") returns \"HI!\"", () => {
  expect(shout("hi")).toBe("HI!");
});

test("shout(\"wow\") returns \"WOW!\"", () => {
  expect(shout("wow")).toBe("WOW!");
});
