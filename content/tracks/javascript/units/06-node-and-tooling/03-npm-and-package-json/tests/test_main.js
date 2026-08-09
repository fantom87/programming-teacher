test("bare versions are pins", () => {
  expect(classifyDeps({ express: "4.19.2" }).pinned).toEqual(["express"]);
});

test("caret ranges float", () => {
  expect(classifyDeps({ chalk: "^5.0.0" }).floating).toEqual(["chalk"]);
});

test("tilde ranges float too", () => {
  expect(classifyDeps({ dayjs: "~1.11.0" }).floating).toEqual(["dayjs"]);
});

test("a mixed manifest splits and sorts", () => {
  const verdict = classifyDeps({
    zebra: "1.0.0",
    apple: "^2.0.0",
    mango: "3.1.4",
    banana: "~9.9.9",
  });
  expect(verdict.pinned).toEqual(["mango", "zebra"]);
  expect(verdict.floating).toEqual(["apple", "banana"]);
});
