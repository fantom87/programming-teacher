test("on + fire runs the handler", () => {
  const el = { tag: "button", id: "", classes: [], text: "", children: [], listeners: {} };
  let ran = 0;
  on(el, "click", () => { ran = ran + 1; });
  fire(el, "click", { type: "click" });
  expect(ran).toBe(1);
});

test("handlers receive the event object", () => {
  const el = { tag: "input", id: "", classes: [], text: "", children: [], listeners: {} };
  let seen = "";
  on(el, "keydown", (event) => { seen = event.key; });
  fire(el, "keydown", { type: "keydown", key: "Enter" });
  expect(seen).toBe("Enter");
});

test("several listeners on one event all run, in order", () => {
  const el = { tag: "button", id: "", classes: [], text: "", children: [], listeners: {} };
  const log = [];
  on(el, "click", () => log.push("first"));
  on(el, "click", () => log.push("second"));
  fire(el, "click", { type: "click" });
  expect(log).toEqual(["first", "second"]);
});

test("firing an event nobody listens to is fine", () => {
  const el = { tag: "div", id: "", classes: [], text: "", children: [], listeners: {} };
  fire(el, "mouseover", { type: "mouseover" });
  expect(true).toBe(true);
});

test("listeners are kept apart per event type", () => {
  const el = { tag: "button", id: "", classes: [], text: "", children: [], listeners: {} };
  let clicked = 0;
  let hovered = 0;
  on(el, "click", () => { clicked = clicked + 1; });
  on(el, "mouseover", () => { hovered = hovered + 1; });
  fire(el, "click", { type: "click" });
  expect(clicked).toBe(1);
  expect(hovered).toBe(0);
});
