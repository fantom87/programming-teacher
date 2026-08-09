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

function matches(el, selector) {
  if (selector[0] === "#") {
    return el.id === selector.slice(1);
  }
  if (selector[0] === ".") {
    return el.classes.includes(selector.slice(1));
  }
  return el.tag === selector;
}

function querySelector(root, selector) {
  for (const el of allElements(root)) {
    if (matches(el, selector)) {
      return el;
    }
  }
  return null;
}

console.log(querySelector(page, "#title").text);
console.log(querySelector(page, ".draft").text);
console.log(querySelector(page, "footer"));
