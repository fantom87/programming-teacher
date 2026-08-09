---
id: 05-modern-css-a11y-audit
title: Modern CSS and A11y Audit
language: html-css
runner: browser
estMinutes: 20
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Work the café's audit list: hoist the palette into :root custom properties, add a prefers-color-scheme dark override, replace outline: none with a :focus-visible ring, give the hero photo its alt text, and promote the fake Order div to a real button."
docs: [html-css/accessibility-basics, html-css/colors-and-typography]
checks:
  - id: dark-tokens
    type: dom
    assertions:
      - { selector: ":root", cssRule: { property: "--paper", equals: "#15181d" } }
      - { selector: ":root", cssRule: { property: "--ink", equals: "#e9e4da" } }
      - { selector: ":root", cssRule: { property: "--accent", equals: "#d97a4a" } }
  - id: tokens-used
    type: dom
    assertions:
      - { selector: "body", cssRule: { property: "background-color", equals: "var(--paper)" } }
      - { selector: "body", cssRule: { property: "color", equals: "var(--ink)" } }
      - { selector: "a", cssRule: { property: "color", equals: "var(--accent)" } }
      - { selector: ".order", cssRule: { property: "background-color", equals: "var(--accent)" } }
      - { selector: ".order", cssRule: { property: "color", equals: "var(--paper)" } }
  - id: focus-ring
    type: dom
    assertions:
      - { selector: "a:focus-visible", cssRule: { property: "outline", equals: "3px solid var(--accent)" } }
  - id: real-button
    type: dom
    assertions:
      - { selector: "button.order", attr: "type", equals: "button" }
      - { selector: "div.order", count: 0 }
  - id: alt-text
    type: dom
    assertions:
      - { selector: "img.hero-photo", attr: "alt", equals: "Morning light on the espresso counter's brass taps" }
  - id: audit-complete
    type: ai-judge
    rubric: "The base :root rule outside any media query still defines the light theme — --paper: #fdfbf7, --ink: #2b2b2b, --accent: #9c4221 — and the dark values (#15181d, #e9e4da, #d97a4a) appear only inside an @media (prefers-color-scheme: dark) block placed after it. The a { outline: none; } rule is deleted outright, not merely overridden later. No hard-coded colors remain on body, a, or .order — all five of those declarations reference the tokens via var(). Text contrast holds in both themes: dark ink on near-white paper, light ink on near-black paper, and the button's paper-colored text on the accent background."
hints:
  - "Tokens first: :root { --paper: #fdfbf7; --ink: #2b2b2b; --accent: #9c4221; } then swap every hard-coded color on body, a, and .order for var(--paper), var(--ink), var(--accent) — typed exactly."
  - "Dark mode is one block after the base :root: @media (prefers-color-scheme: dark) { :root { --paper: #15181d; --ink: #e9e4da; --accent: #d97a4a; } } — override the three tokens and every var() downstream follows."
  - "Delete a { outline: none; } entirely, add a:focus-visible { outline: 3px solid var(--accent); }, give the img alt=\"Morning light on the espresso counter's brass taps\", and retype the div as <button class=\"order\" type=\"button\">."
---
## The audit list

A returning developer's last drill: run the audit, fix everything. The
Corner Café page has five findings — three accessibility bugs and two
signs the CSS predates custom properties.

**Finding 1 — hard-coded palette.** The same three colors repeat across
the sheet. Hoist them once onto `:root`:

```css
:root {
  --paper: #fdfbf7;
  --ink: #2b2b2b;
  --accent: #9c4221;
}
```

Then `body`, `a`, and `.order` stop naming colors and start naming
*roles*: `var(--paper)`, `var(--ink)`, `var(--accent)`.

**Finding 2 — no dark mode.** With tokens, dark mode is three
reassignments, not a rewrite. After the base `:root`, add
`@media (prefers-color-scheme: dark)` overriding the tokens to
`#15181d`, `#e9e4da`, `#d97a4a`. Every `var()` downstream follows.

**Finding 3 — `a { outline: none; }`.** The deleted keyboard cursor,
again. Remove the rule and replace it with a
`a:focus-visible { outline: 3px solid var(--accent); }` ring — mouse
users see nothing, keyboard users see everything.

**Finding 4 — the hero photo has no `alt`.** A screen reader announces
"counter dot jay peg." Use the dictated text:
`alt="Morning light on the espresso counter's brass taps"`.

**Finding 5 — `<div class="order">Order ahead</div>`.** Unreachable by
keyboard, invisible to assistive tech. It performs an action:
`<button class="order" type="button">`. The class keeps the styling;
the element supplies the semantics.

### Your goal

1. Three tokens on `:root`, referenced by `body`, `a`, and `.order` —
   no hard-coded colors left there.
2. A `prefers-color-scheme: dark` block overriding all three tokens.
3. Focus ring restored, `alt` text added, the fake button made real.
