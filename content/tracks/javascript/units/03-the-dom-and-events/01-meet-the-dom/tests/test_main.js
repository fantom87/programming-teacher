test("heading is an h1 element object", () => {
  expect(heading.tag).toBe("h1");
  expect(heading.text).toBe("My Page");
  expect(heading.children).toEqual([]);
});

test("describeElement formats tag and text", () => {
  expect(describeElement({ tag: "p", text: "hi", children: [] })).toBe("<p> hi");
});

test("describeElement works on the heading", () => {
  expect(describeElement(heading)).toBe("<h1> My Page");
});

test("childTags lists the tags of the children", () => {
  expect(childTags(page)).toEqual(["h1", "p", "ul"]);
});

test("childTags of a leaf element is empty", () => {
  expect(childTags({ tag: "li", text: "x", children: [] })).toEqual([]);
});
