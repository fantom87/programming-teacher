---
id: 03-flexbox-grid-drills
title: Flexbox and Grid Drills
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Three layout drills on the Night Market: a space-between flex toolbar, an auto-fit grid gallery of minmax(180px, 1fr) columns, and every card's Visit link pinned to the bottom with a column flex plus margin-top: auto."
docs: [html-css/flexbox, html-css/grid]
checks:
  - id: toolbar-flexed
    type: dom
    assertions:
      - { selector: ".toolbar", cssRule: { property: "display", equals: "flex" } }
      - { selector: ".toolbar", cssRule: { property: "justify-content", equals: "space-between" } }
      - { selector: ".toolbar", cssRule: { property: "align-items", equals: "center" } }
  - id: gallery-grid
    type: dom
    assertions:
      - { selector: ".gallery", cssRule: { property: "display", equals: "grid" } }
      - { selector: ".gallery", cssRule: { property: "grid-template-columns", equals: "repeat(auto-fit, minmax(180px, 1fr))" } }
      - { selector: ".gallery", cssRule: { property: "gap", equals: "1rem" } }
  - id: card-column
    type: dom
    assertions:
      - { selector: ".card", cssRule: { property: "display", equals: "flex" } }
      - { selector: ".card", cssRule: { property: "flex-direction", equals: "column" } }
  - id: pinned-link
    type: dom
    assertions:
      - { selector: ".visit", cssRule: { property: "margin-top", equals: "auto" } }
  - id: layout-not-faked
    type: ai-judge
    rubric: "The three layouts come from flex and grid, not workarounds: no floats, no absolute positioning, no media queries, and index.html is untouched. The gallery's column count derives from repeat(auto-fit, minmax(180px, 1fr)) so the browser decides how many columns fit — not a fixed repeat(3, 1fr) or hand-set widths. The Visit link pins via margin-top: auto on the .visit rule inside a display: flex; flex-direction: column card — not via positioning or fixed card heights."
hints:
  - "Toolbar: display: flex; justify-content: space-between; align-items: center; — the main axis spreads brand and nav apart, the cross axis centers them."
  - "Gallery: grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; — typed exactly. auto-fit means the browser does the column math at every width."
  - "Card: display: flex; flex-direction: column; then add margin-top: auto to the existing .visit rule — auto margins in flex soak up the free space, shoving the link to the bottom."
---
## The four lines you type daily

Layout refresher, compressed to its working core: **flex lays out one
axis, grid lays out two.** A toolbar is one axis. A gallery is two.

Drill 1 — the toolbar. Brand left, links right, both vertically
centered:

```css
display: flex;
justify-content: space-between;  /* main axis: push apart */
align-items: center;             /* cross axis: center    */
```

Drill 2 — the gallery. Six stall cards; the column count is the
browser's decision, recomputed at every width:

```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
gap: 1rem;
```

Read it inside out: each column may shrink to 180px and grow to an
equal share; `auto-fit` packs in as many as fit. One line replaces
three media queries. Drag the preview divider and count the columns
change.

Drill 3 — the ragged bottoms. Cards in one row share a height, but
"Wind-up crabs." is shorter than the dumpling pitch, so its Visit link
floats mid-card. The fix is the flex idiom worth re-memorizing: make
the card a column, then give the link `margin-top: auto`. **Auto
margins in flex absorb all free space** — whatever height the blurb
doesn't use, the margin eats, and the link lands on the floor of every
card.

### Your goal

1. `.toolbar`: flex, `space-between`, centered cross axis.
2. `.gallery`: grid with `repeat(auto-fit, minmax(180px, 1fr))` and a
   `1rem` gap — typed exactly.
3. `.card` becomes a flex column and `.visit` gets `margin-top: auto`
   so every link sits level.
