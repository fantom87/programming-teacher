test("clicking an item selects it", () => {
  const item = list.children[0];
  fire(list, "click", { type: "click", target: item });
  expect(item.classes).toContain("selected");
});

test("items added AFTER wiring still work (the delegation payoff)", () => {
  const late = createItem("Late arrival");
  list.children.push(late);
  fire(list, "click", { type: "click", target: late });
  expect(late.classes).toContain("selected");
});

test("clicking the list itself selects nothing", () => {
  fire(list, "click", { type: "click", target: list });
  expect(list.classes).toEqual([]);
});

test("clicking twice doesn't stack classes", () => {
  const item = list.children[2];
  fire(list, "click", { type: "click", target: item });
  fire(list, "click", { type: "click", target: item });
  expect(item.classes).toEqual(["selected"]);
});
