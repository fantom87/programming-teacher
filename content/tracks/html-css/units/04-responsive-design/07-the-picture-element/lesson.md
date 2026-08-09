---
id: 07-the-picture-element
title: Art Direction with picture
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Give the lighthouse hero two crops with a picture element: a source that serves cape-wide.jpg at (min-width: 800px), and an img fallback serving cape-square.jpg with real alt text — img last inside the picture."
docs: [html-css/links-and-images, html-css/responsive-design]
checks:
  - id: picture-structure
    type: dom
    assertions:
      - { selector: "picture", exists: true }
      - { selector: "picture source", exists: true }
      - { selector: "picture > img:last-child", exists: true }
  - id: wide-crop-source
    type: dom
    assertions:
      - { selector: "picture source", attr: "media", equals: "(min-width: 800px)" }
      - { selector: "picture source", attr: "srcset", equals: "cape-wide.jpg" }
  - id: square-fallback
    type: dom
    assertions:
      - { selector: "picture img", attr: "src", equals: "cape-square.jpg" }
      - { selector: "picture img[alt]", exists: true }
  - id: crops-and-alt-make-sense
    type: ai-judge
    rubric: "The picture element reads correctly for art direction: the source carries the media condition (min-width: 800px) and names the wide crop cape-wide.jpg in srcset; the img fallback names the square crop cape-square.jpg and comes after the source. The alt text lives on the img (never on a source) and genuinely describes a lighthouse scene — specific and visual, not filler or a filename. One alt covers both crops, since they show the same subject."
hints:
  - "The skeleton: <picture> containing first a <source>, then the <img> — the img must come last, it's both the fallback and the thing CSS styles."
  - "The source takes media=\"(min-width: 800px)\" and srcset=\"cape-wide.jpg\" — copy both values exactly; note it's srcset on a source, even for one file."
  - "The img keeps src=\"cape-square.jpg\" plus your alt text. No media attribute on the img — it's the 'everything else' case."
---
## When the crop must change

Last lesson the browser chose between *sizes of the same photo*, and you
were happy to let it. But some decisions aren't about file size. Squeeze a
wide lighthouse panorama onto a phone and the lighthouse becomes six pixels
of trivia; what a phone needs is a *different photograph* — a tight square
crop of the tower. Choosing images by meaning is called **art direction**,
and it needs a command, not a suggestion. That command is `<picture>`:

```html
<picture>
  <source media="(min-width: 800px)" srcset="cape-wide.jpg">
  <img src="cape-square.jpg" alt="The Cape Lantern lighthouse at dusk">
</picture>
```

The browser walks the `<source>` elements top to bottom and takes the
**first one whose `media` condition is true** — the same condition syntax
as your CSS breakpoints, but living in HTML, and this time the browser has
no veto. Wide screen: the panorama. Otherwise it falls through to the
`<img>`, which is both the fallback *and* the real element on the page —
the thing your CSS targets and the thing that carries the `alt`. A `source`
never takes alt text; it's just a candidate, and one alt describes the
subject both crops share.

Rules of the road: the `img` always goes **last** inside the picture, and a
`source` uses `srcset` (even for a single file), never `src`. And keep
`picture` for genuine crop changes — for pure "same photo, smaller file"
work, yesterday's plain `srcset` is lighter and lets the browser be smart.

The two crops are invented files again, so the preview leans on the alt
text — but drag the divider across 800px with the browser's dev tools open
someday and you'll watch the swap happen for real.

### Your goal

In `index.html`, replace the lone `<img>` in the hero with a `<picture>`:

1. A `<source>` with `media="(min-width: 800px)"` and
   `srcset="cape-wide.jpg"` — values exactly as printed.
2. The `<img>` last, with `src="cape-square.jpg"` and alt text that truly
   describes the lighthouse.
