---
id: 09-a-touch-of-layout
title: A Touch of Layout
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Make the article readable: give main a max-width of 600px and center it with auto left and right margins."
docs: [html-css/box-model, html-css/selectors]
checks:
  - id: readable-width
    type: dom
    assertions:
      - { selector: "main", cssRule: { property: "max-width", equals: "600px" } }
  - id: centered
    type: dom
    assertions:
      - { selector: "main", cssRule: { property: "margin-left", equals: "auto" } }
      - { selector: "main", cssRule: { property: "margin-right", equals: "auto" } }
  - id: looks-centered
    type: ai-judge
    rubric: "The stylesheet constrains the page's main content to a readable column (a max-width around 600px on main or an equivalent wrapper) and centers that column horizontally using auto left and right margins (e.g. margin: 0 auto)."
hints:
  - "max-width: 600px; caps how wide main can grow — narrower windows still fit."
  - "margin: 0 auto; means 0 on top/bottom, auto on left/right."
  - "auto side margins split the leftover space evenly — that's what centers the box."
---
## The oldest trick in web layout

Open the preview wide and read the starter article. Painful, right? The text
stretches across the entire window, and your eyes lose the line on every
return trip. Print designers solved this centuries ago: comfortable reading
happens at roughly 45–75 characters per line.

CSS fixes it with two declarations, and this pair might be the single most
used layout trick on the web:

```css
main {
  max-width: 600px;
  margin: 0 auto;
}
```

`max-width` says the box may shrink but never grow past 600px — on a phone it
still fills the screen, on a monitor it stops at a readable column.

`margin: 0 auto` is shorthand: `0` on top and bottom, `auto` on left and
right. And `auto` side margins do something wonderful — they split the
leftover space *equally*, which shoves the box dead center. A capped width
plus auto side margins is how nearly every article, blog post, and docs page
you've ever read got its centered column.

One warning from experience: `auto` margins only center a box that has a width
limit. Without `max-width`, the box already fills the row and there's no
leftover space to split.

### Your goal

In `styles.css`, write a `main` rule that:

1. Caps the column with `max-width: 600px;`
2. Centers it with `margin: 0 auto;`

Drag the preview wider and narrower — the column should stay centered and
never get uncomfortably long.
