test("renderItem builds an li from a todo", () => {
  const li = renderItem({ id: 7, title: "Water plants", done: false });
  expect(li.tag).toBe("li");
  expect(li.text).toBe("Water plants");
  expect(li.id).toBe("7");
});

test("a done todo gets the done class", () => {
  const li = renderItem({ id: 8, title: "Ship it", done: true });
  expect(li.classes).toContain("done");
});

test("an unfinished todo has no done class", () => {
  const li = renderItem({ id: 9, title: "Start it", done: false });
  expect(li.classes).toEqual([]);
});

test("renderList renders one li per todo, in order", () => {
  const data = [
    { id: 1, title: "a", done: false },
    { id: 2, title: "b", done: true },
    { id: 3, title: "c", done: false },
  ];
  const ul = renderList(data);
  expect(ul.tag).toBe("ul");
  expect(ul.children.length).toBe(3);
  expect(ul.children.map((li) => li.text)).toEqual(["a", "b", "c"]);
  expect(ul.children[1].classes).toContain("done");
});

test("rendering twice reflects data changes", () => {
  const data = [{ id: 1, title: "a", done: false }];
  expect(renderList(data).children[0].classes).toEqual([]);
  data[0].done = true;
  expect(renderList(data).children[0].classes).toContain("done");
});
