---
id: 04-links-and-images
title: Links and Images
language: html-css
runner: browser
estMinutes: 12
files:
  - path: index.html
    starter: starter/index.html
goal: "Add a link (a with an href) to a real page about your topic, and an image (img) with a src and alt text that genuinely describes the picture."
docs: [html-css/links-and-images, html-css/accessibility-basics]
checks:
  - id: has-link
    type: dom
    assertions:
      - { selector: "a[href]", exists: true }
  - id: has-image
    type: dom
    assertions:
      - { selector: "img[src]", exists: true }
      - { selector: "img[alt]", exists: true }
  - id: link-and-alt-quality
    type: ai-judge
    rubric: "The img element's alt text meaningfully describes what the picture shows (a real description, not filler like 'image', 'photo', or the filename), and the a element's href is a plausible URL — either a full http(s) address or a sensible relative path."
hints:
  - "A link wraps its clickable text: <a href=\"https://example.com\">click me</a>"
  - "An image is self-contained — no closing tag: <img src=\"cat.jpg\" alt=\"...\">"
  - "Good alt text answers: what would I say if I were describing this picture over the phone?"
---
## Two attributes that changed everything

So far your tags have been bare. Tags can also carry **attributes** — extra
settings written inside the opening tag as `name="value"` pairs. Two elements
run almost entirely on attributes.

The link, `<a>`, uses `href` to say where it goes:

```html
<a href="https://developer.mozilla.org">the MDN docs</a>
```

The image, `<img>`, uses `src` to say which picture to load — and it has no
closing tag, because there's no text to wrap:

```html
<img src="images/axolotl.jpg" alt="A pale pink axolotl resting on gravel">
```

That second attribute, `alt`, is the important one. It's the text that stands
in for the image: screen readers speak it aloud, and browsers display it when
the picture fails to load. Try it — since `images/axolotl.jpg` doesn't exist
here, the preview shows the alt text instead. That fallback is exactly why
lazy alt text like `alt="photo"` is useless: describe **what's in the
picture**, as if telling a friend over the phone.

### Your goal

Extend the starter page about a creature (or swap in a topic you like):

1. Add an `<a>` link with an `href` pointing to a real page about it — a
   Wikipedia URL works nicely.
2. Add an `<img>` with a `src` (a made-up filename is fine) and an `alt` that
   genuinely describes the picture you have in mind.

The AI will read your alt text and href — write them like you mean them.
