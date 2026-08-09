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

// 1. addTodo(title) — push { id: nextId, title: title, done: false },
//    bump nextId, RETURN the new todo.

// 2. toggleTodo(id) — find the todo with that id and flip its done.
//    No such id? Do nothing.

// 3. renderApp() — RETURN a ul rendered from todos (lesson 8 style):
//    each li has the title as text, String(id) as id, "done" class when done.

// 4. setupList(list) — ONE delegated "click" listener on the list:
//    when event.target is an li, toggleTodo(Number(event.target.id)).

// 5. summary() — RETURN "N todos, M done", counted from the array.

// 6. The demo — the full loop in action:
//    console.log(summary());                                  // 2 todos, 1 done
//    addTodo("Walk the dog");
//    toggleTodo(1);
//    console.log(summary());                                  // 3 todos, 2 done
//    const app = renderApp();
//    setupList(app);
//    fire(app, "click", { type: "click", target: app.children[2] });
//    console.log(summary());                                  // 3 todos, 3 done
