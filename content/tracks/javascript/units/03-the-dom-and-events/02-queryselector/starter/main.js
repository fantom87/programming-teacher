// Elements now have an id (string) and classes (array), like real ones.
const page = {
  tag: "body", id: "", classes: [], text: "",
  children: [
    { tag: "h1", id: "title", classes: [], text: "My Blog", children: [] },
    { tag: "p", id: "", classes: ["intro"], text: "Welcome back!", children: [] },
    {
      tag: "ul", id: "posts", classes: [], text: "",
      children: [
        { tag: "li", id: "", classes: ["post"], text: "Monday: shipped it", children: [] },
        { tag: "li", id: "", classes: ["post", "draft"], text: "Tuesday: broke it", children: [] },
      ],
    },
  ],
};

// Already written for you: the root plus every element inside it,
// flattened into one array, top to bottom.
function allElements(root) {
  const found = [root];
  for (const child of root.children) {
    for (const el of allElements(child)) {
      found.push(el);
    }
  }
  return found;
}

// 1. matches(el, selector) — RETURN true/false. Three selector kinds:
//    "#title" → el.id is "title"
//    ".draft" → el.classes includes "draft"
//    "li"     → el.tag is "li"

// 2. querySelector(root, selector) — loop allElements(root), RETURN the
//    first element that matches — or null if none does.

// 3. Try it out:
//    console.log(querySelector(page, "#title").text);
//    console.log(querySelector(page, ".draft").text);
//    console.log(querySelector(page, "footer"));
