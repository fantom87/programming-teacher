test("slugify flattens messy titles", () => {
  expect(slugify("  Hello, Node!  ")).toBe("hello-node");
  expect(slugify("npm run dev -- --watch")).toBe("npm-run-dev-watch");
  expect(slugify("2026 Roadmap")).toBe("2026-roadmap");
});

test("describePath leans on the path module", () => {
  expect(describePath("a/b/c.test.js")).toBe("c.test.js (.js)");
  expect(describePath("Makefile")).toBe("Makefile (no ext)");
});

test("notes roundtrip through the filesystem", () => {
  saveNote("Test Note", "body line");
  expect(readNote("Test Note")).toBe("# Test Note\n\nbody line\n");
});
