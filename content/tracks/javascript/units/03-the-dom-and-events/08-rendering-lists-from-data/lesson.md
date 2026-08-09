---
id: 08-rendering-lists-from-data
title: Rendering Lists from Data
language: javascript
runner: browser
estMinutes: 18
files:
  - path: main.js
    starter: starter/main.js
goal: "Write renderItem(todo) turning one data object into an li (with a done class when finished), and renderList(todos) building the whole ul with map — then re-render after the data changes."
docs: [javascript/dom-basics, javascript/arrays]
checks:
  - id: rendering-works
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-demo
    type: stdout
    entry: main.js
    match: exact
    value: "3\ndone\ndone\n"
hints:
  - "renderItem: const li = createElement(\"li\", todo.title); then li.id = String(todo.id); then if (todo.done) addClass(li, \"done\"); return li;"
  - "renderList: const ul = createElement(\"ul\", \"\"); ul.children = todos.map(renderItem); return ul; — map hands each todo to renderItem for you."
  - "Re-rendering is just calling renderList(todos) again — the new tree reflects whatever the data says NOW."
---
## Data draws the page

Time for the idea that powers every modern interface, from React to the
settings screen on your phone: **don't edit the page — edit the data, then
rebuild the page from it.**

The starter has an array of todos, plain data:

```js
const todos = [
  { id: 1, title: "Pay rent", done: true },
  // ...
];
```

The page should be a *photograph* of that array. When the data changes,
you don't hunt down the right `li` and tweak it — you take a fresh
photograph. In the real DOM the pattern looks like this:

```js
list.innerHTML = "";                       // clear the old picture
for (const todo of todos) {
  const li = document.createElement("li");
  li.textContent = todo.title;
  if (todo.done) li.classList.add("done");
  list.append(li);
}
```

Rebuilding sounds wasteful, but it's the professional default: one honest
render function beats a dozen clever little patches that drift out of sync.
Your toolkit (`createElement`, `addClass`) is in the starter. You'll split
the render in two, and `map` — the turn-each-thing-into-another-thing tool
from last unit — does the heavy lifting:

**`renderItem(todo)`** — one data object in, one `li` element out: `text`
from `todo.title`, class `"done"` added only when `todo.done` is true, and
`id` set to `String(todo.id)`. Why the `String`? DOM ids are strings, and
stamping the data's id onto the element is how next lesson's click handler
will know *which* todo an `li` belongs to.

**`renderList(todos)`** — a `ul` whose `children` is `todos.map(renderItem)`.
That single line *is* the photograph.

Then the payoff: render, flip one todo's `done` in the data, render again —
and the new tree shows the change, no element-tweaking anywhere.

### Your goal

1. Write `renderItem(todo)` — `li` with title text, string `id`, and
   `"done"` class when finished.
2. Write `renderList(todos)` — `ul` with one child per todo, via `map`.
3. Demo it: render the starter data and print the child count and item 1's
   classes; then set `todos[1].done = true`, re-render, and print item 2's
   classes — `3`, `done`, `done`.
