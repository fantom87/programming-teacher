---
id: 07-flex-or-grid
title: Flex or Grid?
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Pick the right tool twice: make .tag-row a wrapping flex row (flex-wrap: wrap, gap: 8px) and .shelf a grid with grid-template-columns: repeat(4, 1fr) and gap: 12px."
docs: [html-css/flexbox, html-css/grid]
checks:
  - id: tags-flex-wrap
    type: dom
    assertions:
      - { selector: ".tag-row", cssRule: { property: "flex-wrap", equals: "wrap" } }
      - { selector: ".tag-row", cssRule: { property: "gap", equals: "8px" } }
  - id: shelf-columns
    type: dom
    assertions:
      - { selector: ".shelf", cssRule: { property: "grid-template-columns", equals: "repeat(4, 1fr)" } }
      - { selector: ".shelf", cssRule: { property: "gap", equals: "12px" } }
  - id: right-tool-each
    type: ai-judge
    rubric: "Each container uses the layout that fits its content: .tag-row has display: flex (with flex-wrap: wrap) — a one-dimensional row that wraps — and .shelf has display: grid with a column template — a two-dimensional arrangement. Using grid for the tags or flex for the shelf, or omitting the display declarations so the wrap/column rules are inert, does not meet the goal."
hints:
  - "Tags: .tag-row { display: flex; flex-wrap: wrap; gap: 8px; } — flex, because the tags just flow along a line."
  - "Covers: .shelf { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; } — grid, because the shelf is columns AND rows."
  - "The tell: tags keep their own widths and wrap like words (flex); the covers must line up in strict columns (grid)."
---
## Two tools, one question

You now own both layout systems, which raises the eternal code-review
question: *should this be flex or grid?* Here's the rule professionals
actually use:

**How many directions am I designing?**

- **One direction** — things flowing along a line, each keeping its natural
  size, wrapping if needed → **flexbox**. The *content* shapes the layout.
- **Two directions** — things that must line up in columns *and* rows →
  **grid**. The *layout* shapes the content.

Your bookshelf page has one of each, which is extremely normal — real
pages mix the two constantly, choosing per component.

**The genre tags** are a one-direction problem. Each tag should be as wide
as its word, they flow along a line, and when the line fills they should
wrap to the next — like words in a sentence. That's flexbox, plus one new
friend:

```css
.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
```

Without `flex-wrap: wrap`, a flex row *squeezes* its items rather than let
them wrap. With it, overflowing items drop to a new line — squash the
preview narrower and watch them reflow.

**The book covers** are a two-direction problem. Covers must align in neat
columns with rows that stay ruler-straight — identical widths, shared
gutters. The content shouldn't negotiate; the layout dictates. That's
grid: `repeat(4, 1fr)` and every cover snaps to the template.

Notice what stays the same either way: `display` and `gap` on the
container, children just along for the ride.

### Your goal

In `styles.css`:

1. `.tag-row` — `display: flex;`, `flex-wrap: wrap;`, `gap: 8px;`.
2. `.shelf` — `display: grid;`,
   `grid-template-columns: repeat(4, 1fr);`, `gap: 12px;`.

Then narrow the preview: tags rewrap freely; the shelf keeps its strict
four columns.
