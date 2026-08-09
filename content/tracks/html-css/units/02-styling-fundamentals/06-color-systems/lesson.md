---
id: 06-color-systems
title: Color Systems
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Color the poster three ways: the .banner gets hex #1d3557 with white text, the .cta gets rgb(230, 57, 70), and each .session card gets hsl(150, 45%, 85%)."
docs: [html-css/colors-and-typography]
checks:
  - id: banner-hex
    type: dom
    assertions:
      - { selector: ".banner", cssRule: { property: "background-color", equals: "rgb(29, 53, 87)" } }
      - { selector: ".banner", cssRule: { property: "color", equals: "white" } }
  - id: cta-rgb
    type: dom
    assertions:
      - { selector: ".cta", cssRule: { property: "background-color", equals: "rgb(230, 57, 70)" } }
      - { selector: ".cta", cssRule: { property: "color", equals: "white" } }
  - id: session-hsl
    type: dom
    assertions:
      - { selector: ".session", cssRule: { property: "background-color", equals: "rgb(200, 234, 217)" } }
hints:
  - "Hex goes straight in as a value: background-color: #1d3557;"
  - "rgb() takes three numbers 0–255: rgb(230, 57, 70) — lots of red, little green and blue."
  - "hsl() reads as hue (0–360 on the color wheel), saturation %, lightness %: hsl(150, 45%, 85%)."
---
## Three ways to say the same color

Keywords like `crimson` run out fast — real palettes need precision. CSS
gives you three main notations, and they're all the *same* color underneath,
just spelled differently.

**Hex** — `#1d3557` — three pairs of base-16 digits: red `1d`, green `35`,
blue `57`. It's the format designers hand you and color pickers copy out.
You'll read hex forever; you'll rarely compute it by hand.

**RGB** — `rgb(230, 57, 70)` — the same three channels as plain numbers,
0 to 255. Easier to eyeball: that one is red-heavy, so it's a red.

**HSL** — `hsl(150, 45%, 85%)` — the humane one. Hue is a spot on the color
wheel (0 red, 120 green, 240 blue), then saturation (how vivid) and lightness
(how bright). Its superpower is *tweaking*: want the same green but paler?
Raise the lightness. Want a matching blue? Change only the hue. Try it in the
preview — nudge the numbers and watch.

Because they're one color in three costumes, the checker for this lesson
compares the *computed* color — write `#e63946` or `rgb(230, 57, 70)` or the
matching hsl, and the same check passes. The spelling is for humans.

The starter is a film-festival poster: a banner, a ticket button, and two
session cards, all waiting in default black-and-white.

### Your goal

In `styles.css`:

1. `.banner` — `background-color: #1d3557;` and `color: white;`
2. `.cta` — `background-color: rgb(230, 57, 70);` and `color: white;`
3. `.session` — `background-color: hsl(150, 45%, 85%);`

Deep navy, punchy red, soft mint — a palette, not a coincidence.
