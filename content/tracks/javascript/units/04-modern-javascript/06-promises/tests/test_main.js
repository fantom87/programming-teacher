test("wait returns a Promise", () => {
  expect(wait(5) instanceof Promise).toBeTruthy();
});

test("brew returns a Promise too (then-chains always do)", () => {
  expect(brew("tea", 5) instanceof Promise).toBeTruthy();
});
