test("wait returns a Promise", () => {
  expect(wait(1) instanceof Promise).toBeTruthy();
});

test("ping returns a Promise (async functions always do)", () => {
  expect(ping("probe", 1) instanceof Promise).toBeTruthy();
});

test("a failing ping still hands back a Promise, not a throw-on-call", () => {
  const p = ping("probe", 1, false);
  expect(p instanceof Promise).toBeTruthy();
  p.catch(() => {}); // consume the rejection so nothing crashes after the tests
});
