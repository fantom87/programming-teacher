---
id: 02-media-queries
title: Media Queries
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Add one @media (min-width: 700px) block that widens the trail journal: .columns switches to grid-template-columns: 2fr 1fr and .site-title grows to 2.5rem."
docs: [html-css/responsive-design, html-css/grid]
checks:
  - id: wide-columns
    type: dom
    assertions:
      - { selector: ".columns", cssRule: { property: "grid-template-columns", equals: "2fr 1fr" } }
  - id: wide-title
    type: dom
    assertions:
      - { selector: ".site-title", cssRule: { property: "font-size", equals: "2.5rem" } }
  - id: overrides-live-in-media
    type: ai-judge
    rubric: "Both wide-screen changes (.columns to grid-template-columns: 2fr 1fr and .site-title to font-size: 2.5rem) live inside a single @media (min-width: 700px) block placed after the base rules. The base rules are untouched: outside the media query, .columns still has grid-template-columns: 1fr and .site-title still has font-size: 1.75rem — the learner added conditional overrides rather than editing the originals."
hints:
  - "The shape: @media (min-width: 700px) { ... } — a wrapper around perfectly normal rules, switched on only at 700px and up."
  - "Inside the block, two ordinary rules: .columns { grid-template-columns: 2fr 1fr; } and .site-title { font-size: 2.5rem; }"
  - "Don't edit the base rules — put the whole @media block below them. A media query adds no specificity, so of two equal rules the later one wins."
---
## Style, on one condition

Everything you've written so far applies always. A **media query** is a
wrapper that switches rules on only while a condition about the *medium* —
the screen — is true:

```css
@media (min-width: 700px) {
  .columns {
    grid-template-columns: 2fr 1fr;
  }
}
```

Read `(min-width: 700px)` as "at least 700px wide." Below that, the rule
inside might as well not exist; at 700px and up, it applies like any other
rule. The width where behavior changes is called a **breakpoint**.

Two things make media queries click:

- **The rules inside are ordinary rules.** Same selectors, same properties.
  The `@media` wrapper only decides *whether* they're in play.
- **They add no specificity.** An override wins the same way a repeated rule
  always has: by coming later. Base rule first, `@media` block after — the
  cascade you already know does the rest.

The starter is a trail journal: an article and a "Trail facts" aside, sitting
in a `.columns` grid that's one column (`grid-template-columns: 1fr`) — a
fine phone layout, but a waste of a wide screen. Your media query flips it to
`2fr 1fr` — story twice as wide as the facts — and bumps the title from
`1.75rem` to `2.5rem`, because big screens can carry bigger type.

Here's the fun part: the preview pane *is* your test device. Drag the divider
slowly and watch the aside snap from below the story to beside it at exactly
700px. That snap is the breakpoint doing its job.

### Your goal

In `styles.css`, after the base rules, add one block:

1. `@media (min-width: 700px)` containing
2. `.columns { grid-template-columns: 2fr 1fr; }` and
3. `.site-title { font-size: 2.5rem; }`

Leave the base rules exactly as they are — the narrow layout still needs
them.
