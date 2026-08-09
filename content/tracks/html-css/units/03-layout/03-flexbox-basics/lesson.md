---
id: 03-flexbox-basics
title: Flexbox Basics
language: html-css
runner: browser
estMinutes: 12
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Turn the stacked list of links into a horizontal pill navigation: display: flex on .pill-nav, spaced with gap: 12px."
docs: [html-css/flexbox]
checks:
  - id: nav-gap
    type: dom
    assertions:
      - { selector: ".pill-nav", cssRule: { property: "gap", equals: "12px" } }
  - id: nav-is-flex-row
    type: ai-judge
    rubric: "styles.css gives .pill-nav the declaration display: flex, so its list items sit in a horizontal row instead of stacking. The rule must target the list container (.pill-nav), not the items — display: flex on .pill-nav a or on li does not create the row."
hints:
  - "Both declarations go on the container — the .pill-nav rule, not the links."
  - "display: flex; turns .pill-nav's children (the li elements) into a row."
  - "gap: 12px; puts space between flex items — no margins needed."
---
## One property, instant row

Blocks stack. You proved it in lesson one, and you fought it with
`inline-block`. Flexbox is the modern, purpose-built answer, and it starts
with a single declaration on a **container**:

```css
.pill-nav {
  display: flex;
}
```

That one line changes the rules *inside* the container: its direct
children stop being stacked blocks and become **flex items**, laid out
along a row. The children's own CSS doesn't change — the parent simply
took charge of arranging them. That's the flexbox mindset, and it never
changes: **style the container to arrange the items.**

Spacing between items used to mean fiddly margins on every child plus a
special case for the last one. Flexbox replaced all of that with `gap`:

```css
.pill-nav {
  display: flex;
  gap: 12px;
}
```

One declaration, even spacing between every pair of items, nothing to
undo at the ends.

The direction is steerable, too. `flex-direction: row` is the default;
`column` stacks the items again (but under flexbox's control — `gap`
still works). After your row appears, try `flex-direction: row-reverse`
for a moment just to feel the container's power, then put it back.

In the preview you have a vertical list of links styled as pills — a
classic navigation menu waiting to happen.

### Your goal

In `styles.css`, in the `.pill-nav` rule:

1. Add `display: flex;` — the stack becomes a row.
2. Add `gap: 12px;` — the pills get breathing room.
