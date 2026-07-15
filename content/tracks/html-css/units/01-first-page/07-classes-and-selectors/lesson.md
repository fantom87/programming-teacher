---
id: 07-classes-and-selectors
title: Classes and Selectors
language: html-css
runner: browser
estMinutes: 12
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Give one paragraph the class highlight and another the class note, then style them: .highlight gets background-color yellow, .note gets color gray."
docs: [html-css/selectors]
checks:
  - id: classes-in-html
    type: dom
    assertions:
      - { selector: ".highlight", exists: true }
      - { selector: ".note", exists: true }
  - id: highlight-rule
    type: dom
    assertions:
      - { selector: ".highlight", cssRule: { property: "background-color", equals: "yellow" } }
  - id: note-rule
    type: dom
    assertions:
      - { selector: ".note", cssRule: { property: "color", equals: "gray" } }
hints:
  - "Add a class in the HTML: <p class=\"highlight\">...</p>"
  - "Select it in CSS with a leading dot: .highlight { background-color: yellow; }"
  - "The dot only appears in the CSS selector — never inside the class attribute."
---
## Naming your elements

Last lesson you styled *every* `h1` and the whole `body`. But what if two
paragraphs should look different from each other? Tag selectors can't help —
they're all `<p>`. You need to give elements names.

That's what the `class` attribute does:

```html
<p class="warning">Do not feed the compiler after midnight.</p>
```

And in CSS, a **class selector** — a dot followed by the class name — picks up
every element carrying it:

```css
.warning {
  color: red;
}
```

Two details people trip on for years, so nail them today. First: the dot lives
only in the CSS. It's `class="warning"` in HTML, `.warning` in the stylesheet.
Second: classes are reusable in both directions — many elements can share one
class, and one element can wear several (`class="warning urgent"`, separated
by spaces).

This is the workhorse of real-world CSS. Tag selectors set broad defaults;
classes handle everything specific.

### Your goal

The starter page has three paragraphs of field notes.

1. In `index.html`: give the key-finding paragraph `class="highlight"` and the
   side-comment paragraph `class="note"`.
2. In `styles.css`: write a `.highlight` rule with `background-color: yellow`.
3. Add a `.note` rule with `color: gray`.

The middle paragraph should light up and the last one should fade back.
