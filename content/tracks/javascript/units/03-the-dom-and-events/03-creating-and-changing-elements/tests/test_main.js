test("setText changes the element's text", () => {
  const el = { tag: "p", id: "", classes: [], text: "before", children: [] };
  setText(el, "after");
  expect(el.text).toBe("after");
});

test("createElement returns a fresh element", () => {
  const li = createElement("li", "Milk");
  expect(li.tag).toBe("li");
  expect(li.text).toBe("Milk");
  expect(li.id).toBe("");
  expect(li.classes).toEqual([]);
  expect(li.children).toEqual([]);
});

test("createElement makes a NEW object every call", () => {
  const a = createElement("li", "one");
  const b = createElement("li", "one");
  setText(a, "changed");
  expect(b.text).toBe("one");
});

test("append puts the child inside the parent and returns it", () => {
  const ul = createElement("ul", "");
  const li = createElement("li", "Bread");
  const returned = append(ul, li);
  expect(ul.children.length).toBe(1);
  expect(ul.children[0].text).toBe("Bread");
  expect(returned).toBe(li);
});

test("the article was updated with your tools", () => {
  expect(heading.text).toBe("Fresh headline");
  expect(article.children.length).toBe(2);
  expect(article.children[1].tag).toBe("p");
  expect(article.children[1].text).toBe("It works.");
});
