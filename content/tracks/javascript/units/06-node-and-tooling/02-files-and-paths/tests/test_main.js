test("summarize keeps trimmed, non-blank lines", () => {
  expect(summarize("a\nbb\n\nccc\n").lines).toEqual(["a", "bb", "ccc"]);
});

test("summarize survives Windows \\r\\n line endings", () => {
  expect(summarize("one\r\ntwo\r\n").lines).toEqual(["one", "two"]);
});

test("summarize finds the longest line", () => {
  expect(summarize("aa\nbbbb\nc").longest).toBe("bbbb");
});

test("a single line is its own longest", () => {
  expect(summarize("solo").longest).toBe("solo");
});
