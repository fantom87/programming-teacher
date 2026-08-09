---
id: 01-brief-and-wireframe
title: "Capstone 1: Brief and Wireframe"
language: html-css
runner: browser
estMinutes: 25
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Turn the Harborlight Cinema brief into a coded wireframe: six labeled gray boxes in reading order, a four-card flex row inside the films box, and a page title that names the client."
docs: [html-css/document-structure, html-css/box-model, html-css/selectors]
checks:
  - id: head-names-the-client
    type: dom
    assertions:
      - { selector: "html", attr: "lang", equals: "en" }
      - { selector: "title", textContains: "Harborlight" }
  - id: six-regions-in-order
    type: dom
    assertions:
      - { selector: ".wire-header", exists: true }
      - { selector: ".wire-header + .wire-hero", exists: true }
      - { selector: ".wire-hero + .wire-films", exists: true }
      - { selector: ".wire-films + .wire-about", exists: true }
      - { selector: ".wire-about + .wire-visit", exists: true }
      - { selector: ".wire-visit + .wire-footer", exists: true }
      - { selector: ".wire", count: 10 }
  - id: four-card-row
    type: dom
    assertions:
      - { selector: ".wire-films .wire-row", exists: true }
      - { selector: ".wire-row > .wire-card", count: 4 }
      - { selector: ".wire-card .wire-label", count: 4 }
  - id: wireframe-css
    type: dom
    assertions:
      - { selector: ".wire", cssRule: { property: "border", equals: "2px dashed slategray" } }
      - { selector: ".wire-row", cssRule: { property: "display", equals: "flex" } }
      - { selector: ".wire-row", cssRule: { property: "gap", equals: "1rem" } }
  - id: content-inventory
    type: ai-judge
    rubric: "A wireframe that answers the brief, not a styled page. (1) Every .wire-label is a real content inventory line: it names the region AND lists what will live there, with counts pulled from the brief — the header label mentions the brand plus three named links, the hero mentions the single h1 and a pitch, the films label says four cards with title/blurb/showtimes, about mentions history plus a photo and a quote, visit mentions hours and an address, the footer a sign-off. (2) The page stays wireframe-gray: dashed borders and gray label text only — no brand colors, no background fills, no font choices beyond one plain stack. (3) Proportion is sketched with min-height (hero taller than a bare box, cards taller than their labels) and the four cards sit in one flex row. (4) The title element names the client. Real copy inside the boxes, or any visual design, means the session's discipline was broken."
hints:
  - "The box pattern, six times in visitor order: <div class=\"wire wire-hero\"><p class=\"wire-label\">HERO — the only h1 + one-line pitch</p></div> — swap the class and label per region."
  - "The films box holds its label plus <div class=\"wire-row\"> with four <div class=\"wire wire-card\"> boxes inside; .wire-row { display: flex; gap: 1rem; } and .wire-card { flex: 1; min-height: 7rem; } sketch the card strip."
  - ".wire { border: 2px dashed slategray; padding: 1rem; margin-bottom: 1rem; } — typed exactly; the checker reads the border. Labels are inventory, not lorem: region name, contents, counts."
---
## A client, five sessions, one site

This unit is one continuous job. A real client, a real brief, and five
working sessions that end with a site you'd invoice for. Today you
don't write a single line of real content — and that's the point.

The brief, taken over the phone:

> "Harborlight Cinema. Single screen since 1921. We need: what's
> playing this week — four films, with showtimes — our story, because
> people love the history, and how to find us. There's a photo of the
> 1921 facade you should use, and get a quote from Rosa, our
> projectionist. Most regulars book from their phones."

Professionals don't open the CSS yet. They do a **content inventory**
(what must exist) and a **wireframe** (where it sits, in what order) —
because moving a gray box costs nothing, and moving a finished section
costs an afternoon. Your wireframe lives in code, since HTML is the
cheapest sketching tool you own:

```html
<div class="wire wire-films">
  <p class="wire-label">FILMS — "This week": 4 film cards</p>
  <div class="wire-row">
    <div class="wire wire-card">
      <p class="wire-label">title / one-line blurb / showtimes</p>
    </div>
    <!-- ×4 -->
  </div>
</div>
```

Six regions, in the order a visitor should meet them: header, hero,
films, about, visit, footer. Each box gets a label that *is* the
inventory — region name, contents, counts from the brief. The films box
holds a flex row of four card boxes, because that layout decision is
worth sketching now. A `min-height` on the hero and cards sketches
proportion.

The discipline: dashed `slategray` borders, gray labels, nothing else.
No palette, no typefaces, no copy. Every decision you *don't* make
today stays cheap to change tomorrow — that's what the wireframe is
for.

### Your goal

1. Update the `title` to name the client; six labeled `.wire` regions
   in reading order.
2. Four `.wire-card` boxes in a flex `.wire-row` inside the films
   region — ten `.wire` boxes total.
3. Wireframe CSS exactly: `2px dashed slategray` borders, flex row with
   `gap: 1rem`, labels that inventory the brief.
