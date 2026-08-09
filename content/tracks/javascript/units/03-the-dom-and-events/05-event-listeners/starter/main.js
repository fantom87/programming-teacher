// Elements now carry listeners: an object mapping an event type ("click")
// to an ARRAY of handler functions.
const button = { tag: "button", id: "save", classes: [], text: "Save", children: [], listeners: {} };

// 1. on(el, type, handler) — remember the handler in el.listeners[type].
//    First handler of that type? Start the array first: el.listeners[type] = []

// 2. fire(el, type, event) — call every handler stored for that type,
//    passing event to each. No handlers? Do nothing (don't crash).

// 3. Wire it up:
//    let clicks = 0;
//    on(button, "click", (event) => { clicks = clicks + 1; });
//    fire(button, "click", { type: "click" });
//    fire(button, "click", { type: "click" });
//    console.log("clicks: " + clicks);   // clicks: 2
