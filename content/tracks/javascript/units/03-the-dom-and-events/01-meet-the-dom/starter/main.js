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

// 1. Build an element object `heading`: tag "h1", text "My Page", no children.

// 2. describeElement(el) — RETURN "<" + tag + "> " + text, e.g. "<h1> My Page".

// 3. childTags(el) — RETURN an array of the tags of el.children (try .map).

// 4. Print your work:
//    console.log(describeElement(heading));
//    console.log(childTags(page));
