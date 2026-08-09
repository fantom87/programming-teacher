---
id: 06-forms-and-input-values
title: Forms and Input Values
language: javascript
runner: browser
estMinutes: 15
files:
  - path: main.js
    starter: starter/main.js
goal: "Write readValues(form) collecting each input's value by id, and validateSignup(values) returning an array of error messages — empty when the form is good."
docs: [javascript/events, javascript/strings]
checks:
  - id: form-functions-work
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-demo
    type: stdout
    entry: main.js
    match: exact
    value: "[]\n[ 'username is required', 'email must contain @' ]\n"
hints:
  - "readValues: start with const values = {}; then loop the form's children and store values[input.id] = input.value; — bracket access lets the key come from a variable."
  - "validateSignup: start with const errors = []; push \"username is required\" when values.username === \"\", push \"email must contain @\" when !values.email.includes(\"@\"), then return errors."
  - "Chain them for the demo: console.log(validateSignup(readValues(form))); — a good form prints []."
---
## What did the user type?

Every login box, search bar, and checkout page ends the same way: code
reads what the user typed and decides what to do about it. In the real
DOM, each input element carries its current text in `.value`, and you
read it when the form's **submit** event fires:

```js
form.addEventListener("submit", (event) => {
  event.preventDefault();   // stop the built-in page reload
  const name = document.querySelector("#username").value;
});
```

Two professional habits live in that snippet. First,
`event.preventDefault()` — submitting a form makes the browser reload the
whole page by default, which would throw your app's state away, so nearly
every submit handler starts by switching that off. Second: read `.value`
*inside* the handler, at submit time — not when the page loads, when the
box is still empty.

One more thing to tattoo somewhere: **`.value` is always a string.** Type
42 into an "age" box and you get `"42"` — remember `Number()` when you
need math.

Our model form is an element whose children are inputs, each with an `id`
and a `value`. You'll write the two functions every form handler decomposes
into:

**`readValues(form)`** — gather the data: an object with one key per
input, the input's `id`, holding its `value`. Bracket access
(`values[input.id] = input.value`) shines here, because the key comes from
a variable. It must work on *any* form, whatever its inputs are named.

**`validateSignup(values)`** — judge it: return an **array of error
messages**, in check order — `"username is required"` when the username is
empty, `"email must contain @"` when the email lacks one. A clean form
returns `[]`, and `errors.length === 0` is the green light.

### Your goal

1. Write `readValues(form)` — `{ id: value }` for every child input.
2. Write `validateSignup(values)` — the two checks above, messages exact.
3. Print `validateSignup(readValues(form))` for the starter form (good:
   `[]`), then `validateSignup({ username: "", email: "nope" })` to see
   both complaints at once.
