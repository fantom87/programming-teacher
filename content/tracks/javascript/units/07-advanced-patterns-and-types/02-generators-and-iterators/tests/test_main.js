test("countdown yields from down to 1, in order", () => {
  expect([...countdown(4)]).toEqual([4, 3, 2, 1]);
});

test("countdown speaks the iterator protocol", () => {
  const it = countdown(2);
  expect(it.next()).toEqual({ value: 2, done: false });
  expect(it.next()).toEqual({ value: 1, done: false });
  expect(it.next().done).toBeTruthy();
});

test("take pulls exactly count values from an INFINITE generator", () => {
  expect([...take(naturals(), 4)]).toEqual([1, 2, 3, 4]);
});

test("naturals starts at 1 and keeps counting", () => {
  const it = naturals();
  it.next();
  it.next();
  expect(it.next().value).toBe(3);
});

test("take stops early when the source runs dry", () => {
  expect([...take(["a"], 5)]).toEqual(["a"]);
});

test("take works on plain arrays too", () => {
  expect([...take([10, 20, 30], 2)]).toEqual([10, 20]);
});
