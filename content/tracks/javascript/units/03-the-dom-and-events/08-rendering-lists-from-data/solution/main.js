// Your toolkit — already written.
function createElement(tag, text) {
  return { tag: tag, id: "", classes: [], text: text, children: [], listeners: {} };
}
function addClass(el, name) {
  if (!el.classes.includes(name)) el.classes.push(name);
}

// The data. The page should be a photograph of this array.
const todos = [
  { id: 1, title: "Pay rent", done: true },
  { id: 2, title: "Call mom", done: false },
  { id: 3, title: "Buy milk", done: false },
];

function renderItem(todo) {
  const li = createElement("li", todo.title);
  li.id = String(todo.id);
  if (todo.done) {
    addClass(li, "done");
  }
  return li;
}

function renderList(todos) {
  const ul = createElement("ul", "");
  ul.children = todos.map(renderItem);
  return ul;
}

const list = renderList(todos);
console.log(list.children.length);
console.log(list.children[0].classes.join(" "));
todos[1].done = true;
const again = renderList(todos);
console.log(again.children[1].classes.join(" "));
