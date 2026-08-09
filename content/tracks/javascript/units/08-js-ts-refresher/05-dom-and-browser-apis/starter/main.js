// DOM drills on a simulated page. The helpers mirror the real API:
// createElement ~ document.createElement, on ~ addEventListener,
// fire ~ the browser dispatching an event.

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

// 1. render(items) — RETURN a ul element: one li child per item, with
//    text = label, id = String(item.id), class "done" only when done.

// 2. toggleDone(el) — classList.toggle by hand: remove "done" from
//    el.classes if present, add it if not.

// 3. wireDelegation(list) — ONE "click" listener on the list itself.
//    If event.target.tag === "li", toggleDone(event.target); else nothing.

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
