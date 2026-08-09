---
id: 03-mobile-first
title: Mobile-First
language: html-css
runner: browser
estMinutes: 18
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Layer two ascending min-width breakpoints over the phone-first base: at 640px the print gallery goes to repeat(2, 1fr) and .page padding-inline grows to 2rem; at 960px the gallery reaches repeat(3, 1fr)."
docs: [html-css/responsive-design, html-css/grid]
checks:
  - id: tablet-padding
    type: dom
    assertions:
      - { selector: ".page", cssRule: { property: "padding-inline", equals: "2rem" } }
  - id: desktop-columns
    type: dom
    assertions:
      - { selector: ".cards", cssRule: { property: "grid-template-columns", equals: "repeat(3, 1fr)" } }
  - id: mobile-first-structure
    type: ai-judge
    rubric: "The stylesheet is genuinely mobile-first. Base rules outside any @media still define the one-column phone layout (.cards at grid-template-columns: 1fr, .page at padding-inline: 1rem) and were not edited. Exactly two media queries, both min-width, in ascending order: (min-width: 640px) sets .cards to repeat(2, 1fr) and .page to padding-inline: 2rem; (min-width: 960px) sets .cards to repeat(3, 1fr). No max-width queries anywhere, and the 960px block comes after the 640px block so the three-column rule actually wins on wide screens."
hints:
  - "Two blocks, both min-width, smaller first: @media (min-width: 640px) { ... } then @media (min-width: 960px) { ... }"
  - "The 640px block holds .cards { grid-template-columns: repeat(2, 1fr); } and .page { padding-inline: 2rem; } — the 960px block holds only .cards { grid-template-columns: repeat(3, 1fr); }"
  - "Order is load-bearing: on a 1200px screen BOTH blocks apply, and the later three-column rule must win. Ascending min-widths make that automatic."
---
## Design from the phone up

You could write yesterday's page the other way around: desktop styles as the
default, then a `@media (max-width: ...)` block *undoing* them for phones.
Plenty of old stylesheets do. It's a losing game — every desktop flourish
becomes a thing to subtract, and forgetting one leaves phone users with a
broken page.

**Mobile-first** flips the deal. The base stylesheet — no media queries —
describes the narrow version: one column, modest padding, nothing that needs
room. That version works *everywhere*, on the oldest browser you'll ever
meet. Then `min-width` blocks layer on enhancements as space appears:

```css
/* base: phone, always true */
@media (min-width: 640px) { /* roomier */ }
@media (min-width: 960px) { /* roomiest */ }
```

Ascending order matters. On a 1200px screen *all* of those apply, and
last-wins settles any property they both touch — so each wider block only
states what *changes*, never repeating the rest. Notice the 640px block
below adjusts padding and columns, while the 960px block is one line.

Where do the numbers come from? Not from a list of devices — there are
thousands. Drag the preview divider and watch the starter's print gallery:
one column starts looking lonely somewhere around 640px; two columns start
feeling cramped again around 960px. **Breakpoints live where the content
breaks**, and you find them by looking.

The starter's base styles are finished phone styles: `.cards` at
`grid-template-columns: 1fr`, `.page` at `padding-inline: 1rem` (the
inline pair — left and right — in one property). Your job is purely
additive.

### Your goal

Below the base rules in `styles.css`, add two blocks in ascending order:

1. `@media (min-width: 640px)` — `.cards` to `repeat(2, 1fr)`, `.page` to
   `padding-inline: 2rem`.
2. `@media (min-width: 960px)` — `.cards` to `repeat(3, 1fr)`.

The base rules stay untouched; every screen narrower than 640px depends on
them.
