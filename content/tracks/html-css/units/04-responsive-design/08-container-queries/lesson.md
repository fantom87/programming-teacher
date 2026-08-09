---
id: 08-container-queries
title: Container Queries
language: html-css
runner: browser
estMinutes: 18
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Make the recipe card respond to its slot instead of the screen: give .card-slot container-type: inline-size, then an @container (min-width: 420px) block that flips .card to grid-template-columns: 6rem 1fr."
docs: [html-css/responsive-design, html-css/grid]
checks:
  - id: slots-are-containers
    type: dom
    assertions:
      - { selector: ".card-slot", cssRule: { property: "container-type", equals: "inline-size" } }
  - id: card-responds-to-container
    type: dom
    assertions:
      - { selector: ".card", cssRule: { property: "grid-template-columns", equals: "6rem 1fr" } }
  - id: container-not-viewport
    type: ai-judge
    rubric: "The wide-card override (grid-template-columns: 6rem 1fr on .card) lives inside an @container (min-width: 420px) block — an @container at-rule, not @media. container-type: inline-size is declared on .card-slot, the wrapper, and NOT on .card itself (an element can't respond to a query on its own container box). The base .card rule outside any query still says grid-template-columns: 1fr, so narrow slots keep the stacked layout."
hints:
  - "Two steps: declare the container (.card-slot { container-type: inline-size; }), then query it (@container (min-width: 420px) { ... })."
  - "Inside the @container block write an ordinary rule: .card { grid-template-columns: 6rem 1fr; } — same override grammar as @media, different question being asked."
  - "The container must be an ancestor of what you style — putting container-type on .card itself does nothing for .card's own rules. That's exactly why the .card-slot wrapper exists."
---
## Ask the container, not the screen

Here's the crack in everything this unit has taught so far. The starter page
shows the *same* recipe card twice: once in the wide main column, once in
the narrow sidebar. Suppose a media query flips cards horizontal on wide
screens. On a desktop, the viewport is wide — so **both** cards go
horizontal, including the sidebar one crammed into 220px. The media query
answered the wrong question. The card doesn't care how wide the *screen* is;
it cares how wide *its slot* is.

**Container queries** ask the right question. Two steps. First, mark the
slot as a container worth measuring:

```css
.card-slot {
  container-type: inline-size; /* "measure my width" */
}
```

Then query *that* instead of the viewport:

```css
@container (min-width: 420px) {
  .card {
    grid-template-columns: 6rem 1fr; /* art beside text */
  }
}
```

Same condition syntax, same override-the-base cascade logic as `@media` —
but the rule reads "when **my container** is at least 420px." Each card
consults its own slot: the main-column card finds room and goes horizontal;
the sidebar card, on the very same screen, stays stacked. One component,
correct in both places, no special-case classes.

One rule trips everyone once: an element can't respond to a query on
itself — the container must be an **ancestor** of the thing you style.
That's why the HTML wraps each card in a `.card-slot` div: slot measures,
card reacts.

Drag the preview divider and enjoy the show: the layout's own media query
(lesson 2, alive and well below 700px) moves the sidebar around, and each
card independently decides its shape based on the space it actually got.
This is how component libraries are written now — and it's the perfect
last word for this unit: responsive to *available space*, wherever that
space comes from.

### Your goal

In `styles.css`:

1. `.card-slot { container-type: inline-size; }`
2. An `@container (min-width: 420px)` block setting
   `.card { grid-template-columns: 6rem 1fr; }`

The base `.card` rule stays `1fr` — narrow slots still need the stack.
