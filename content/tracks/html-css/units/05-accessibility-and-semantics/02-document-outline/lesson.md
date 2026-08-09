---
id: 02-document-outline
title: The Document Outline
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Rebuild the manual's heading outline — exactly one h1, two h2 sections, four h3 subsections, no skipped levels — then recover the compact look with h2 and h3 font-size rules."
docs: [html-css/common-elements, html-css/accessibility-basics, html-css/colors-and-typography]
checks:
  - id: one-h1
    type: dom
    assertions:
      - { selector: "h1", count: 1 }
  - id: sections-and-subsections
    type: dom
    assertions:
      - { selector: "h2", count: 2 }
      - { selector: "h3", count: 4 }
  - id: no-skipped-levels
    type: dom
    assertions:
      - { selector: "h4", count: 0 }
      - { selector: "h5", count: 0 }
      - { selector: "h6", count: 0 }
  - id: sized-with-css
    type: dom
    assertions:
      - { selector: "h2", cssRule: { property: "font-size", equals: "1.4rem" } }
      - { selector: "h3", cssRule: { property: "font-size", equals: "1.1rem" } }
hints:
  - "Sketch the outline first: one title, two sections (Daily Feeding, Troubleshooting), and two subsections under each."
  - "Section names become h2 — including the second h1, which is really a section wearing the title's tag. Their subheads become h3."
  - "Get the small look back in styles.css: h2 { font-size: 1.4rem; } and h3 { font-size: 1.1rem; } — type those values exactly."
---
## Headings are a table of contents

Screen readers have a feature you'd envy: press one key and every
heading on the page appears as a list — jump to any of them. Experienced
screen-reader users read the web this way, outline first, like flipping
to a book's contents page before committing to chapter three.

That only works if the levels tell the truth. `h1` through `h6` aren't
six font sizes — they're **nesting depth**. The rules are short:

- **Exactly one `h1`**: the page's name.
- A section of the page gets `h2`; a subsection of that section gets
  `h3`; and so on down.
- **Never skip levels going down.** An `h5` under an `h2` announces two
  layers of structure that don't exist — in the outline it reads like a
  chapter with a missing sub-chapter and a mysterious sub-sub-heading.

The starter — a sourdough starter care manual, no relation — broke every
rule for looks. Its author thought `h2` rendered too big, so "Daily
Feeding" became an `h3` and its subheads dropped to `h5`. Then
"Troubleshooting" needed to feel important again, so it grabbed a second
`h1`. The page *looks* organized. Ask for its outline and you get
nonsense.

The fix has two halves, and this is the lesson's real point:
**structure and size are separate decisions.** Choose the level by
asking "what is this a section *of*?" — never by how it renders. Then,
in CSS, make any level any size you want:

```css
h2 {
  font-size: 1.4rem;
}
```

Same compact look the author wanted, honest outline underneath. One
stylesheet rule replaces every heading-level crime on the page.

### Your goal

1. In `index.html`: one `h1` (the title), `h2` for the two sections
   (Daily Feeding, Troubleshooting), `h3` for all four subheads. No
   `h4`–`h6` anywhere.
2. In `styles.css`: `h2 { font-size: 1.4rem; }` and
   `h3 { font-size: 1.1rem; }` — the compact look, done properly.
