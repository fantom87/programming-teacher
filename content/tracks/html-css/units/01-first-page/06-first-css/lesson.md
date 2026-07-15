---
id: 06-first-css
title: First CSS
language: html-css
runner: browser
estMinutes: 12
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Give the h1 the color darkblue and give the page body a font-family of sans-serif, using the stylesheet."
docs: [html-css/selectors, html-css/colors-and-typography]
checks:
  - id: heading-color
    type: dom
    assertions:
      - { selector: "h1", cssRule: { property: "color", equals: "darkblue" } }
  - id: body-font
    type: dom
    assertions:
      - { selector: "body", cssRule: { property: "font-family", equals: "sans-serif" } }
hints:
  - "A CSS rule looks like:  h1 { color: red; }"
  - "The selector (before the braces) picks which elements the rule styles."
  - "Use the styles.css tab — the HTML already links to it."
---
## Separating looks from structure

HTML says what things **are**; CSS says how they **look**. A CSS rule has a
*selector* (what to style) and *declarations* (how to style it):

```css
p {
  color: green;
  font-size: 18px;
}
```

This page already links its stylesheet — look at the `<link>` tag in
`index.html`, then click the **styles.css** tab to edit the styles.

### Your goal

In `styles.css`:

1. Make every `h1` the color `darkblue`.
2. Give `body` the font family `sans-serif` (this changes all the text).

Watch the preview change the moment your rule is right.
