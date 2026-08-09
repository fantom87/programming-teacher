test("includes the entry and what it imports", () => {
  const graph = {
    a: { imports: ["b"], kb: 1 },
    b: { imports: [], kb: 1 },
    c: { imports: [], kb: 1 },
  };
  expect(reachable(graph, "a")).toEqual(["a", "b"]);
});

test("follows imports of imports", () => {
  const graph = {
    app: { imports: ["mid"], kb: 1 },
    mid: { imports: ["deep"], kb: 1 },
    deep: { imports: [], kb: 1 },
  };
  expect(reachable(graph, "app")).toEqual(["app", "deep", "mid"]);
});

test("survives an import cycle", () => {
  const graph = {
    a: { imports: ["b"], kb: 1 },
    b: { imports: ["a", "c"], kb: 1 },
    c: { imports: [], kb: 1 },
    unused: { imports: ["a"], kb: 1 },
  };
  expect(reachable(graph, "a")).toEqual(["a", "b", "c"]);
});

test("an entry with no imports stands alone", () => {
  const graph = {
    solo: { imports: [], kb: 1 },
    other: { imports: [], kb: 1 },
  };
  expect(reachable(graph, "solo")).toEqual(["solo"]);
});
