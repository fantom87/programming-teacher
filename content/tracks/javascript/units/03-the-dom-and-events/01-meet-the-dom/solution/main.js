// The browser builds a tree like this from HTML — today we build it ourselves.
const page = {
  tag: "body",
  text: "",
  children: [
    { tag: "h1", text: "Welcome", children: [] },
    { tag: "p", text: "This page is made of objects.", children: [] },
    {
      tag: "ul",
      text: "",
      children: [
        { tag: "li", text: "First", children: [] },
        { tag: "li", text: "Second", children: [] },
      ],
    },
  ],
};

const heading = { tag: "h1", text: "My Page", children: [] };

function describeElement(el) {
  return "<" + el.tag + "> " + el.text;
}

function childTags(el) {
  return el.children.map((child) => child.tag);
}

console.log(describeElement(heading));
console.log(childTags(page));
