---
id: 08-boxes-and-spacing
title: Boxes and Spacing
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Style the .card boxes with a border of 2px solid darkblue, padding of 16px, and a margin-bottom of 24px."
docs: [html-css/box-model]
checks:
  - id: cards-present
    type: dom
    assertions:
      - { selector: ".card", count: 2 }
  - id: card-border
    type: dom
    assertions:
      - { selector: ".card", cssRule: { property: "border", equals: "2px solid darkblue" } }
  - id: card-padding
    type: dom
    assertions:
      - { selector: ".card", cssRule: { property: "padding", equals: "16px" } }
  - id: card-margin
    type: dom
    assertions:
      - { selector: ".card", cssRule: { property: "margin-bottom", equals: "24px" } }
hints:
  - "border takes three values at once: border: 2px solid darkblue;"
  - "padding is space INSIDE the border; margin is space OUTSIDE it."
  - "margin-bottom: 24px; pushes only downward — perfect for stacking cards."
---
## Everything is a box

Here's the secret the whole web is built on: every element is a rectangular
box. Around each box, CSS gives you three layers of control, from the inside
out:

- **padding** — breathing room *inside* the box, between the content and its
  edge
- **border** — the visible edge itself
- **margin** — empty space *outside* the box, pushing neighbors away

Think of a framed photo: the photo is the content, the matte is the padding,
the frame is the border, and the gap between frames on the wall is the margin.

```css
.card {
  border: 2px solid darkblue;
  padding: 16px;
  margin-bottom: 24px;
}
```

The `border` line is a **shorthand** — it sets three things at once:
thickness, line style, color. Real CSS also accepts the three longhand
properties (`border-width`, `border-style`, `border-color`), but this lesson
practices the shorthand, and its checker looks for exactly that one-line
form: `border: 2px solid darkblue;`.

The padding here applies to all four sides. And `margin-bottom` pushes down
only, which is the classic way to space a stack of boxes: each card shoves the
next one 24 pixels lower.

Until an element has a border or background, padding and margin are invisible —
which is why this lesson gives you cards to style. Once the border appears,
you'll *see* the spacing.

### Your goal

The starter page has two `.card` boxes with no styling — cramped and
borderless. In `styles.css`, write one `.card` rule that gives them:

1. `border: 2px solid darkblue;`
2. `padding: 16px;`
3. `margin-bottom: 24px;`

Watch the preview as you add each line — you'll see all three layers appear.
