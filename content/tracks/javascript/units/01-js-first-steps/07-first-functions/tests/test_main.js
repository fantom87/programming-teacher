test("double is a function", () => {
  expect(typeof double).toBe("function");
});

test("double(4) returns 8", () => {
  expect(double(4)).toBe(8);
});

test("double(10) returns 20", () => {
  expect(double(10)).toBe(20);
});

test("greet(\"Ada\") returns \"Hello, Ada!\"", () => {
  expect(greet("Ada")).toBe("Hello, Ada!");
});

test("greet(\"Sam\") returns \"Hello, Sam!\"", () => {
  expect(greet("Sam")).toBe("Hello, Sam!");
});
