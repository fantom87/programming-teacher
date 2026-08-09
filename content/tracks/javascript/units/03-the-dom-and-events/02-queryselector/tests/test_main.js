test("matches understands a tag selector", () => {
  const el = { tag: "p", id: "", classes: [], text: "", children: [] };
  expect(matches(el, "p")).toBe(true);
  expect(matches(el, "h1")).toBe(false);
});

test("matches understands an #id selector", () => {
  const el = { tag: "h1", id: "title", classes: [], text: "", children: [] };
  expect(matches(el, "#title")).toBe(true);
  expect(matches(el, "#other")).toBe(false);
});

test("matches understands a .class selector", () => {
  const el = { tag: "li", id: "", classes: ["post", "draft"], text: "", children: [] };
  expect(matches(el, ".draft")).toBe(true);
  expect(matches(el, ".published")).toBe(false);
});

test("querySelector returns the FIRST match", () => {
  expect(querySelector(page, ".post").text).toBe("Monday: shipped it");
});

test("querySelector searches nested elements", () => {
  expect(querySelector(page, "#title").text).toBe("My Blog");
  expect(querySelector(page, ".draft").text).toBe("Tuesday: broke it");
});

test("querySelector returns null when nothing matches", () => {
  expect(querySelector(page, "footer")).toBe(null);
});
