---
id: 04-fluid-units-and-clamp
title: Fluid Units and clamp()
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Make the festival hero fluid: .wrap gets max-width: 60rem, margin-inline: auto, and padding-inline: clamp(1rem, 5vw, 3rem); .hero gets padding-block: clamp(3rem, 12vw, 6rem); and the h1's font-size becomes a clamp() of your own design."
docs: [html-css/responsive-design, html-css/box-model]
checks:
  - id: fluid-frame
    type: dom
    assertions:
      - { selector: ".wrap", cssRule: { property: "max-width", equals: "60rem" } }
      - { selector: ".wrap", cssRule: { property: "margin-inline", equals: "auto" } }
      - { selector: ".wrap", cssRule: { property: "padding-inline", equals: "clamp(1rem, 5vw, 3rem)" } }
  - id: hero-breathing-room
    type: dom
    assertions:
      - { selector: ".hero", cssRule: { property: "padding-block", equals: "clamp(3rem, 12vw, 6rem)" } }
  - id: fluid-headline
    type: ai-judge
    rubric: "The .hero h1 rule sets font-size with a clamp() whose floor and ceiling are rem values and whose middle (preferred) value is vw-based — something like clamp(2.25rem, 6vw, 4rem). Exact numbers may differ, but the shape must hold: rem, then a vw term, then a larger rem. No fixed px font-size on the h1, and the dictated .wrap and .hero clamps were not achieved by editing the HTML instead of the CSS."
hints:
  - "clamp(floor, preferred, ceiling): the middle value is the fluid one (a vw amount); the outer two are limits it may never cross."
  - "Type the two dictated clamps exactly — padding-inline: clamp(1rem, 5vw, 3rem) and padding-block: clamp(3rem, 12vw, 6rem) — the checker matches them character for character."
  - "For the headline, pick your own: font-size: clamp(2.25rem, 6vw, 4rem) reads as 'never below 2.25rem, never above 4rem, 6% of the viewport width in between.'"
---
## Numbers that breathe

Breakpoints snap; between them, nothing moves. But some things shouldn't
snap at all — a hero headline shouldn't be either 2rem or 4rem with nothing
in between. For that you want **fluid** values, and the star unit is `vw`:
one percent of the viewport width. `font-size: 6vw` scales continuously as
the screen grows.

Raw `vw` alone is a menace, though — on a phone `6vw` is a whisper, on a
cinema display it's a billboard. Enter the best function in modern CSS:

```css
font-size: clamp(2.25rem, 6vw, 4rem);
/*          floor ↑   fluid ↑   ceiling ↑  */
```

Read it as a promise: *never below 2.25rem, never above 4rem, and 6% of the
viewport width whenever that lands in between.* A fixed value picks one
screen to look good on; a clamp picks two guardrails and glides between
them. Drag the preview divider and the headline simply... breathes.

It's not just for text. Spacing wants the same treatment — tight on phones,
generous on desktops:

```css
.hero {
  padding-block: clamp(3rem, 12vw, 6rem); /* top and bottom */
}
```

You met `padding-inline` (left/right as one property) last lesson;
`padding-block` is its vertical twin, and `margin-inline: auto` is the
modern spelling of the old `margin: 0 auto` centering trick. Together they
make the classic fluid frame — the pattern wrapping half the sites you
visit:

```css
.wrap {
  max-width: 60rem;        /* stop growing eventually   */
  margin-inline: auto;     /* stay centered             */
  padding-inline: clamp(1rem, 5vw, 3rem); /* fluid gutters */
}
```

### Your goal

In `styles.css`:

1. Give `.wrap` the fluid frame exactly as shown: `max-width: 60rem`,
   `margin-inline: auto`, `padding-inline: clamp(1rem, 5vw, 3rem)`.
2. Give `.hero` `padding-block: clamp(3rem, 12vw, 6rem)`.
3. Give the `.hero h1` a `font-size` clamp of your own — rem floor, vw
   middle, rem ceiling — and drag the divider until you like its glide.
