---
id: 03-responsive-layout
title: "Capstone 3: The Responsive Pass"
language: html-css
runner: browser
estMinutes: 30
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Lay the site out mobile-first: the viewport meta, a wrapping flex header, a 70rem centered main, fluid images, and a film grid that steps from one column to two at 40rem and four at 64rem."
docs: [html-css/responsive-design, html-css/grid, html-css/flexbox]
checks:
  - id: viewport-meta
    type: dom
    assertions:
      - { selector: "meta[name=viewport]", attr: "content", equals: "width=device-width, initial-scale=1" }
  - id: header-flex
    type: dom
    assertions:
      - { selector: ".site-header", cssRule: { property: "display", equals: "flex" } }
      - { selector: ".site-header", cssRule: { property: "flex-wrap", equals: "wrap" } }
      - { selector: ".site-header", cssRule: { property: "justify-content", equals: "space-between" } }
      - { selector: ".site-header", cssRule: { property: "align-items", equals: "center" } }
  - id: centered-container
    type: dom
    assertions:
      - { selector: "main", cssRule: { property: "max-width", equals: "70rem" } }
      - { selector: "main", cssRule: { property: "margin-inline", equals: "auto" } }
      - { selector: "main", cssRule: { property: "padding-inline", equals: "1.25rem" } }
  - id: stepping-film-grid
    type: dom
    assertions:
      - { selector: ".film-grid", cssRule: { property: "display", equals: "grid" } }
      - { selector: ".film-grid", cssRule: { property: "gap", equals: "1.25rem" } }
      - { selector: ".film-grid", cssRule: { property: "list-style", equals: "none" } }
      - { selector: ".film-grid", cssRule: { property: "grid-template-columns", equals: "repeat(4, 1fr)" } }
      - { selector: "img", cssRule: { property: "max-width", equals: "100%" } }
  - id: mobile-first-audit
    type: ai-judge
    rubric: "A mobile-first layout pass over the existing structure (the HTML changes only by gaining the viewport meta). (1) Base rules are the narrow layout: .film-grid has display grid and a gap but NO grid-template-columns in its base rule (or an explicit single 1fr column) — the column counts live only inside min-width media queries placed after the base rules: repeat(2, 1fr) at 40rem and repeat(4, 1fr) at 64rem, in that order, with no max-width (desktop-first) queries anywhere. (2) Nothing can force horizontal scroll on a phone: no fixed pixel widths on containers, the header and its nav are flex with wrap enabled, images are capped with max-width 100% and height auto. (3) The ul's list bullets are removed and its default padding zeroed, so the cards read as cards, and each card has visible bounds (border and padding) with the hero given real vertical breathing room via padding. (4) The table and address remain readable and inside the centered 70rem container. Layout only this session — introducing brand colors or fonts beyond the existing stack should be noted as jumping ahead, though not a failure."
hints:
  - "First line of business, in the head: <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> — typed exactly, or the phone renders a zoomed-out desktop fake."
  - "Header and container: .site-header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; } (give nav its own display: flex and gap), then main { max-width: 70rem; margin-inline: auto; padding-inline: 1.25rem; }."
  - "Grid base has no columns: .film-grid { display: grid; gap: 1.25rem; list-style: none; padding: 0; } — then, after the base rules, @media (min-width: 40rem) sets grid-template-columns: repeat(2, 1fr) and @media (min-width: 64rem) sets repeat(4, 1fr), spaces exactly as shown."
---
## The responsive pass

"Most regulars book from their phones." That line in the brief is a
spec: the phone layout is the *design*, and wide screens get
enhancements. You built this pattern for a term — today you run it on
your own site, in one pass.

Start with the line that makes phones tell the truth:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Then the base rules — which *are* the phone layout. The header goes
flex with `flex-wrap: wrap`, brand left, nav right, collapsing
gracefully to two rows when a narrow screen demands it. `main` becomes
the classic centered column: `max-width: 70rem`,
`margin-inline: auto`, `padding-inline: 1.25rem` so text never touches
glass. Images get the fluid treatment (`max-width: 100%`,
`height: auto`) — the facade photo is wider than any phone.

The film grid is the wireframe's promise finally kept, and it steps:

```css
.film-grid {
  display: grid;
  gap: 1.25rem;
  list-style: none;
  padding: 0;
}
@media (min-width: 40rem) {
  .film-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 64rem) {
  .film-grid { grid-template-columns: repeat(4, 1fr); }
}
```

Note what the base rule *doesn't* say: no columns. A grid with no
template is a single column — the phone layout for free. The two
`min-width` blocks sit **after** the base rules and only add what
bigger screens earn: two across on a tablet, the full four-across
marquee row on a desktop. No `max-width` queries anywhere; we never
subtract, only add.

Finish the pass with card bounds (border, padding, a small radius),
hero breathing room (`padding-block: 3rem`), and a footer that doesn't
hug the edge. Then drag the preview divider from phone-narrow to full
width and watch every breakpoint do its job.

### Your goal

1. Viewport meta, typed exactly; wrapping flex header; centered
   `70rem` main with inline padding.
2. `.film-grid`: grid + gap in the base with no columns, stepping to
   `repeat(2, 1fr)` at `40rem` and `repeat(4, 1fr)` at `64rem`.
3. Fluid images, bulletless cards with visible bounds, and nothing
   that scrolls sideways on a phone.
