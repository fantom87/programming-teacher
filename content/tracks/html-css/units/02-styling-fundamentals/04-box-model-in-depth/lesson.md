---
id: 04-box-model-in-depth
title: The Box Model, In Depth
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Add a * rule with box-sizing border-box so the panels' width means what it says, then give .panel the two-value shorthand padding 16px 24px."
docs: [html-css/box-model]
checks:
  - id: border-box-everywhere
    type: dom
    assertions:
      - { selector: "*", cssRule: { property: "box-sizing", equals: "border-box" } }
  - id: panel-padding-shorthand
    type: dom
    assertions:
      - { selector: ".panel", cssRule: { property: "padding", equals: "16px 24px" } }
  - id: panel-width-kept
    type: dom
    assertions:
      - { selector: ".panel", cssRule: { property: "width", equals: "280px" } }
hints:
  - "The universal selector is a lone asterisk: * { box-sizing: border-box; }"
  - "Put the * rule at the very top of the stylesheet — it's a page-wide default."
  - "Two values in padding: first is top-and-bottom, second is left-and-right: padding: 16px 24px;"
---
## What "width" really means

Last unit you learned the layers: content, padding, border, margin. Here's
the part nobody warns you about. By default, `width` sets only the *content*
width — padding and border stack **on top of it**.

Look at the starter panels:

```css
.panel {
  width: 280px;
  padding: 20px;
  border: 4px solid darkslateblue;
}
```

Real width on screen: 280 + 20 + 20 + 4 + 4 = **328px**. You wrote 280, you
got 328. Every padding tweak silently resizes the box, and layouts drift in
ways that make grown developers sigh.

CSS has a switch that makes `width` mean the *whole visible box*, border and
padding included:

```css
* {
  box-sizing: border-box;
}
```

Two new things in three lines. The `*` is the **universal selector** — it
matches every element, which is exactly right for a page-wide default like
this. And `border-box` flips the math: the box is 280px, period, and padding
carves space *inside* it. Nearly every production stylesheet on the web opens
with this rule.

While you're in there, meet the multi-value **padding shorthand**:

```css
padding: 16px 24px;
```

Two values: the first is top *and* bottom, the second is left *and* right.
(Four values go clockwise from the top — you'll meet that form soon enough.)
Text usually wants more side padding than top, so this pair reads better than
a single fat value on all four sides.

### Your goal

In `styles.css`:

1. Add `* { box-sizing: border-box; }` at the very top.
2. Change the `.panel` padding to the two-value form `padding: 16px 24px;`
3. Keep `width: 280px;` on the panels — now it's the truth.

Watch the panels when the `*` rule lands: they tighten to exactly 280px.
