// Your toolkit from earlier lessons — already written.
function on(el, type, handler) {
  if (!el.listeners[type]) el.listeners[type] = [];
  el.listeners[type].push(handler);
}
function fire(el, type, event) {
  const handlers = el.listeners[type];
  if (!handlers) return;
  for (const handler of handlers) handler(event);
}
function addClass(el, name) {
  if (!el.classes.includes(name)) el.classes.push(name);
}
function createItem(text) {
  return { tag: "li", id: "", classes: [], text: text, children: [], listeners: {} };
}

const list = {
  tag: "ul", id: "inbox", classes: [], text: "", listeners: {},
  children: [createItem("Pay rent"), createItem("Call mom"), createItem("Buy milk")],
};

function onListClick(list) {
  on(list, "click", (event) => {
    if (event.target.tag === "li") {
      addClass(event.target, "selected");
    }
  });
}

onListClick(list);
fire(list, "click", { type: "click", target: list.children[1] });
const fresh = createItem("New task");
list.children.push(fresh);
fire(list, "click", { type: "click", target: fresh });
console.log(list.children[1].classes.join(" "));
console.log(fresh.classes.join(" "));
console.log("list classes: [" + list.classes.join(" ") + "]");
