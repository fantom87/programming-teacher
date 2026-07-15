---
id: 10-mini-project-about-me
title: "Mini-Project: About Me"
language: html-css
runner: browser
estMinutes: 25
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Build a complete, styled About Me page: full document structure, one h1 and at least one h2, a ul list, an image with real alt text, and a stylesheet that visibly shapes the page."
docs: [html-css/document-structure, html-css/semantic-html, html-css/selectors, html-css/box-model]
checks:
  - id: page-structure
    type: dom
    assertions:
      - { selector: "title", exists: true }
      - { selector: "header", exists: true }
      - { selector: "main", count: 1 }
      - { selector: "footer", exists: true }
  - id: content-pieces
    type: dom
    assertions:
      - { selector: "h1", count: 1 }
      - { selector: "h2", exists: true }
      - { selector: "ul li", exists: true }
      - { selector: "img[alt]", exists: true }
  - id: personal-and-styled
    type: ai-judge
    rubric: "The page reads as a genuine personal 'about me' page (a name or persona in the h1, personal content in the sections, a list of real interests or facts), the image's alt text meaningfully describes a picture rather than being filler, and styles.css contains at least two CSS rules that visibly shape the page (for example a readable centered column, colors, fonts, or spacing on real selectors from the HTML)."
hints:
  - "Inside body, lay out the landmarks from Page Anatomy: header, one main, footer."
  - "Reuse the layout trick: main { max-width: 600px; margin: 0 auto; }"
  - "Give sections classes if you want to style them individually — the dot goes in the CSS only."
---
## Everything, together

This is the moment the unit has been building toward. No new tags, no new CSS —
just you, a bare skeleton, and every tool from the last nine lessons: tags and
nesting, headings and lists, links and images, the full document skeleton,
classes, the box model, and the centered-column trick.

You're building an **About Me** page. It doesn't have to be literally about
you — invent a persona, write as your cat, whatever keeps it fun. What matters
is that it's a *complete* page: structured, filled with real content, and
styled on purpose.

A suggested shape, top to bottom:

```
header   → your name as the h1, maybe a one-line tagline
main     → an h2 section introducing yourself
         → an h2 section with a ul of interests, favorites, or facts
         → an image with alt text that truly describes it
footer   → a sign-off
```

Then open `styles.css` and make it yours. At minimum: cap and center `main`
like in the last lesson, and add a couple of rules that change color, font, or
spacing. Cards around sections, a tinted header — your call. The AI reviewer
will look for a page that feels personal and deliberately styled, not just one
that technically passes.

### Your goal

1. A complete document (the skeleton is started for you): `body` organized
   into `header`, one `main`, and `footer`, with a real `title` in the head.
2. Exactly one `h1`, at least one `h2` section, a `ul` with list items, and an
   `img` with meaningful `alt` text.
3. A stylesheet with at least two rules that visibly shape the page.

Take your time. This one goes in the portfolio.
