test("addTodo appends a new undone todo and returns it", () => {
  const before = todos.length;
  const t = addTodo("Test the widget");
  expect(todos.length).toBe(before + 1);
  expect(t.title).toBe("Test the widget");
  expect(t.done).toBe(false);
  expect(todos[todos.length - 1]).toBe(t);
});

test("addTodo gives every todo a different id", () => {
  const a = addTodo("one");
  const b = addTodo("two");
  expect(a.id === b.id).toBe(false);
});

test("toggleTodo flips done by id", () => {
  const t = addTodo("flip me");
  toggleTodo(t.id);
  expect(t.done).toBe(true);
  toggleTodo(t.id);
  expect(t.done).toBe(false);
});

test("toggleTodo ignores unknown ids", () => {
  toggleTodo(99999);
  expect(true).toBe(true);
});

test("renderApp draws one li per todo, from the data", () => {
  const list = renderApp();
  expect(list.tag).toBe("ul");
  expect(list.children.length).toBe(todos.length);
  expect(list.children.map((li) => li.text)).toEqual(todos.map((t) => t.title));
});

test("done todos render with the done class and their id", () => {
  const t = addTodo("finished thing");
  toggleTodo(t.id);
  const list = renderApp();
  const li = list.children[list.children.length - 1];
  expect(li.classes).toContain("done");
  expect(li.id).toBe(String(t.id));
});

test("clicking an item runs the whole loop: data flips, re-render shows it", () => {
  const t = addTodo("click me");
  const list = renderApp();
  setupList(list);
  const li = list.children[list.children.length - 1];
  fire(list, "click", { type: "click", target: li });
  expect(t.done).toBe(true);
  const rerender = renderApp();
  expect(rerender.children[rerender.children.length - 1].classes).toContain("done");
});

test("clicking the list background toggles nothing", () => {
  const snapshot = JSON.stringify(todos);
  const list = renderApp();
  setupList(list);
  fire(list, "click", { type: "click", target: list });
  expect(JSON.stringify(todos)).toBe(snapshot);
});

test("summary counts from the array", () => {
  const done = todos.filter((t) => t.done).length;
  expect(summary()).toBe(todos.length + " todos, " + done + " done");
});
