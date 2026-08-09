---
id: 02-selector-specificity-drills
title: Selector and Specificity Drills
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Four rules below the DRILLS line, nothing edited above it: zebra-stripe the roster with :nth-child(odd), color only the menu's direct-child links, flag target=\"_blank\" links, and outrank the legacy #promo rule by pure specificity — no !important anywhere."
docs: [html-css/selectors]
checks:
  - id: zebra-stripes
    type: dom
    assertions:
      - { selector: ".roster li:nth-child(odd)", cssRule: { property: "background-color", equals: "rgb(238, 242, 247)" } }
  - id: direct-children-only
    type: dom
    assertions:
      - { selector: ".menu > a", cssRule: { property: "color", equals: "steelblue" } }
  - id: attribute-flag
    type: dom
    assertions:
      - { selector: "a[target=\"_blank\"]", cssRule: { property: "color", equals: "firebrick" } }
  - id: outranked-legacy
    type: dom
    assertions:
      - { selector: "section#promo p.title", cssRule: { property: "color", equals: "darkslateblue" } }
      - { selector: "#promo p.title", cssRule: { property: "color", equals: "rgb(138, 143, 152)" } }
  - id: specificity-not-brute-force
    type: ai-judge
    rubric: "All four drill rules sit below the DRILLS comment line and use exactly the dictated selectors (.roster li:nth-child(odd), .menu > a, a[target=\"_blank\"], section#promo p.title). Everything above the line — including the legacy #promo p.title rule — is unedited. No !important appears anywhere in the stylesheet, and index.html is untouched: no inline style attributes, no added classes or ids. The promo recolor wins because section#promo p.title at (1,1,2) outranks #promo p.title at (1,1,1), not because the legacy rule was edited or deleted."
hints:
  - "Specificity is three numbers: (ids, classes+attributes+pseudo-classes, types). .menu a and .menu > a both score (0,1,1) — your rule wins the tie by coming later. That's the cascade."
  - "The zebra: .roster li:nth-child(odd) { background-color: #eef2f7; } — :nth-child counts positions among siblings, and odd hits 1, 3, 5."
  - "Legacy scores (1,1,1): one id, one class, one type. section#promo p.title adds a second type for (1,1,2) — outranked cleanly, no !important required. Type each selector exactly, spaces and all."
---
## Win without !important

The Iron Bell's stylesheet has a rule nobody may touch: the legacy
`#promo p.title`, gray and load-bearing. Your job is to restyle around
it — the refresher for how conflicts actually resolve.

Rapid recall. Specificity is three numbers, compared left to right:

```
(ids, classes+attributes+pseudo-classes, types)
#promo p.title          →  (1,1,1)
section#promo p.title   →  (1,1,2)   wins
.menu a  and  .menu > a →  (0,1,1)   tie — later rule wins
```

Ties fall to source order; `!important` is the fire axe you leave in
the glass case. And note what buys you nothing: `>` adds zero
specificity — it narrows *which* elements match, not how hard the rule
hits.

Four drills, each one selector, written below the `DRILLS` line:

1. **`:nth-child(odd)`** — zebra the roster: odd rows get
   `background-color: #eef2f7`.
2. **Child combinator** — `.menu > a` turns the three direct-child
   links `steelblue`. The archive link nested in a `span` stays gray:
   `>` refuses grandchildren.
3. **Attribute selector** — `a[target="_blank"]` colors both external
   links `firebrick`.
4. **The outrank** — repaint the promo title `darkslateblue` with
   `section#promo p.title`. Same elements matched, one more type
   selector, (1,1,2) beats (1,1,1) from any position in the file.

The checker reads your selectors literally — type them exactly as
dictated.

### Your goal

1. Zebra stripes via `.roster li:nth-child(odd)`.
2. `steelblue` direct-child menu links; `firebrick` external links.
3. The legacy promo rule beaten by specificity alone — untouched,
   un-`!important`-ed, still sitting there losing.
