---
id: 09-capstone-landing-page
title: "Capstone: Landing Page"
language: html-css
runner: browser
estMinutes: 35
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Build a complete landing page for an invented product: a flex navbar (logo left, links right), a hero section with the pitch, a 3-card feature grid, and a footer — structured, styled, and yours."
docs: [html-css/flexbox, html-css/grid, html-css/semantic-html, html-css/colors-and-typography]
checks:
  - id: page-structure
    type: dom
    assertions:
      - { selector: "header.site-header", exists: true }
      - { selector: "nav a", exists: true }
      - { selector: "main", count: 1 }
      - { selector: "main .hero", exists: true }
      - { selector: "h1", count: 1 }
      - { selector: "footer", exists: true }
  - id: feature-cards
    type: dom
    assertions:
      - { selector: ".feature-grid .card", count: 3 }
      - { selector: ".feature-grid .card h3", exists: true }
  - id: navbar-flex
    type: dom
    assertions:
      - { selector: ".site-header", cssRule: { property: "justify-content", equals: "space-between" } }
      - { selector: ".site-header", cssRule: { property: "align-items", equals: "center" } }
  - id: features-grid
    type: dom
    assertions:
      - { selector: ".feature-grid", cssRule: { property: "grid-template-columns", equals: "repeat(3, 1fr)" } }
  - id: landing-page-quality
    type: ai-judge
    rubric: "A coherent landing page for one invented product. (1) .site-header has display: flex so the space-between/center alignment works, with a brand on one side and at least three nav links. (2) The hero is visually distinct (its own background color plus generous padding) and contains the single h1 with a real pitch line, not lorem or filler. (3) .feature-grid has display: grid, and its three cards each have a heading and a sentence of real copy describing a plausible feature; cards are visibly styled as cards (background or border, padding, rounded corners or similar). (4) The footer exists and the page shows deliberate, consistent styling — a font-family set, a cohesive color choice repeated in at least two places. Placeholder text or unstyled default-white sections mean the goal is not met."
hints:
  - "Structure first, style second: navbar (header.site-header with a brand span and nav.nav-links), then main with section.hero and section.features holding div.feature-grid, then the footer."
  - "The navbar is lesson 4 verbatim: .site-header { display: flex; justify-content: space-between; align-items: center; } and .nav-links { display: flex; gap: 16px; }."
  - "The cards are lesson 5: .feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; } — then style .card and the hero with backgrounds, padding, and one accent color used consistently."
---
## Ship a landing page

Every layout pattern from this unit, one real page. You're building the
landing page for a product you invent — an app, a bakery, a fictional
space airline. Pick something you can write three honest features for.

The professional anatomy you're reproducing:

```
header.site-header  → brand + nav.nav-links     (flexbox, lesson 4)
main
  section.hero      → h1 pitch + a tagline      (a styled stage)
  section.features  → .feature-grid > 3 .card   (grid, lesson 5)
footer              → sign-off                  (in flow, lesson 1)
```

Work in passes, checking the preview after each:

**Structure.** Write the whole skeleton in HTML with real content —
name, pitch, three features with headings (`h3`) and a sentence each.
Ugly is fine; complete matters.

**Navbar.** Flex on `.site-header`: `justify-content: space-between`,
`align-items: center`, and a flex `.nav-links` with a `gap`. Give the
bar a background that means business.

**Hero.** This is the first thing visitors see, so put it on a stage:
its own background color, generous padding (try `48px 24px`), maybe
centered text. The page's only `h1` lives here.

**Feature grid.** `display: grid;
grid-template-columns: repeat(3, 1fr);` with a gap, then make `.card`
look like a card — background, padding, rounded corners.

**Polish.** One `font-family` on `body`, one accent color used in at
least two places (navbar and hero, hero and cards). Repetition is what
makes a page feel designed rather than assembled. The AI reviewer looks
for a page with real copy and deliberate styling — the kind you'd
happily show someone.

### Your goal

1. Full structure: `header.site-header` navbar with brand and 3+ links,
   one `main` holding a `.hero` (with the only `h1`) and a
   `.feature-grid` of exactly 3 `.card`s (each with an `h3`), and a
   `footer`.
2. Navbar laid out with flexbox; feature cards laid out with a 3-column
   grid.
3. Real product copy and consistent, deliberate styling throughout.
