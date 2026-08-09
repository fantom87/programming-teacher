test("delay hands back a real Promise", () => {
  const p = delay(1);
  expect(p instanceof Promise).toBeTruthy();
  expect(typeof p.then).toBe("function");
});

test("finishLine is async (always a Promise)", () => {
  expect(finishLine() instanceof Promise).toBeTruthy();
});

test("trace returns nothing — its work is all queueing", () => {
  expect(trace()).toBe(undefined);
});
