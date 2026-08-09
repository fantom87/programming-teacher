// Your toolkit — already written.
function createElement(tag, text) {
  return { tag: tag, id: "", classes: [], text: text, children: [], listeners: {} };
}
function on(el, type, handler) {
  if (!el.listeners[type]) el.listeners[type] = [];
  el.listeners[type].push(handler);
}
function fire(el, type, event) {
  const handlers = el.listeners[type];
  if (!handlers) return;
  for (const handler of handlers) handler(event);
}

// The data. The list should be a photograph of this array.
const items = [
  { id: 1, label: "inbox zero", done: false },
  { id: 2, label: "review PR", done: true },
  { id: 3, label: "ship it", done: false },
];

function render(items) {
  const ul = createElement("ul", "");
  ul.children = items.map((item) => {
    const li = createElement("li", item.label);
    li.id = String(item.id);
    if (item.done) li.classes.push("done");
    return li;
  });
  return ul;
}

function toggleDone(el) {
  if (el.classes.includes("done")) {
    el.classes = el.classes.filter((c) => c !== "done");
  } else {
    el.classes.push("done");
  }
}

function wireDelegation(list) {
  on(list, "click", (event) => {
    if (event.target.tag === "li") toggleDone(event.target);
  });
}

// Drill — leave these lines exactly as they are:
const list = render(items);
console.log(list.children.map((li) => li.id).join(","));
console.log(list.children.filter((li) => li.classes.includes("done")).length);
wireDelegation(list);
fire(list, "click", { type: "click", target: list.children[0] });
fire(list, "click", { type: "click", target: list.children[1] });
fire(list, "click", { type: "click", target: list });
console.log(list.children.map((li) => li.classes.join("") || "-").join(" "));
console.log(list.classes.length);
