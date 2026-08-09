test("hasClass detects a class", () => {
  const el = { tag: "div", id: "", classes: ["card", "wide"], text: "", children: [] };
  expect(hasClass(el, "wide")).toBe(true);
  expect(hasClass(el, "tall")).toBe(false);
});

test("addClass adds a new class", () => {
  const el = { tag: "div", id: "", classes: [], text: "", children: [] };
  addClass(el, "active");
  expect(el.classes).toEqual(["active"]);
});

test("addClass never duplicates", () => {
  const el = { tag: "div", id: "", classes: ["active"], text: "", children: [] };
  addClass(el, "active");
  expect(el.classes).toEqual(["active"]);
});

test("removeClass removes only that class", () => {
  const el = { tag: "div", id: "", classes: ["a", "b", "c"], text: "", children: [] };
  removeClass(el, "b");
  expect(el.classes).toEqual(["a", "c"]);
});

test("toggleClass flips the class and reports the new state", () => {
  const el = { tag: "div", id: "", classes: [], text: "", children: [] };
  expect(toggleClass(el, "open")).toBe(true);
  expect(el.classes).toEqual(["open"]);
  expect(toggleClass(el, "open")).toBe(false);
  expect(el.classes).toEqual([]);
});
