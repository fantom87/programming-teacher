test("render photographs the data", () => {
  const ul = render([{ id: 7, label: "solo", done: true }]);
  expect(ul.tag).toBe("ul");
  expect(ul.children.length).toBe(1);
  expect(ul.children[0].id).toBe("7");
  expect(ul.children[0].text).toBe("solo");
  expect(ul.children[0].classes).toEqual(["done"]);
});

test("toggleDone flips the class both ways", () => {
  const li = createElement("li", "x");
  toggleDone(li);
  expect(li.classes.includes("done")).toBeTruthy();
  toggleDone(li);
  expect(li.classes.includes("done")).toBe(false);
  toggleDone(li);
  expect(li.classes).toEqual(["done"]);
});

test("delegation: one listener, items only", () => {
  const ul = render([
    { id: 1, label: "a", done: false },
    { id: 2, label: "b", done: false },
  ]);
  wireDelegation(ul);
  expect((ul.listeners.click || []).length).toBe(1);
  fire(ul, "click", { type: "click", target: ul.children[1] });
  expect(ul.children[1].classes).toEqual(["done"]);
  fire(ul, "click", { type: "click", target: ul });
  expect(ul.classes).toEqual([]);
  expect(ul.children[0].listeners.click === undefined).toBeTruthy();
});
