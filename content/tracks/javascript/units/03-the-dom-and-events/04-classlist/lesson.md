---
id: 04-classlist
title: "classList: Styling Switches"
language: javascript
runner: browser
estMinutes: 12
files:
  - path: main.js
    starter: starter/main.js
goal: "Write hasClass, addClass (no duplicates), removeClass, and toggleClass (returning whether the class is now present) — then flip the alert box's visible class."
docs: [javascript/dom-basics, javascript/arrays]
checks:
  - id: class-tools-work
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-demo
    type: stdout
    entry: main.js
    match: exact
    value: "box visible\nbox\n"
hints:
  - "hasClass is one line: return el.classes.includes(name); — addClass should only push when hasClass says false."
  - "removeClass: el.classes = el.classes.filter((c) => c !== name); — filter builds a new array without the class."
  - "toggleClass: if hasClass, removeClass and return false; otherwise addClass and return true."
---
## Flip a switch, change the look

How does a menu slide open, an error field glow red, a dark theme switch
on? Almost always the same trick: CSS defines how `.open`, `.error`, or
`.dark` *looks* — and JavaScript just flips the class on or off. The
styling stays in the stylesheet; your code only throws switches. The real
DOM gives every element a `classList` for exactly this:

```js
box.classList.add("visible");
box.classList.remove("visible");
box.classList.toggle("visible");     // off→on or on→off
box.classList.contains("visible");   // true or false
```

In our model, `classes` is a plain array of strings — so today is honest
array practice wearing DOM clothes. Four tools:

**`hasClass(el, name)`** — is the class there? `includes` answers in one
line.

**`addClass(el, name)`** — add it, but **never twice**. `class="done done"`
is nonsense, and the real `classList.add` silently refuses duplicates.
Check before you push.

**`removeClass(el, name)`** — take it out. The clean move is `filter`:
build a new array of everything *except* the name, and assign it back to
`el.classes`. (`const` on the element doesn't stop you — it locks which
object the variable holds, not the object's insides.)

**`toggleClass(el, name)`** — remove it if present, add it if not, and
**return** `true` when the class is there *after* the toggle. The real
`classList.toggle` returns exactly this, so callers can react to the new
state. Built on your first three tools, it's about four lines.

### Your goal

1. Write `hasClass(el, name)` — `true`/`false`.
2. Write `addClass(el, name)` — adds, never duplicates.
3. Write `removeClass(el, name)` — removes it.
4. Write `toggleClass(el, name)` — flips it, returns whether it's now on.
5. Drive the starter's `alertBox`: `addClass` `"visible"`, print
   `alertBox.classes.join(" ")`, then `toggleClass` `"visible"` and print
   the join again — `box visible`, then `box`.
