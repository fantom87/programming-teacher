---
id: 04-accessible-forms
title: Accessible Forms
language: html-css
runner: browser
estMinutes: 18
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Wire the adoption form up properly: a label[for] paired to every input's id, type=\"email\" on the email field, the radio pair grouped in a fieldset with a legend, and a real submit button instead of a styled div."
docs: [html-css/forms, html-css/accessibility-basics]
checks:
  - id: text-inputs-labeled
    type: dom
    assertions:
      - { selector: "label[for=name]", exists: true }
      - { selector: "input#name", exists: true }
      - { selector: "label[for=email]", exists: true }
      - { selector: "input#email", attr: "type", equals: "email" }
  - id: radio-group
    type: dom
    assertions:
      - { selector: "fieldset legend", exists: true }
      - { selector: "fieldset input[type=radio]", count: 2 }
      - { selector: "label[for=home-apartment]", exists: true }
      - { selector: "label[for=home-house]", exists: true }
  - id: real-submit
    type: dom
    assertions:
      - { selector: "form button", attr: "type", equals: "submit" }
      - { selector: "div.btn", count: 0 }
  - id: labels-mean-it
    type: ai-judge
    rubric: "Every control is programmatically labeled: the name and email inputs each have a label whose for matches the input's id and whose text genuinely names the field, the email input is type=email, any placeholder supplements rather than replaces a label, both radios sit inside a fieldset whose legend names the group (Your home or similar), each radio has its own clickable label, and the submit control is a real button type=submit — no div or span standing in for it."
hints:
  - "Pairing is two edits: <label for=\"name\">Your name</label> plus id=\"name\" on the input. The for must match the id exactly."
  - "Radios: wrap both in a <fieldset> whose first child is <legend>Your home</legend>, then give each radio an id (home-apartment, home-house) and its own label[for]."
  - "The fake button becomes <button type=\"submit\" class=\"btn\">Send application</button> — the class keeps the styling; the element brings Enter-key submission for free."
---
## The label is a contract

A `<p>` that says "Your name" next to an input *looks* labeled. But
nothing connects the two — a screen reader landing on that input
announces "edit text," full stop. Which of the form's five fields is
this? No way to know without wandering off to read the neighborhood.

`<label for="...">` makes the connection official:

```html
<label for="name">Your name</label>
<input type="text" id="name" name="name">
```

The `for` matches the input's `id`, and now the input *has a name* —
announced on focus, and clickable too: tapping the label focuses the
field. On a phone, that turns a 16-pixel target into the whole line.
(A placeholder is not a label. It vanishes the moment you type, which
is exactly when you start wondering what the field was.)

Radio buttons need one more layer. "Apartment" as a label works, but
apartment *what*? The question the radios answer lives outside them —
so you group the pair in a `<fieldset>` and name the group with a
`<legend>`:

```html
<fieldset>
  <legend>Your home</legend>
  ...
</fieldset>
```

Screen readers announce legend plus label together — "Your home,
Apartment" — and suddenly the radio makes sense in isolation.

Last: the starter "submits" with `<div class="btn">`. A div can be
styled into anything, but it can't be focused, can't be pressed with
Enter or Space, and doesn't submit anything. `<button type="submit">`
does all three, and your `.btn` class styles it just the same.

The starter is a cat adoption application with every one of these
mistakes. The cats deserve better paperwork.

### Your goal

1. Pair a `label[for]` with an `id` on the name field, and on the email
   field — which also becomes `type="email"`.
2. Wrap the two radios in a `fieldset` with the legend "Your home";
   give each radio an `id` (`home-apartment`, `home-house`) and its own
   label.
3. Replace the div with a real `<button type="submit">`.
