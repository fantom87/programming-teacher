---
id: 02-semantic-structure
title: "Capstone 2: Semantic Structure"
language: html-css
runner: browser
estMinutes: 35
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Replace every wireframe box with real semantic HTML: landmarks and one h1, an anchor nav to #films/#about/#visit, a four-card ul.film-grid, a figure and blockquote in the history, and an hours table with caption and row headers."
docs: [html-css/semantic-html, html-css/lists-and-tables, html-css/links-and-images, html-css/common-elements]
checks:
  - id: landmarks
    type: dom
    assertions:
      - { selector: "header.site-header", exists: true }
      - { selector: "main", count: 1 }
      - { selector: "footer", exists: true }
      - { selector: "h1", count: 1 }
      - { selector: "[role]", count: 0 }
      - { selector: ".wire", count: 0 }
  - id: anchor-nav
    type: dom
    assertions:
      - { selector: "nav a", count: 3 }
      - { selector: "nav a", attr: "href", equals: "#films" }
      - { selector: "nav a", attr: "href", equals: "#about" }
      - { selector: "nav a", attr: "href", equals: "#visit" }
  - id: section-outline
    type: dom
    assertions:
      - { selector: "main > section", count: 4 }
      - { selector: "section.hero h1", exists: true }
      - { selector: "h2", count: 3 }
      - { selector: "section#films h2", exists: true }
      - { selector: "section#about h2", exists: true }
      - { selector: "section#visit h2", exists: true }
  - id: film-list
    type: dom
    assertions:
      - { selector: "ul.film-grid", count: 1 }
      - { selector: ".film-grid > .film-card", count: 4 }
      - { selector: ".film-card h3", count: 4 }
      - { selector: ".film-card .times", count: 4 }
  - id: semantic-depth
    type: dom
    assertions:
      - { selector: "#about figure img", exists: true }
      - { selector: "#about figcaption", exists: true }
      - { selector: "#about blockquote", exists: true }
      - { selector: "table.hours caption", exists: true }
      - { selector: ".hours th[scope=row]", count: 3 }
      - { selector: "#visit address", exists: true }
  - id: structure-audit
    type: ai-judge
    rubric: "The wireframe became a real page with real content. (1) Semantics: header/nav/main/section/footer landmarks with zero role attributes, sections carrying the ids the nav targets, and no leftover .wire markup or CSS anywhere. (2) Outline: exactly one h1 in the hero, an h2 opening each of the three id'd sections, h3 only as film titles — no skipped levels. (3) Content: four films with invented but plausible titles, one-sentence blurbs, and showtimes in a .times paragraph; two history paragraphs plus a blockquote quote attributed outside the quote element; no lorem or placeholder text anywhere. (4) Depth: the facade photo sits in a figure with a figcaption and an alt that describes what the photo shows (facade, sign — not 'photo of cinema'); hours are a table with a caption and th scope=row row headers; the address element holds the street address and a mailto link. (5) The stylesheet is nearly empty — a body font stack at most — because this session is structure, not styling."
hints:
  - "The mapping: wire-header → header.site-header (brand span + nav), wire-hero → section.hero (the only h1 + tagline), wire-films → section#films, wire-about → section#about, wire-visit → section#visit, wire-footer → footer. The nav links point at those section ids."
  - "A film card is <li class=\"film-card\"><h3>Title</h3><p>blurb</p><p class=\"times\">Fri 7:30</p></li> — four of them inside <ul class=\"film-grid\">, which replaces the wire-row."
  - "Depth pieces: figure > img + figcaption for the 1921 photo, blockquote for Rosa's quote (attribution in a p after it), table.hours with a caption and <th scope=\"row\"> day labels, and address for the street + mailto. Then delete every .wire rule — a nearly-empty stylesheet is correct today."
---
## The structure pass

Session 2: every gray box becomes the most specific element that means
the same thing. This is the pass where the site stops being a sketch
and starts being a document — and it's still not the pass where you
open the color picker.

The mapping is mechanical because you did the thinking last session:

```
wire-header  → header.site-header (brand + nav)
wire-hero    → section.hero (the only h1)
wire-films   → section#films  > ul.film-grid > 4 li.film-card
wire-about   → section#about  (history, figure, blockquote)
wire-visit   → section#visit  (table.hours, address)
wire-footer  → footer
```

The sections get `id`s because the nav is three in-page anchors —
`href="#films"` and friends. One page, one `h1`, an `h2` opening each
section, `h3` for film titles. No `role` attributes: the elements are
the roles.

Content goes in *now*, and it's real. Four invented films with blurbs
and showtimes, the 1921 history, Rosa's quote. Writing copy during the
structure pass is deliberate: placeholder text hides structural
mistakes (every heading looks fine when it's lorem), and clients sign
off on words, not wireframes.

Reach for the deep cuts this page earns: the film list is a `ul` —
four of a kind — with each card an `li`. The facade photo is a
`figure` with a `figcaption`. Rosa's line is a `blockquote`, her name
in a paragraph *after* it (the attribution isn't part of the quote).
Hours are a real `table` with a `caption` and `th scope="row"` day
labels. The address is an `address`.

Last act: delete the wireframe CSS. The stylesheet drops to almost
nothing, the preview goes plain — and plain-but-correct is exactly
where a structure pass should end.

### Your goal

1. All six regions as semantic landmarks — one `h1`, sections with the
   ids the three nav anchors target, zero `role` attributes, zero
   `.wire` anything.
2. Four `li.film-card`s (h3 + blurb + `.times`) in `ul.film-grid`.
3. Figure + figcaption, blockquote, captioned hours table with row
   headers, and `address` — all with real, brief-matching copy.
