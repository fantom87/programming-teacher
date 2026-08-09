---
id: 09-capstone-todo-widget
title: "Capstone: Interactive Todo Widget"
language: javascript
runner: browser
estMinutes: 35
files:
  - path: main.js
    starter: starter/main.js
goal: "Build the full widget loop: addTodo and toggleTodo manage the data, renderApp draws it, setupList wires a delegated click that toggles items, and summary reports the counts."
docs: [javascript/dom-basics, javascript/events, javascript/arrays]
checks:
  - id: widget-works
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-demo
    type: stdout
    entry: main.js
    match: exact
    value: "2 todos, 1 done\n3 todos, 2 done\n3 todos, 3 done\n"
  - id: real-widget-architecture
    type: ai-judge
    rubric: "The todos array is the single source of truth: renderApp derives the entire ul from todos with map or a loop (no hand-built li variables kept in sync), addTodo and toggleTodo mutate only the data (addTodo pushes a new object using nextId and increments it; toggleTodo finds by id and flips done, tolerating unknown ids). setupList attaches ONE click listener to the list element and uses event.target — checking it is an li and converting its id with Number (or equivalent) — to decide which todo to toggle; no per-item listeners. summary computes its counts from the array (length and a filter/loop over done), not hardcoded strings."
hints:
  - "toggleTodo: const todo = todos.find((t) => t.id === id); if (todo) { todo.done = !todo.done; } — find gives you the object, or undefined."
  - "renderApp is lesson 8 almost verbatim: build a ul, ul.children = todos.map(...), each li getting title text, String(id), and \"done\" when finished."
  - "setupList: on(list, \"click\", (event) => { if (event.target.tag === \"li\") { toggleTodo(Number(event.target.id)); } }); — the li's id string, back to a number, picks the todo."
---
## Everything, wired together

This is the Core capstone: a working todo widget, the "hello world" of
real front-end engineering — and secretly the architecture of every UI
framework you'll ever meet. One loop, four stations:

**data → render → events → data again.**

The user clicks an item; the click handler updates the *data*; the data
renders back into elements. Nothing edits the page directly — the todos
array is the single source of truth, and everything on screen is derived
from it. You've built every station in this unit; today you connect them.

The starter ships your whole toolkit (`createElement`, `addClass`, `on`,
`fire`) plus the state: a `todos` array and a `nextId` counter. You build
five functions:

**`addTodo(title)`** — push a new todo: fresh `id` from `nextId` (then
bump it — two todos must never share an id), the given `title`, `done:
false`. Return the new todo.

**`toggleTodo(id)`** — `find` the todo with that id and flip its `done`.
Unknown id? Do nothing — handlers shouldn't crash on a stray click.

**`renderApp()`** — return a `ul` photographed from `todos`, exactly like
lesson 8: each `li` carries the title as text, the id as a string, and
the `"done"` class when finished.

**`setupList(list)`** — one *delegated* click listener on the list. When
`event.target` is an `li`, convert its string id back with `Number` and
`toggleTodo` it. This is where the stamped id pays off: the element tells
you which piece of data it came from.

**`summary()`** — return `"N todos, M done"`, computed from the array
(`length`, and a `filter` for the done count).

Then the demo at the bottom of the starter runs the full loop — add,
toggle, render, click, re-check — and an AI reviewer will read your code
for the real architecture: data as truth, render from data, one delegated
listener.

### Your goal

1. `addTodo(title)` — new todo with a unique id, returned.
2. `toggleTodo(id)` — flip `done` by id; ignore unknown ids.
3. `renderApp()` — the `ul`, rendered purely from `todos`.
4. `setupList(list)` — delegated click → toggle the clicked todo.
5. `summary()` — `"3 todos, 2 done"` style report.
6. Run the starter's demo script — it should print the three summary
   lines shown there, the last one after a simulated click.
