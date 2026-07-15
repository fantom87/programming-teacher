test("colors is an array", () => {
  expect(Array.isArray(colors)).toBe(true);
});

test("colors ends up with all four items in order", () => {
  expect(colors).toEqual(["red", "green", "blue", "yellow"]);
});

test("colors[0] is \"red\"", () => {
  expect(colors[0]).toBe("red");
});

test("\"yellow\" was pushed to the end", () => {
  expect(colors[3]).toBe("yellow");
});

test("colors.length is 4 after the push", () => {
  expect(colors.length).toBe(4);
});
