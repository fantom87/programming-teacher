test("parseEnv reads KEY=value lines", () => {
  expect(parseEnv("A=1\nB=two\n")).toEqual({ A: "1", B: "two" });
});

test("parseEnv skips comments and blank lines", () => {
  expect(parseEnv("# secrets!\n\nPORT=8080\n")).toEqual({ PORT: "8080" });
});

test("parseEnv splits on the FIRST = only", () => {
  expect(parseEnv("TOKEN=abc=def==\n")).toEqual({ TOKEN: "abc=def==" });
});

test("values stay strings", () => {
  expect(typeof parseEnv("PORT=8080\n").PORT).toBe("string");
});

test("the real environment wins over everything", () => {
  expect(resolveConfig({ A: "default" }, { A: "file" }, { A: "env" })).toEqual({
    A: "env",
  });
});

test("the file wins over defaults", () => {
  expect(resolveConfig({ A: "default", B: "keep" }, { A: "file" }, {})).toEqual(
    { A: "file", B: "keep" },
  );
});

test("defaults survive when nothing overrides them", () => {
  expect(resolveConfig({ A: "default" }, {}, {})).toEqual({ A: "default" });
});
