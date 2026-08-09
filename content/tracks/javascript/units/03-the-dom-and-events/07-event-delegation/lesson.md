---
id: 07-event-delegation
title: Event Delegation
language: javascript
runner: browser
estMinutes: 15
files:
  - path: main.js
    starter: starter/main.js
goal: "Write onListClick(list) attaching ONE click listener to the list that selects whichever li was clicked via event.target — and prove items added later still work."
docs: [javascript/events, javascript/dom-basics]
checks:
  - id: delegation-works
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-demo
    type: stdout
    entry: main.js
    match: exact
    value: "selected\nselected\nlist classes: []\n"
hints:
  - "onListClick attaches one handler: on(list, \"click\", (event) => { ... }); — everything interesting happens inside the arrow function."
  - "Inside the handler, event.target is the element that was actually clicked. Check its tag: if (event.target.tag === \"li\") { ... }"
  - "The whole thing: on(list, \"click\", (event) => { if (event.target.tag === \"li\") { addClass(event.target, \"selected\"); } });"
---
## One listener to rule the list

Here's a puzzle from real front-end work. Your todo list has 3 items —
should you attach 3 click listeners? What about 300? And what happens when
you add item 301 *after* wiring things up — who gives it a listener?

The browser has a beautiful answer: events **bubble**. A click on an `<li>`
doesn't stop there — it travels up through every ancestor: the `<ul>`, the
`<body>`, the document itself. Any of them can catch it on the way through.
And whoever catches it can see exactly where it started, because the event
object carries **`event.target`** — the element that was actually clicked.

That enables the pattern called **event delegation**: attach *one* listener
to the parent and let it inspect `event.target`:

```js
list.addEventListener("click", (event) => {
  if (event.target.matches("li")) {
    event.target.classList.add("selected");
  }
});
```

One listener, every item covered — including items that don't exist yet,
because the listener lives on the parent, not on the children. The `if`
matters too: clicks on the list's empty padding land with the list itself
as the target, and those should do nothing.

The starter brings your toolkit from the last few lessons — `on`, `fire`,
`addClass`, and a `createItem` helper — already written. Our `fire` plays
the browser: clicking an item means firing `"click"` **on the list**, with
the item riding along as `event.target`, exactly how a bubbled click
arrives in real life.

Your job is one function, `onListClick(list)`: register a single `"click"`
handler on the list; when the target's tag is `"li"`, add the class
`"selected"` to **the target** — not the list. Then run the starter's demo
script and watch the delegation payoff: a freshly created, freshly appended
item responds without any extra wiring.

### Your goal

1. Write `onListClick(list)` — ONE delegated click handler as described.
2. Run the demo in the starter comments: wire the list, click item 2,
   append a brand-new item, click it too, then print the three
   `join`/summary lines shown — both items selected, the list untouched.
