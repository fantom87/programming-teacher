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

// 1. renderItem(todo) — RETURN an li element:
//    - text: the todo's title
//    - id: the todo's id as a STRING (String(todo.id))
//    - class "done" — only when todo.done is true

// 2. renderList(todos) — RETURN a ul element whose children are
//    todos.map(renderItem).

// 3. The payoff — re-rendering reflects data changes:
//    const list = renderList(todos);
//    console.log(list.children.length);                 // 3
//    console.log(list.children[0].classes.join(" "));   // done
//    todos[1].done = true;
//    const again = renderList(todos);
//    console.log(again.children[1].classes.join(" "));  // done
