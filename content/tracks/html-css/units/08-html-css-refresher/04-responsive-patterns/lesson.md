---
id: 04-responsive-patterns
title: Responsive Patterns
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Three responsive patterns from memory: the fluid frame on .wrap (64rem cap, centered, clamp() gutters), one mobile-first @media (min-width: 720px) block flipping .layout to 2fr 1fr and .nav-list to a row, and a clamp() headline of your own design."
docs: [html-css/responsive-design, html-css/grid]
checks:
  - id: fluid-frame
    type: dom
    assertions:
      - { selector: ".wrap", cssRule: { property: "max-width", equals: "64rem" } }
      - { selector: ".wrap", cssRule: { property: "margin-inline", equals: "auto" } }
      - { selector: ".wrap", cssRule: { property: "padding-inline", equals: "clamp(1rem, 4vw, 2.5rem)" } }
  - id: wide-overrides
    type: dom
    assertions:
      - { selector: ".layout", cssRule: { property: "grid-template-columns", equals: "2fr 1fr" } }
      - { selector: ".nav-list", cssRule: { property: "flex-direction", equals: "row" } }
  - id: mobile-first-shape
    type: ai-judge
    rubric: "Both wide-screen overrides (.layout to grid-template-columns: 2fr 1fr and .nav-list to flex-direction: row) live inside a single @media (min-width: 720px) block placed after the base rules — min-width, not max-width. The base rules are unedited: outside the media query .layout still reads grid-template-columns: 1fr and .nav-list still reads flex-direction: column, so narrow screens get the stacked layout with no query at all. The .site-title font-size is now a clamp() whose floor and ceiling are rem values with a vw-based middle term (exact numbers may vary); no fixed font-size remains on it. index.html is untouched and keeps its viewport meta tag."
hints:
  - ".wrap, typed exactly: max-width: 64rem; margin-inline: auto; padding-inline: clamp(1rem, 4vw, 2.5rem); — cap, center, fluid gutters."
  - "One block after the base rules: @media (min-width: 720px) { .layout { grid-template-columns: 2fr 1fr; } .nav-list { flex-direction: row; } } — min-width is the mobile-first direction."
  - "The headline clamp is yours to tune: font-size: clamp(1.5rem, 4vw, 2.75rem) reads 'never below 1.5rem, never above 2.75rem, fluid in between.' Drag the preview divider to test all three regimes."
---
## Three patterns, one direction

Responsive work is three moves, all mobile-first: style the narrow
case as the base, then *add* wider behavior behind `min-width` queries.
The reverse — `max-width` — makes desktop the default and phones the
afterthought.

Pattern 1 — **the fluid frame.** Every content site wraps in one:

```css
.wrap {
  max-width: 64rem;                       /* stop growing   */
  margin-inline: auto;                    /* stay centered  */
  padding-inline: clamp(1rem, 4vw, 2.5rem); /* fluid gutters */
}
```

Pattern 2 — **the additive breakpoint.** Base `.layout` is one column
and `.nav-list` stacks — right for phones, no query needed.
At 720px, override both in one block *after* the base rules:

```css
@media (min-width: 720px) {
  .layout   { grid-template-columns: 2fr 1fr; }
  .nav-list { flex-direction: row; }
}
```

A media query adds no specificity; it wins by coming later. Put it
above the base rules and the base wins — classic facepalm.

Pattern 3 — **the fluid headline.** Between breakpoints, fixed type
just sits there. `clamp(rem, vw, rem)` glides instead: floor, fluid
middle, ceiling. The numbers are taste; the shape is the pattern.
Replace the `.site-title`'s fixed `2rem` with a clamp you'd defend.

The preview divider is your device lab: drag it and watch the facts
box drop below the story at 720px.

### Your goal

1. `.wrap` gets the fluid frame, typed exactly.
2. One `@media (min-width: 720px)` block after the base rules:
   `.layout` to `2fr 1fr`, `.nav-list` to `row`.
3. `.site-title` goes fluid with a rem–vw–rem `clamp()` of your own.
