---
id: 07-units
title: Units That Scale
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Size the article with scalable units: h1 at 2rem, paragraphs at 1.125rem with a max-width of 60ch, and a unitless line-height of 1.6 on body."
docs: [html-css/colors-and-typography, html-css/box-model]
checks:
  - id: heading-rem
    type: dom
    assertions:
      - { selector: "h1", cssRule: { property: "font-size", equals: "2rem" } }
  - id: paragraph-sizing
    type: dom
    assertions:
      - { selector: "p", cssRule: { property: "font-size", equals: "1.125rem" } }
      - { selector: "p", cssRule: { property: "max-width", equals: "60ch" } }
  - id: breathing-room
    type: dom
    assertions:
      - { selector: "body", cssRule: { property: "line-height", equals: "1.6" } }
hints:
  - "rem = multiples of the page's base size: font-size: 2rem; is 'twice the default'."
  - "60ch means 'about 60 characters wide' — a reading-width unit: max-width: 60ch;"
  - "line-height likes NO unit at all: line-height: 1.6; scales with any font size."
---
## Beyond pixels

Every size you've written so far was in `px` — fixed screen dots. Pixels are
honest but rigid: when a reader bumps their browser's base font size up (and
plenty of people do), your `18px` text ignores them completely.

Enter **rem**: a multiple of the page's base font size, which is `16px`
unless the *reader* says otherwise.

```css
h1 { font-size: 2rem; }     /* 2 × the base — 32px by default */
p  { font-size: 1.125rem; } /* 1.125 × 16 = 18px by default */
```

Same look for you, but for the reader who cranked their base size to 20px,
everything scales in proportion. Sizing type in rem is the professional
default; the odd decimals (`1.125`, `0.875`) are just familiar pixel sizes
divided by 16.

Two relatives worth meeting today:

- **ch** — the width of roughly one character. `max-width: 60ch` caps a
  column at about sixty characters per line, which is *why* it's readable —
  the unit speaks the same language as the goal.
- **unitless line-height** — `line-height: 1.6;` with no unit at all means
  "1.6 × whatever the font size is, wherever it inherits." A unitless value
  scales gracefully; `line-height: 26px` would follow the text into headings
  and strangle them.

Rule of thumb going forward: **rem for font sizes, ch for text columns,
unitless for line-height, px for hairlines** like borders. Percentages
(`width: 50%`) size boxes relative to their parent — you'll lean on those
hard in the layout unit.

### Your goal

In `styles.css`:

1. `h1 { font-size: 2rem; }`
2. A `p` rule with `font-size: 1.125rem;` and `max-width: 60ch;`
3. On `body`, add `line-height: 1.6;`

The article should end up comfortably sized, comfortably narrow, and
comfortably spaced — with not one hardcoded pixel of text.
