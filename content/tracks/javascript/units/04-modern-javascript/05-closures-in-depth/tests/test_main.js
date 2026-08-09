test("deposit and withdraw share one private balance", () => {
  const b = makeBank(10);
  b.deposit(40);
  expect(b.withdraw(20)).toBe(30);
  expect(b.balance()).toBe(30);
});

test("overdrafts are declined and change nothing", () => {
  const b = makeBank(50);
  expect(b.withdraw(60)).toBe("declined");
  expect(b.balance()).toBe(50);
});

test("two banks never share a vault", () => {
  const a = makeBank(100);
  const c = makeBank(1);
  a.deposit(5);
  expect(c.balance()).toBe(1);
  expect(a.balance()).toBe(105);
});

test("the money lives in the closure, not on the object", () => {
  const b = makeBank(75);
  expect(JSON.stringify(b)).toBe("{}");
  expect(b.balance()).toBe(75);
});

test("once runs the function a single time", () => {
  let calls = 0;
  const double = once((n) => {
    calls += 1;
    return n * 2;
  });
  expect(double(21)).toBe(42);
  expect(double(999)).toBe(42);
  expect(calls).toBe(1);
});

test("each wrapped function gets its own memory", () => {
  const a = once(() => "a");
  const b = once(() => "b");
  a();
  expect(b()).toBe("b");
});
