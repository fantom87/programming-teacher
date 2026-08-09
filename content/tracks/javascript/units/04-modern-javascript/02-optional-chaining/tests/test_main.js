test("cityOf reads a nested city", () => {
  expect(cityOf({ address: { city: "Reno" } })).toBe("Reno");
});

test("a user without an address is unknown", () => {
  expect(cityOf({ name: "x" })).toBe("unknown");
});

test("even a null user is safe", () => {
  expect(cityOf(null)).toBe("unknown");
});

test("firstTag grabs the first tag", () => {
  expect(firstTag({ tags: ["a", "b"] })).toBe("a");
});

test("no tags array means untagged", () => {
  expect(firstTag({})).toBe("untagged");
});

test("an EMPTY tags array is untagged too", () => {
  expect(firstTag({ tags: [] })).toBe("untagged");
});

test("a score of 0 is real data, not missing", () => {
  expect(scoreLine({ score: 0 })).toBe("score: 0");
});

test("a missing score falls back to n/a", () => {
  expect(scoreLine({})).toBe("score: n/a");
});
