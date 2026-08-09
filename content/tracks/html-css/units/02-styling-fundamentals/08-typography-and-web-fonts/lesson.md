---
id: 08-typography-and-web-fonts
title: Typography and Web Fonts
language: html-css
runner: browser
estMinutes: 18
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Build a two-font type system: a Georgia, serif body stack, a \"Segoe UI\", Arial, sans-serif heading stack on h1, and a .kicker styled as a spaced-out uppercase label."
docs: [html-css/colors-and-typography]
checks:
  - id: body-stack
    type: dom
    assertions:
      - { selector: "body", cssRule: { property: "font-family", equals: "Georgia, serif" } }
  - id: heading-stack
    type: dom
    assertions:
      - { selector: "h1", cssRule: { property: "font-family", equals: "\"Segoe UI\", Arial, sans-serif" } }
  - id: kicker-label
    type: dom
    assertions:
      - { selector: ".kicker", cssRule: { property: "text-transform", equals: "uppercase" } }
      - { selector: ".kicker", cssRule: { property: "letter-spacing", equals: "0.08em" } }
      - { selector: ".kicker", cssRule: { property: "font-size", equals: "0.875rem" } }
  - id: deliberate-typography
    type: ai-judge
    rubric: "The stylesheet shows a deliberate two-font system: a serif body stack and a contrasting sans-serif heading stack, each font-family list ending in a generic fallback family (serif / sans-serif), plus a .kicker rule styled as a small uppercase label with letter-spacing. Rules target sensible selectors and would produce a clear heading/body contrast."
hints:
  - "A font stack is a ranked wishlist: font-family: Georgia, serif; — first hit wins."
  - "Multi-word font names need quotes: font-family: \"Segoe UI\", Arial, sans-serif;"
  - "The kicker recipe: text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.875rem;"
---
## Choosing typefaces like you mean it

`font-family` doesn't take a font — it takes a **stack**, a ranked wishlist:

```css
body {
  font-family: Georgia, serif;
}
```

"Give me Georgia; if this machine doesn't have it, any serif will do." The
browser walks the list until a name matches, so *always* end with a generic
family (`serif`, `sans-serif`, `monospace`) as the safety net. Multi-word
names need quotes: `"Segoe UI"`.

Where do fancier fonts come from? **Web fonts** — font files the page
downloads like images. In production you'd add one line in the `<head>`
(services like Google Fonts hand it to you) or write an `@font-face` rule
pointing at the file, and then use it *exactly* like this lesson does: the
downloaded name first, fallbacks behind it —

```css
font-family: "Fraunces", Georgia, serif;
```

Our practice environment doesn't fetch from the network, so today you'll
build the stack with fonts machines already have. The skill transfers
one-to-one; only the first name in the list changes.

The classic editorial move you're recreating: a **serif body** for long
reading, a **sans-serif heading** for contrast, and above the headline a
*kicker* — that small spaced-out ALL-CAPS label newspapers use ("OPINION",
"FOOD & DRINK"). Its recipe is three declarations: shrink it, uppercase it
via `text-transform` (the text stays lowercase in the HTML — CSS does the
shouting), and open up `letter-spacing`, because capitals packed at normal
spacing read like a password.

### Your goal

In `styles.css`:

1. `body` — `font-family: Georgia, serif;`
2. `h1` — `font-family: "Segoe UI", Arial, sans-serif;`
3. `.kicker` — `text-transform: uppercase;`, `letter-spacing: 0.08em;`, and
   `font-size: 0.875rem;`

Squint at the preview: the page should read as *designed* — two voices, one
conversation.
