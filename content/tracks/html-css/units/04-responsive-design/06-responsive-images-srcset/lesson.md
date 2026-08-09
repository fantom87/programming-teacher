---
id: 06-responsive-images-srcset
title: "Responsive Images: srcset"
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Upgrade the harbor photo to a responsive image: a srcset menu of three widths (480w / 960w / 1600w), a sizes contract of (min-width: 800px) 640px, 100vw, honest alt text, and CSS that keeps the img fluid with width: 100% and height: auto."
docs: [html-css/links-and-images, html-css/responsive-design]
checks:
  - id: srcset-menu
    type: dom
    assertions:
      - { selector: "img", attr: "srcset", equals: "harbor-480.jpg 480w, harbor-960.jpg 960w, harbor-1600.jpg 1600w" }
  - id: sizes-contract
    type: dom
    assertions:
      - { selector: "img", attr: "sizes", equals: "(min-width: 800px) 640px, 100vw" }
  - id: fluid-in-layout
    type: dom
    assertions:
      - { selector: ".photo img", cssRule: { property: "width", equals: "100%" } }
      - { selector: ".photo img", cssRule: { property: "height", equals: "auto" } }
  - id: fallback-and-alt
    type: ai-judge
    rubric: "The img keeps a plain src attribute naming one of the harbor files (the fallback for browsers that don't speak srcset), and its alt text genuinely describes a harbor photo — boats, water, morning light, that kind of specific — not filler like 'photo', 'image', or a filename. The three srcset entries keep their w descriptors and ascend from smallest to largest."
hints:
  - "srcset is a comma-separated menu; each entry is 'filename WIDTHw', where the w number is the file's true pixel width: harbor-480.jpg 480w."
  - "Copy both attribute values exactly as printed in the lesson — the checker compares them character for character, so keep each attribute value on a single line."
  - "The CSS half goes in styles.css: .photo img { width: 100%; height: auto; } — fill the column, keep the aspect ratio."
---
## One photo, three files

A 1600px-wide photo looks glorious on a desktop — and costs a phone on a
parking-lot connection several seconds and several megabytes it didn't need.
One file can't serve every screen. So don't send one file: offer a **menu**,
and let the browser order for its own hardware.

```html
<img src="harbor-960.jpg"
     srcset="harbor-480.jpg 480w, harbor-960.jpg 960w, harbor-1600.jpg 1600w"
     sizes="(min-width: 800px) 640px, 100vw"
     alt="Fishing boats moored in a glassy harbor at sunrise">
```

Two new attributes, two jobs:

- **`srcset`** lists the same photo at several true widths. The `480w` is a
  *width descriptor* — you're telling the browser how many pixels wide each
  file really is, so it can do byte math you can't.
- **`sizes`** states how wide the image will *display*: "on screens 800px
  and up, it'll be 640px wide; otherwise the full viewport." The browser
  combines that with the device's pixel density and picks the cheapest file
  that will still look sharp. A crisp phone might grab `harbor-960.jpg` for
  a 390px slot — 2× screens need the extra pixels.

Note what you *don't* write: no rules about which file wins. `srcset` is a
suggestion box, and the browser — which knows the screen, the zoom level,
maybe even the data plan — chooses. Keep `src` as the fallback for browsers
that predate the menu.

The CSS half is two lines you'll write forever: `width: 100%` so the image
fills whatever column it lands in, `height: auto` so it keeps its shape.

One honest caveat: these image files are invented, so the preview shows the
alt text instead — which is why the alt text has to be worth showing. The
checker reads your markup's structure, exactly as a browser would.

### Your goal

1. In `index.html`, give the img the `srcset` and `sizes` values exactly as
   shown, keep `src="harbor-960.jpg"`, and write alt text that genuinely
   describes the photo.
2. In `styles.css`: `.photo img { width: 100%; height: auto; }`
