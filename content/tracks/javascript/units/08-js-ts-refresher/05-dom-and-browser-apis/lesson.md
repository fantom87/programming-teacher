---
id: 05-dom-and-browser-apis
title: "DOM and Browser APIs"
language: javascript
runner: browser
estMinutes: 15
files:
  - path: main.js
    starter: starter/main.js
goal: "DOM patterns without a browser: render(items) photographs data into a ul, toggleDone re-implements classList.toggle, and wireDelegation puts ONE click listener on the list that flips whichever li was clicked."
docs: [javascript/dom-basics, javascript/events]
checks:
  - id: dom-drills-hold-up
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: drill-output
    type: stdout
    entry: main.js
    match: exact
    value: "1,2,3\n1\ndone - -\n0\n"
  - id: real-dom-patterns
    type: ai-judge
    rubric: "render returns a ul built with the starter's createElement whose children come from items via map (or a loop): each li takes its text from label, its id via String(item.id), and the done class ONLY when item.done is true. toggleDone mirrors classList.toggle: it checks el.classes.includes('done') and either removes it (filter or splice) or pushes it — both directions work and no duplicate class ever appears. wireDelegation registers exactly ONE click listener on the list itself via on(list, 'click', ...) whose handler branches on event.target.tag === 'li' and calls toggleDone(event.target) — no per-item listeners anywhere, and clicks whose target is not an li do nothing. The drill lines at the bottom are intact."
hints:
  - "render: ul.children = items.map((item) => { const li = createElement(\"li\", item.label); li.id = String(item.id); if (item.done) li.classes.push(\"done\"); return li; }); return the ul."
  - "toggleDone is classList.toggle by hand: if el.classes.includes(\"done\"), set el.classes = el.classes.filter((c) => c !== \"done\"); otherwise push it."
  - "Delegation is one listener on the parent: on(list, \"click\", (event) => { if (event.target.tag === \"li\") toggleDone(event.target); }); — clicks on the list itself fall through."
---
## The browser patterns, replayed

Our runner grades plain JavaScript, so the starter ships a tiny
simulated DOM — elements are objects with `tag`, `id`, `classes`,
`text`, `children`, `listeners`, and the helpers mirror the real API:

```js
createElement("li", "text")        // document.createElement + textContent
on(el, "click", handler)           // el.addEventListener("click", handler)
fire(el, "click", event)           // the browser dispatching a click
li.classes.push("done")            // li.classList.add("done")
```

The three patterns you're re-drilling are the real ones:

- **Render from data** — the page is a photograph of an array; don't
  patch elements, rebuild them from the data.
- **`classList.toggle`** — present? remove. Absent? add. You'll write
  it by hand once to remember what it does.
- **Event delegation** — one listener on the parent catches every
  bubbled click, current *and future* children; `event.target` says
  what was actually hit.

### Your goal

1. `render(items)` — a `ul` with one `li` per item: text from `label`,
   `id` as `String(item.id)`, class `"done"` only when `item.done`.
2. `toggleDone(el)` — remove `"done"` from `el.classes` if present,
   add it if not.
3. `wireDelegation(list)` — ONE click listener on the list; if
   `event.target.tag === "li"`, toggle that target, else do nothing.

The starter's drill — render, two item clicks, one list click — prints
exactly:

```
1,2,3
1
done - -
0
```
