---
id: 01-the-viewport-meta
title: The Viewport Meta Tag
language: html-css
runner: browser
estMinutes: 10
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Make the food-truck page phone-ready: add the viewport meta tag to the head, and let the layout shrink by replacing .wrap's fixed width with max-width: 720px."
docs: [html-css/responsive-design, html-css/document-structure]
checks:
  - id: viewport-tag
    type: dom
    assertions:
      - { selector: "meta[name='viewport']", attr: "content", equals: "width=device-width, initial-scale=1" }
  - id: wrap-shrinks
    type: dom
    assertions:
      - { selector: ".wrap", cssRule: { property: "max-width", equals: "720px" } }
  - id: phone-ready
    type: ai-judge
    rubric: "The viewport meta tag sits inside head with content exactly width=device-width, initial-scale=1 — no user-scalable=no and no maximum-scale anywhere. In styles.css, .wrap declares max-width: 720px and no longer declares width: 720px (the fixed width was replaced, not supplemented), and no other rule reintroduces a fixed pixel width on .wrap."
hints:
  - "The tag is one line inside <head>: <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"> — type the content value exactly."
  - "In styles.css, change width: 720px on .wrap to max-width: 720px. Max means 'this wide when there's room, narrower when there isn't.'"
  - "Leave zooming alone — no user-scalable=no, no maximum-scale. Pinch-zoom belongs to the reader."
---
## The lie phones tell

Open any of your pages on a phone and the text shrinks to ant size. Here's
why: when smartphones arrived, the web was desktop-only, so mobile browsers
learned to render pages on a pretend **980px-wide canvas** and photograph the
result down to fit the glass. Every phone browser still does this — until
your page sends one signal saying *I know phones exist*:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Two promises in that `content` value. `width=device-width` — lay the page out
at the screen's *true* width, not the 980px fiction. `initial-scale=1` —
show it at full size, no zoomed-out photograph. This line is the admission
ticket to everything else in this unit; media queries can't help a page
that's being photographed.

One warning: snippets online sometimes add `user-scalable=no` or
`maximum-scale=1` to that value. Never copy those — they disable pinch-zoom,
which belongs to the reader, not to you.

The tag is also a promise *you* have to keep: the page must actually fit a
narrow screen. The starter's `.wrap` declares `width: 720px` — on a 390px
phone that's an instant sideways scrollbar, viewport tag or not. The habit
that fixes it for good:

```css
.wrap {
  max-width: 720px; /* never wider — but free to shrink */
}
```

The preview pane is a real desktop browser, so it never plays the 980px
trick — but drag the pane divider narrow and you'll see the second fix
working: with `width`, the truck menu scrolls sideways; with `max-width`,
it simply breathes in.

### Your goal

1. In `index.html`, add the viewport meta tag to the `<head>`, with the
   `content` value exactly as shown above.
2. In `styles.css`, replace `.wrap`'s `width: 720px` with
   `max-width: 720px` — replaced, not kept alongside.
