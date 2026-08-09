---
id: 05-display-values
title: Display Values
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Turn the .tag spans into inline-block pills (background lavender, padding 2px 10px, border-radius 999px) and hide the .draft paragraph with display none — without deleting it from the HTML."
docs: [html-css/box-model, html-css/selectors]
checks:
  - id: markup-intact
    type: dom
    assertions:
      - { selector: ".tag", count: 3 }
      - { selector: ".draft", exists: true }
  - id: pill-styling
    type: dom
    assertions:
      - { selector: ".tag", cssRule: { property: "background-color", equals: "lavender" } }
      - { selector: ".tag", cssRule: { property: "padding", equals: "2px 10px" } }
      - { selector: ".tag", cssRule: { property: "border-radius", equals: "999px" } }
  - id: display-choices
    type: ai-judge
    rubric: "The stylesheet sets .tag to display: inline-block (so the pill padding takes effect while the tags still sit in a row) and hides .draft with display: none. The .draft element must still be present in the HTML — hidden by CSS, not deleted."
hints:
  - "Spans are inline. Switch them: .tag { display: inline-block; } then padding behaves."
  - "border-radius: 999px is the classic pill trick — any huge value rounds the ends fully."
  - "Hide, don't delete: .draft { display: none; } removes it from the page but keeps the HTML."
---
## Block, inline, and the useful in-between

Every element ships with a default answer to one question: *how do I share a
line?* `display: block` elements (`p`, `div`, `h1`) claim the full row and
stack. `display: inline` elements (`span`, `a`, `strong`) flow along inside
text like words.

Inline has a catch you're about to hit: it ignores `width` and treats
vertical padding as decoration that doesn't push neighbors away. Try to make
an inline `span` into a padded badge and the padding overlaps the lines
around it.

The fix is the in-between value:

```css
.tag {
  display: inline-block;
}
```

**Inline-block** sits in the flow of a line like inline — but takes real
width, height, and padding like block. It's the natural choice for badges,
pills, and anything word-shaped that needs a box around it.

And one more value you'll use constantly:

```css
.draft {
  display: none;
}
```

`none` removes the element from the page entirely — no box, no gap where it
was. The HTML stays put; only the rendering disappears. That's how real sites
tuck away modals, menus, and unfinished content.

The starter page is a blog post with three topic tags cramped at the top and
an embarrassing half-written draft note at the bottom that shouldn't ship.

### Your goal

In `styles.css`:

1. Make `.tag` a pill: `display: inline-block;`,
   `background-color: lavender;`, `padding: 2px 10px;`, and
   `border-radius: 999px;`
2. Hide the leftover note: `.draft { display: none; }` — leave its HTML
   exactly where it is.

Three tidy pills in a row, no draft in sight.
