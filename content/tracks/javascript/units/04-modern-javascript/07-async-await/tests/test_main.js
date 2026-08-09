test("step returns a Promise (async functions always do)", () => {
  expect(step("check", 1) instanceof Promise).toBeTruthy();
});

test("makeBreakfast is async too", () => {
  expect(makeBreakfast() instanceof Promise).toBeTruthy();
});
