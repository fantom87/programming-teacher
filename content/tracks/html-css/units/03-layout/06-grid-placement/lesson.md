---
id: 06-grid-placement
title: Grid Placement
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Build the classic sidebar page shell: .page becomes a grid with columns 220px 1fr and gap 16px, and .top-bar and .page-footer each span the full width with grid-column: 1 / -1."
docs: [html-css/grid, html-css/semantic-html]
checks:
  - id: shell-columns
    type: dom
    assertions:
      - { selector: ".page", cssRule: { property: "grid-template-columns", equals: "220px 1fr" } }
      - { selector: ".page", cssRule: { property: "gap", equals: "16px" } }
  - id: full-width-bars
    type: dom
    assertions:
      - { selector: ".top-bar", cssRule: { property: "grid-column", equals: "1 / -1" } }
      - { selector: ".page-footer", cssRule: { property: "grid-column", equals: "1 / -1" } }
  - id: shell-is-grid
    type: ai-judge
    rubric: "styles.css gives .page the declaration display: grid so the column template applies, producing the classic shell: header across the top, a fixed-width sidebar next to the main content, footer across the bottom. The column template and spans without display: grid on .page do not meet the goal."
hints:
  - "The shell lives on the container: .page { display: grid; grid-template-columns: 220px 1fr; gap: 16px; }"
  - "Columns don't have to be equal — 220px 1fr means a fixed sidebar column and a main column that takes the rest."
  - "On .top-bar and .page-footer: grid-column: 1 / -1; (spaces around the slash) — line 1 to the last line, whatever the column count."
---
## Telling items where to live

So far your grid children just filled cells in order. Real pages need more
control: a header that runs the full width, a sidebar hugging one edge.
Grid handles this with two moves.

**Move one: unequal columns.** Nothing says the tracks must match:

```css
.page {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 16px;
}
```

A fixed 220px column for navigation, and `1fr` — everything that's left —
for content. Mixing fixed and fractional tracks like this is grid's
superpower.

**Move two: spanning.** Columns are separated by numbered **grid lines**:
line 1 is the left edge, line 2 sits between the tracks, line 3 is the
right edge. An item can claim a range of lines:

```css
.top-bar {
  grid-column: 1 / -1;
}
```

Read it as "from line 1 to line -1" — and just like negative indexes in
Python, `-1` means the *last* line. So `1 / -1` is "stretch across
everything," and it keeps working even if you add columns later. (You'll
also see `grid-column: span 2;` — "cover two tracks from wherever you
land.")

With the header spanning the top and the footer spanning the bottom, the
sidebar and main content fall naturally into the two columns of the middle
row. Four elements, one template, and you've built the page shell that
powers most dashboards, docs sites, and admin panels on the web.

### Your goal

In `styles.css`:

1. Make `.page` a grid: `display: grid;`,
   `grid-template-columns: 220px 1fr;`, `gap: 16px;`.
2. Give `.top-bar` the declaration `grid-column: 1 / -1;`.
3. Give `.page-footer` the same `grid-column: 1 / -1;`.

The preview should show header on top, sidebar beside articles, footer
across the bottom.
