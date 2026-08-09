test("lowercases the title", () => {
  expect(slugify("Hello World")).toBe("hello-world");
});

test("trims outer whitespace", () => {
  expect(slugify("  spaced out  ")).toBe("spaced-out");
});

test("collapses runs of spaces into one dash", () => {
  expect(slugify("a    b")).toBe("a-b");
});

test("strips punctuation", () => {
  expect(slugify("Node & Tooling: Part 2!")).toBe("node-tooling-part-2");
});

test("keeps digits", () => {
  expect(slugify("Top 10 Tips")).toBe("top-10-tips");
});

test("keeps existing dashes", () => {
  expect(slugify("already-slugged")).toBe("already-slugged");
});
