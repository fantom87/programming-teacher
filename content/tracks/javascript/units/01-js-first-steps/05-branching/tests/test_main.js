test("temperature is still 35", () => {
  expect(temperature).toBe(35);
});

test("advice equals \"Stay hydrated\" at 35 degrees", () => {
  expect(advice).toBe("Stay hydrated");
});
