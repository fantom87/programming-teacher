---
id: 04-theming
title: "Capstone 4: Theming"
language: html-css
runner: browser
estMinutes: 30
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Move every color into the designer's five custom properties on :root, apply them with var(), and add a prefers-color-scheme: dark block that re-declares only --paper, --ink, and --brass."
docs: [html-css/colors-and-typography, html-css/selectors, html-css/responsive-design]
checks:
  - id: constant-tokens
    type: dom
    assertions:
      - { selector: ":root", cssRule: { property: "--curtain", equals: "#5a1f24" } }
      - { selector: ":root", cssRule: { property: "--marquee", equals: "#f6ead8" } }
  - id: dark-overrides-after-base
    type: dom
    assertions:
      - { selector: ":root", cssRule: { property: "--paper", equals: "#171420" } }
      - { selector: ":root", cssRule: { property: "--ink", equals: "#ece5d4" } }
      - { selector: ":root", cssRule: { property: "--brass", equals: "#e0b458" } }
  - id: tokens-wired-up
    type: dom
    assertions:
      - { selector: "body", cssRule: { property: "background-color", equals: "var(--paper)" } }
      - { selector: "body", cssRule: { property: "color", equals: "var(--ink)" } }
      - { selector: ".site-header", cssRule: { property: "background-color", equals: "var(--curtain)" } }
      - { selector: ".hero", cssRule: { property: "background-color", equals: "var(--curtain)" } }
      - { selector: ".hero", cssRule: { property: "color", equals: "var(--marquee)" } }
  - id: accents-through-vars
    type: dom
    assertions:
      - { selector: "a", cssRule: { property: "color", equals: "var(--brass)" } }
      - { selector: ".site-header a", cssRule: { property: "color", equals: "var(--marquee)" } }
      - { selector: ".film-card", cssRule: { property: "border", equals: "1px solid var(--brass)" } }
  - id: theming-audit
    type: ai-judge
    rubric: "A tokenized theme with an honest dark mode. (1) The base :root block declares exactly the designer's light values — --paper: #f7f2e7, --ink: #221d2b, --brass: #7c5210, --curtain: #5a1f24, --marquee: #f6ead8 (the checker can only see the dark cascade winners, so verify the light three here). (2) The @media (prefers-color-scheme: dark) block comes after the base :root, contains ONLY a :root rule re-declaring exactly --paper, --ink, and --brass — no component rules duplicated inside, and the two constant tokens (--curtain, --marquee) not re-declared. (3) Outside the two :root blocks, no raw color values remain: every color/background-color/border color goes through var(). (4) The pairings stay readable in BOTH themes: ink on paper, brass on paper, and marquee on curtain must each be WCAG AA — the designer's values pass (14:1, 6:1, 10:1); if the learner substituted values, check the substitutions still clear 4.5:1 for body-size text. (5) The brand and header links use --marquee so they survive the curtain background in both themes."
hints:
  - "The designer's tokens, typed exactly at the top of the sheet: :root { --paper: #f7f2e7; --ink: #221d2b; --brass: #7c5210; --curtain: #5a1f24; --marquee: #f6ead8; }"
  - "Dark mode is one block placed AFTER the base :root, and it only touches the three tokens that flip: @media (prefers-color-scheme: dark) { :root { --paper: #171420; --ink: #ece5d4; --brass: #e0b458; } } — the checker reads the cascade like a browser, so order matters."
  - "Wiring: body gets background-color: var(--paper) and color: var(--ink); .site-header and .hero get background-color: var(--curtain); .brand, .site-header a, and .hero text use var(--marquee); a, h2, and the .film-card border use var(--brass). When you finish, no #hex should appear outside the two :root blocks."
---
## Theming

The designer finally called back. Five tokens, two themes — and a
constraint that is the whole lesson: dark mode may not duplicate a
single component rule.

```css
:root {
  --paper: #f7f2e7;   /* page background   */
  --ink: #221d2b;     /* body text         */
  --brass: #7c5210;   /* links, headings   */
  --curtain: #5a1f24; /* header & hero     */
  --marquee: #f6ead8; /* text on curtain   */
}
```

Named for role, not appearance — that's what makes them **design
tokens** rather than just variables. Wire them in with `var()`: body
on paper in ink, the header and hero draped in curtain with marquee
text, brass on links, headings, and card borders. When you're done,
grep yourself honest: no `#hex` outside `:root`.

Then dark mode, and the trick that pays for the setup:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --paper: #171420;
    --ink: #ece5d4;
    --brass: #e0b458;
  }
}
```

Three declarations re-theme the entire site. Every rule that says
`var(--paper)` follows the token; nothing else changes. And notice
what *doesn't* flip: the curtain stays its deep red and the marquee
its warm white, because the header should read like the same building
at night — some tokens are constants, and knowing which is design
judgment, not syntax.

Two mechanics matter. The dark block goes **after** the base `:root`
— it wins by cascade order, exactly like your responsive overrides
(the checker reads it the same way). And the marquee/curtain pairing
is why text on the curtain never touches `--ink`: ink goes
near-white in dark mode, but the curtain it would sit on doesn't
move. Every pairing here clears WCAG AA in both themes — the audit
session will hold you to that.

### Your goal

1. The five tokens on `:root`, typed exactly; the dark block after
   it, re-declaring only `--paper`, `--ink`, `--brass`.
2. Body, header, hero, links, headings, and card borders all wired
   through `var()` — no raw colors outside the `:root` blocks.
3. Marquee text on every curtain background, so both themes stay AA
   readable.
