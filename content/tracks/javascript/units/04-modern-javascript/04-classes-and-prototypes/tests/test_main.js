test("the constructor stores title and pages", () => {
  const b = new Book("Piranesi", 245);
  expect(b.title).toBe("Piranesi");
  expect(b.pages).toBe(245);
});

test("describe reads from this", () => {
  expect(new Book("Kindred", 264).describe()).toBe("Kindred (264 pages)");
});

test("an Audiobook is also a Book", () => {
  expect(new Audiobook("A", 1, "Sam") instanceof Book).toBeTruthy();
});

test("Audiobook keeps Book's setup via super", () => {
  const a = new Audiobook("Solaris", 204, "Rey");
  expect(a.title).toBe("Solaris");
  expect(a.pages).toBe(204);
  expect(a.narrator).toBe("Rey");
});

test("the override builds on super.describe()", () => {
  expect(new Audiobook("Solaris", 204, "Rey").describe()).toBe(
    "Solaris (204 pages), read by Rey",
  );
});

test("methods live ONCE, on the prototype", () => {
  expect(new Book("a", 1).describe).toBe(new Book("b", 2).describe);
});
