const heading = { tag: "h1", id: "", classes: [], text: "Old headline", children: [] };
const article = { tag: "article", id: "", classes: [], text: "", children: [heading] };

function setText(el, text) {
  el.text = text;
}

function createElement(tag, text) {
  return { tag: tag, id: "", classes: [], text: text, children: [] };
}

function append(parent, child) {
  parent.children.push(child);
  return child;
}

setText(heading, "Fresh headline");
const note = createElement("p", "It works.");
append(article, note);

console.log(article.children.length);
console.log(article.children[1].text);
