test("makeCounter returns a function", () => {
  expect(typeof makeCounter()).toBe("function");
});

test("a fresh counter counts 1, 2, 3", () => {
  const c = makeCounter();
  expect(c()).toBe(1);
  expect(c()).toBe(2);
  expect(c()).toBe(3);
});

test("two counters keep SEPARATE private counts", () => {
  const a = makeCounter();
  const b = makeCounter();
  a();
  a();
  expect(b()).toBe(1);
  expect(a()).toBe(3);
});

test("makeTagger builds a tagging function", () => {
  const info = makeTagger("INFO");
  expect(info("server started")).toBe("[INFO] server started");
});

test("each tagger remembers its own tag", () => {
  const a = makeTagger("A");
  const b = makeTagger("B");
  expect(a("x")).toBe("[A] x");
  expect(b("y")).toBe("[B] y");
});
