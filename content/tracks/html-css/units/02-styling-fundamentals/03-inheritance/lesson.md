---
id: 03-inheritance
title: Inheritance
language: html-css
runner: browser
estMinutes: 12
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Style the whole page from one body rule (color darkslategray, font-family Georgia then serif), and make the .tagline stop fighting it by setting its color to inherit."
docs: [html-css/selectors, html-css/colors-and-typography]
checks:
  - id: body-sets-the-tone
    type: dom
    assertions:
      - { selector: "body", cssRule: { property: "color", equals: "darkslategray" } }
      - { selector: "body", cssRule: { property: "font-family", equals: "Georgia, serif" } }
  - id: tagline-inherits
    type: dom
    assertions:
      - { selector: ".tagline", cssRule: { property: "color", equals: "inherit" } }
hints:
  - "One rule on body: color and font-family. Every heading and paragraph follows."
  - "The font stack is two names separated by a comma: Georgia, serif"
  - "Don't delete the .tagline rule — change its color value to the keyword inherit."
---
## Styles that flow downhill

You've already used this without naming it: back in First CSS, one
`font-family` on `body` changed *every* paragraph. That's **inheritance** —
text-styling properties flow from parent to child, down through the whole
tree, until something overrides them.

Properties about *text* inherit: `color`, `font-family`, `font-size`,
`line-height`, `text-align`. Properties about *boxes* don't: `border`,
`padding`, `margin`, `background-color`. Which makes sense — if borders
inherited, one border on `body` would draw a rectangle around every element
on the page.

This is why professionals set page-wide typography exactly once:

```css
body {
  color: darkslategray;
  font-family: Georgia, serif;
}
```

Everything inherits it. No rule per heading, no rule per paragraph.

But inheritance is only a *default* — any rule directly targeting an element
beats it. The starter page has one of those: a `.tagline` rule pinning the
subtitle to `steelblue`. Change the body color all you like; the tagline
won't budge, because a direct hit always beats a hand-me-down.

For that, CSS gives you the `inherit` keyword — an explicit "take whatever my
parent has":

```css
.tagline {
  color: inherit;
}
```

Now the tagline follows the body again, and if you ever re-theme the page,
it comes along for free.

### Your goal

In `styles.css`:

1. Write a `body` rule with `color: darkslategray;` and
   `font-family: Georgia, serif;` — the whole page should change at once.
2. In the existing `.tagline` rule, replace `steelblue` with `inherit` so the
   subtitle matches the rest of the text.

One rule up top, one keyword below — and the entire page agrees on a look.
