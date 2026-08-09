---
id: 06-color-contrast
title: Color Contrast
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Fix the flyer's failing contrast without losing the night: body text to #cfd4dc, fine print to #9aa3b0, and the CTA re-inked as #1b1e24 on #ffd166 — dark theme intact, every line at WCAG AA."
docs: [html-css/colors-and-typography, html-css/accessibility-basics]
checks:
  - id: body-text-readable
    type: dom
    assertions:
      - { selector: "body", cssRule: { property: "color", equals: "rgb(207, 212, 220)" } }
  - id: fine-print-readable
    type: dom
    assertions:
      - { selector: ".fine-print", cssRule: { property: "color", equals: "rgb(154, 163, 176)" } }
  - id: cta-readable
    type: dom
    assertions:
      - { selector: ".cta", cssRule: { property: "background-color", equals: "rgb(255, 209, 102)" } }
      - { selector: ".cta", cssRule: { property: "color", equals: "rgb(27, 30, 36)" } }
  - id: dark-and-legible
    type: ai-judge
    rubric: "The page keeps its dark theme — the body background stays a near-black like #1b1e24, not flipped to white — while every piece of text meets WCAG AA against the surface it actually sits on: body text and the .fine-print line at 4.5:1 or better on the dark background, and the .cta button's text at 4.5:1 or better against the button's own background color. No text color left in the stylesheet falls below AA against its background."
hints:
  - "Three rules change: the body color, the .fine-print color, and both colors on .cta. The lesson lists the exact replacement values."
  - "body { color: #cfd4dc; } and .fine-print { color: #9aa3b0; } — lighter grays, same mood, 11.2:1 and 6.5:1."
  - "The button flips: background-color: #ffd166 with color: #1b1e24 — dark-on-accent instead of dim-on-dim, 11.6:1."
---
## Legibility is arithmetic

Whether text is readable isn't a matter of taste — it's a ratio you can
compute. Take the luminance of the text color and the background color;
divide. The scale runs from 1:1 (gray on identical gray) to 21:1 (black
on white). **WCAG AA**, the standard worth memorizing, asks for:

- **4.5:1** for normal text
- **3:1** for large text (24px and up, or 19px bold)

The starter is a flyer for a night café's open mic. The designer went
moody: near-black background, dim gray text. Atmospheric — and
unreadable. The numbers, measured against the `#1b1e24` background:

```
body text   #6b6f76  →  3.3:1   fails
fine print  #4a4e55  →  2.0:1   fails hard
CTA button  #6f7480 on #2a2e35  →  2.9:1   fails
```

Here's the part designers miss: **fixing contrast doesn't mean
abandoning the theme.** Keep the hue, move the lightness. `#cfd4dc` is
the same cool gray as `#6b6f76`, just brighter — 11.2:1 on this
background, and the flyer still feels like 11 pm. The fine print at
`#9aa3b0` lands 6.5:1. And the button works the opposite trick:
instead of dim-on-dim, flip to dark text on the accent —
`#1b1e24` on `#ffd166` reads at 11.6:1 and finally looks like
something you'd click.

(The `h1` was already `#f4f6f8` — 15.4:1. Even the moodiest designs
tend to get the headline right; it's the small text that quietly rots.)

You don't compute these ratios by hand. Your browser's DevTools shows
the ratio in its color picker, and the WebAIM contrast checker does the
same online. The habit to build: every time you type a text color,
check it against what it sits on.

### Your goal

In `styles.css`:

1. Body text to `#cfd4dc`.
2. `.fine-print` to `#9aa3b0`.
3. `.cta` to `background-color: #ffd166` with `color: #1b1e24`.

The background stays `#1b1e24` — the night is not negotiable.
