// Your toolkit from this unit — already written.
function createElement(tag, text) {
  return { tag: tag, id: "", classes: [], text: text, children: [], listeners: {} };
}
function addClass(el, name) {
  if (!el.classes.includes(name)) el.classes.push(name);
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

// The state — the single source of truth.
let todos = [
  { id: 1, title: "Pay rent", done: false },
  { id: 2, title: "Call mom", done: true },
];
let nextId = 3;

function addTodo(title) {
  const todo = { id: nextId, title: title, done: false };
  nextId = nextId + 1;
  todos.push(todo);
  return todo;
}

function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.done = !todo.done;
  }
}

function renderApp() {
  const ul = createElement("ul", "");
  ul.children = todos.map((todo) => {
    const li = createElement("li", todo.title);
    li.id = String(todo.id);
    if (todo.done) {
      addClass(li, "done");
    }
    return li;
  });
  return ul;
}

function setupList(list) {
  on(list, "click", (event) => {
    if (event.target.tag === "li") {
      toggleTodo(Number(event.target.id));
    }
  });
}

function summary() {
  const done = todos.filter((t) => t.done).length;
  return todos.length + " todos, " + done + " done";
}

// The demo — the full loop in action:
console.log(summary());
addTodo("Walk the dog");
toggleTodo(1);
console.log(summary());
const app = renderApp();
setupList(app);
fire(app, "click", { type: "click", target: app.children[2] });
console.log(summary());
