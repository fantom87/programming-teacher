// Elements now carry listeners: an object mapping an event type ("click")
// to an ARRAY of handler functions.
const button = { tag: "button", id: "save", classes: [], text: "Save", children: [], listeners: {} };

function on(el, type, handler) {
  if (!el.listeners[type]) {
    el.listeners[type] = [];
  }
  el.listeners[type].push(handler);
}

function fire(el, type, event) {
  const handlers = el.listeners[type];
  if (!handlers) {
    return;
  }
  for (const handler of handlers) {
    handler(event);
  }
}

let clicks = 0;
on(button, "click", (event) => { clicks = clicks + 1; });
fire(button, "click", { type: "click" });
fire(button, "click", { type: "click" });
console.log("clicks: " + clicks);
