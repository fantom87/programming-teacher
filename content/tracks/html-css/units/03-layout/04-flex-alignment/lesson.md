---
id: 04-flex-alignment
title: Flex Alignment
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Build the classic navbar: .site-header becomes a flex row with justify-content: space-between and align-items: center, and .nav-links becomes a flex row with gap: 16px."
docs: [html-css/flexbox, html-css/semantic-html]
checks:
  - id: header-distribution
    type: dom
    assertions:
      - { selector: ".site-header", cssRule: { property: "justify-content", equals: "space-between" } }
      - { selector: ".site-header", cssRule: { property: "align-items", equals: "center" } }
  - id: links-gap
    type: dom
    assertions:
      - { selector: ".nav-links", cssRule: { property: "gap", equals: "16px" } }
  - id: navbar-works
    type: ai-judge
    rubric: "Both containers are actually flex containers: .site-header and .nav-links each have display: flex in styles.css, so the justify-content/align-items on .site-header and the gap on .nav-links take effect. Setting those alignment properties without display: flex on the same selector does not meet the goal."
hints:
  - "Neither justify-content nor align-items does anything until the same rule also says display: flex;"
  - ".site-header needs: display: flex; justify-content: space-between; align-items: center;"
  - ".nav-links is a flex container of its own: display: flex; gap: 16px; — a flex item can be a flex container too."
---
## The two axes

A flex container arranges items along a **main axis** (the row direction)
and aligns them on the **cross axis** (the perpendicular). Two properties
control the two axes, and telling them apart unlocks all of flexbox:

- `justify-content` — distributes items **along** the row: `flex-start`,
  `center`, `space-between`, `space-around`.
- `align-items` — aligns items **across** the row: `stretch`, `center`,
  `flex-start`, `flex-end`.

Your mission is the most-built component on the entire web: a navbar with
the logo on the left, links on the right, everything vertically centered.
Watch how little it takes:

```css
.site-header {
  display: flex;
  justify-content: space-between;  /* push apart along the row */
  align-items: center;             /* center across the row */
}
```

`space-between` shoves the first item to one end and the last to the
other, sharing leftovers between. With exactly two children — logo and
nav — that's "logo left, links right" with zero effort. `align-items:
center` then lines up their vertical midpoints, so the small logo text
and the taller link pills sit on a shared centerline instead of hanging
from the top.

One more trick: the nav itself holds several links, so make *it* a flex
container too. A flex item can absolutely be a flex container — nesting
is how real layouts compose:

```css
.nav-links {
  display: flex;
  gap: 16px;
}
```

### Your goal

In `styles.css`:

1. Make `.site-header` a flex container with
   `justify-content: space-between;` and `align-items: center;`.
2. Make `.nav-links` a flex container with `gap: 16px;`.

The preview should show a real navbar: brand left, links right, all on
one calm centerline.
