---
id: 05-responsive-typography
title: Responsive Typography
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Tune the essay's type for every screen: paragraphs capped at 65ch, an h2 that steps from 1.4rem to 1.75rem at 900px, and an h1 clamp() whose preferred value mixes rem + vw so zoom keeps working."
docs: [html-css/colors-and-typography, html-css/responsive-design]
checks:
  - id: readable-measure
    type: dom
    assertions:
      - { selector: ".essay p", cssRule: { property: "max-width", equals: "65ch" } }
  - id: heading-step
    type: dom
    assertions:
      - { selector: "h2", cssRule: { property: "font-size", equals: "1.75rem" } }
  - id: accessible-fluid-type
    type: ai-judge
    rubric: "Three things hold. (1) The h1's font-size is a clamp() whose preferred (middle) value mixes a rem term with a vw term — e.g. 1.3rem + 2.5vw — not vw alone, so browser zoom and user font-size settings still scale it. (2) h2 has a base font-size of 1.4rem outside any media query, and the 1.75rem value sits inside an @media (min-width: 900px) block that comes after it — not a bare unconditional override. (3) Every font-size in the stylesheet is rem-based or clamp-of-rem — no px font sizes."
hints:
  - "Three separate rules: .essay p { max-width: 65ch; }, a base h2 { font-size: 1.4rem; }, and an @media (min-width: 900px) block bumping h2 to 1.75rem."
  - "The h1: font-size: clamp(1.9rem, 1.3rem + 2.5vw, 3rem); — the rem term inside the middle is the accessibility part, keep it."
  - "Why not clamp(1.9rem, 3vw, 3rem)? Pure-vw text ignores browser zoom — zooming changes neither the viewport nor the text. Adding a rem term gives zoom something to grab."
---
## Type that travels well

Layout is only half of responsive design. The other half is the reading
experience itself — and type has its own three tools.

**A measure in `ch`.** You capped lines at `60ch` back in the units lesson,
and the habit matters *more* now: a fluid page will happily stretch a
paragraph to 200 characters per line on a wide screen. `max-width: 65ch` on
paragraphs keeps the measure readable at every width, automatically.

**A stepped scale.** Small screens want a compact heading scale; big
screens can afford drama. The pattern is the one you know — base value,
then a `min-width` bump:

```css
h2 { font-size: 1.4rem; }

@media (min-width: 900px) {
  h2 { font-size: 1.75rem; }
}
```

**A fluid display size — with a catch.** For the big `h1` you'll reach for
`clamp()`, but here's a professional nuance worth a tattoo: **don't make
the middle value pure `vw`.** Text sized only in viewport units ignores
browser zoom — zooming in changes neither the viewport width nor, therefore,
the text. Readers who zoom get nothing. The fix is mixing a `rem` term into
the preferred value:

```css
h1 {
  font-size: clamp(1.9rem, 1.3rem + 2.5vw, 3rem);
}
```

The `2.5vw` part makes it fluid; the `1.3rem` part keeps it tethered to the
reader's font settings, so zoom and "make text bigger" both still work.
Fluid *and* accessible — that pairing is the whole craft of responsive
typography, and it's why every font size in this stylesheet stays in `rem`.

The starter is a short essay with everything set in stone. Loosen it.

### Your goal

In `styles.css`:

1. `.essay p { max-width: 65ch; }`
2. A base `h2` at `1.4rem`, stepped up to `1.75rem` inside
   `@media (min-width: 900px)`.
3. The `h1` sized with the mixed clamp shown above (tweak numbers if you
   like — keep the rem term in the middle).
