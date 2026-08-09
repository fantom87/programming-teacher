---
id: 05-dark-mode
title: Dark Mode
language: html-css
runner: browser
estMinutes: 18
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Give Field Notes a dark theme the OS can switch on: add color-scheme: light dark to :root, then a @media (prefers-color-scheme: dark) block after the base rules that re-declares only the five tokens — surface #14161a, card #1e2127, ink #d7dae1, muted #a19d94, accent #7fc8a4."
docs: [html-css/responsive-design, html-css/colors-and-typography]
checks:
  - id: scheme-declared
    type: dom
    assertions:
      - { selector: ":root", cssRule: { property: "color-scheme", equals: "light dark" } }
  - id: dark-tokens
    type: dom
    assertions:
      - { selector: ":root", cssRule: { property: "--surface", equals: "#14161a" } }
      - { selector: ":root", cssRule: { property: "--card", equals: "#1e2127" } }
      - { selector: ":root", cssRule: { property: "--ink", equals: "#d7dae1" } }
      - { selector: ":root", cssRule: { property: "--muted", equals: "#a19d94" } }
      - { selector: ":root", cssRule: { property: "--accent", equals: "#7fc8a4" } }
  - id: plumbing-intact
    type: dom
    assertions:
      - { selector: "body", cssRule: { property: "background-color", equals: "var(--surface)" } }
      - { selector: "body", cssRule: { property: "color", equals: "var(--ink)" } }
      - { selector: ".note", cssRule: { property: "background-color", equals: "var(--card)" } }
  - id: one-block-two-themes
    type: ai-judge
    rubric: "The dark overrides live in exactly ONE @media (prefers-color-scheme: dark) block, placed after the base :root rule, and inside it only the :root tokens are re-declared (--surface #14161a, --card #1e2127, --ink #d7dae1, --muted #a19d94, --accent #7fc8a4) — no component rules (body, .note, h1, a, .meta) are duplicated inside the media block. The base :root still declares the original light values (#f6f3ec, #fffdf8, #2b2e33, #6d6a63, #366e54) plus color-scheme: light dark. Both palettes hold WCAG AA: ink on surface and on card, and muted on card, at 4.5:1 or better in each theme."
hints:
  - "Everything routes through the five tokens already — so dark mode is just new token values under a condition: @media (prefers-color-scheme: dark) { :root { ... } } placed after the base :root."
  - "Inside the media block re-declare only the tokens: --surface: #14161a; --card: #1e2127; --ink: #d7dae1; --muted: #a19d94; --accent: #7fc8a4; — touch none of the component rules."
  - "Add color-scheme: light dark; to the BASE :root rule (not the media block) — it tells the browser both themes are supported, so form controls and scrollbars switch too."
---
## The theme is five lines

Last lesson you pulled Field Notes' palette into `:root` tokens. Here's
the payoff: a dark theme is now *a re-declaration of five custom
properties*, wrapped in a media query you already know the shape of —

```css
@media (prefers-color-scheme: dark) {
  :root {
    --surface: #14161a;
    /* ...four more tokens... */
  }
}
```

`prefers-color-scheme` reports the reader's OS-level choice. When it's
`dark`, the `:root` inside the block wins the cascade (same specificity,
later in the file), the tokens flip, and every `var()` on the page —
body, cards, links, borders — re-resolves instantly. **No component
rule changes.** That's the whole trick, and it only works because
lesson 4 made the palette a single source of truth. If any rule still
carried a hardcoded light-theme hex, it would now be a bug you could
only see at night.

One companion declaration, on the *base* `:root`:

```css
color-scheme: light dark;
```

This tells the browser itself — not just your CSS — that both themes
are intended. Scrollbars, form controls, and the default canvas switch
to their dark variants instead of glaring white out of a dark page.

Two craft notes for the dark palette. **Dark mode is not inversion** —
pure black `#000` with pure white text vibrates; well-built dark themes
use dark *grays* (`#14161a`) with off-white ink (`#d7dae1`). And
**contrast still has rules**: the muted caption color that passed AA on
cream will not pass on near-black by luck — every pair gets re-checked
in both themes. The values in the goal are pre-verified; the discipline
of re-checking is the lesson.

The preview runs in whichever mode your OS is set to — flip your system
theme (or emulate it in DevTools) and watch the page follow.

### Your goal

In `styles.css`:

1. Add `color-scheme: light dark;` to the base `:root` rule.
2. After the base rules, add one `@media (prefers-color-scheme: dark)`
   block re-declaring only the tokens: `--surface: #14161a`,
   `--card: #1e2127`, `--ink: #d7dae1`, `--muted: #a19d94`,
   `--accent: #7fc8a4`.
