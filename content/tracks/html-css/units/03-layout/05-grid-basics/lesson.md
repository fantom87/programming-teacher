---
id: 05-grid-basics
title: Grid Basics
language: html-css
runner: browser
estMinutes: 14
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Turn the stacked tiles into a gallery: display: grid on .gallery with grid-template-columns: repeat(3, 1fr) and gap: 16px."
docs: [html-css/grid]
checks:
  - id: three-columns
    type: dom
    assertions:
      - { selector: ".gallery", cssRule: { property: "grid-template-columns", equals: "repeat(3, 1fr)" } }
  - id: gallery-gap
    type: dom
    assertions:
      - { selector: ".gallery", cssRule: { property: "gap", equals: "16px" } }
  - id: gallery-is-grid
    type: ai-judge
    rubric: "styles.css gives .gallery the declaration display: grid, so the grid-template-columns and gap rules take effect and the tiles arrange into a 3-column grid. Column and gap declarations without display: grid on .gallery do not meet the goal."
hints:
  - "All three declarations go on the container: the .gallery rule."
  - "display: grid; plus grid-template-columns: repeat(3, 1fr); — write the value exactly like that, with the space after the comma."
  - "1fr means one share of the free space — three 1fr columns split the row into equal thirds. gap: 16px; spaces both directions at once."
---
## Rows AND columns

Flexbox thinks in a line. **Grid** thinks in a checkerboard: you declare
columns (and rows, if you like) on the container, and every child snaps
into the next open cell — left to right, top to bottom, like text fills a
page.

Like flexbox, everything happens on the container:

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
```

Three new ideas in three lines:

**`grid-template-columns`** declares the column pattern. You could write
widths like `200px 200px 200px`, but pixels don't share leftover space.

**`fr`** — the *fraction* unit, invented for grid — does. `1fr` means "one
share of the free space," so `1fr 1fr 1fr` gives three equal columns that
grow and shrink with the container. Make the middle one `2fr` and it takes
twice the share. Try it once your grid appears.

**`repeat(3, 1fr)`** is shorthand for `1fr 1fr 1fr` — indispensable once
designs call for six or twelve columns.

And `gap` you already know from flexbox, except here it's two-dimensional:
one declaration spaces both columns *and* rows. (It accepts two values —
`gap: 24px 16px;` is rows then columns — but one value for both is the
common case.)

The preview has six recipe tiles in one long stack. Six children, three
columns — grid will wrap them into two tidy rows without you saying
anything about rows at all.

### Your goal

In `styles.css`, in the `.gallery` rule:

1. Add `display: grid;`
2. Add `grid-template-columns: repeat(3, 1fr);` — exactly three equal columns.
3. Add `gap: 16px;`

You should see a 3 × 2 gallery of tiles with even gutters.
