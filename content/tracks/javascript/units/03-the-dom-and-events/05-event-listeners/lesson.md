---
id: 05-event-listeners
title: Event Listeners
language: javascript
runner: browser
estMinutes: 15
files:
  - path: main.js
    starter: starter/main.js
goal: "Write on(el, type, handler) to register handlers and fire(el, type, event) to run them — then wire a click counter on the button and prove it counts."
docs: [javascript/events, javascript/functions-and-closures]
checks:
  - id: event-system-works
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-demo
    type: stdout
    entry: main.js
    match: exact
    value: "clicks: 2\n"
hints:
  - "on: if el.listeners[type] doesn't exist yet, set it to [] — then push the handler onto it."
  - "fire: const handlers = el.listeners[type]; if (!handlers) return; then loop and call each one with the event: handler(event);"
  - "The counter: let clicks = 0; on(button, \"click\", (event) => { clicks = clicks + 1; }); then fire the click twice and print \"clicks: \" + clicks."
---
## Code that waits

Everything you've written so far runs top to bottom and ends. But a page
doesn't work like that — it *waits*. When the user clicks, types, or
submits, the browser fires an **event**, and if you've registered a
function for that kind of event, the browser calls it:

```js
button.addEventListener("click", (event) => {
  console.log("clicked!");
});
```

Read it as: *"Hey button — when a `click` happens, run this function."*
You're not calling the function; you're handing it over to be called
later. A function passed along like that is a **callback** — the arrow
functions you met last unit, now with a job. When the moment comes, the
browser calls it with an **event object** describing what happened —
`event.type`, which key was pressed, what was clicked.

Today you build both sides of that deal. Elements in the starter carry a
`listeners` property: an object mapping an event type to an *array* of
handler functions (one button can have many click handlers).

**`on(el, type, handler)`** registers: if `el.listeners[type]` doesn't
exist yet, start it as an empty array; then push the handler in. That's
your `addEventListener`.

**`fire(el, type, event)`** plays the browser's role: look up the array
for that type and call every handler in order, passing `event` to each.
If nobody's listening, do nothing — firing an event with no listeners is
perfectly normal, not a crash.

Then prove the loop works: a counter the handlers close over, bumped once
per click. This wait-register-fire triangle *is* interactivity — every
lesson from here rides on it.

### Your goal

1. Write `on(el, type, handler)` — store the handler in
   `el.listeners[type]`, creating the array on first use.
2. Write `fire(el, type, event)` — call each stored handler with `event`;
   no listeners means do nothing.
3. Wire it: `let clicks = 0;`, register a `"click"` handler on `button`
   that adds 1, `fire` the click **twice**, then print `clicks: 2`.
