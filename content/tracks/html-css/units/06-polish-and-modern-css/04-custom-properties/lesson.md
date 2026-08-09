---
id: 04-custom-properties
title: Custom Properties
language: html-css
runner: browser
estMinutes: 18
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Pull the zine's repeated colors into tokens on :root — --paper: #fdf8ef, --ink: #2e2a24, --accent: #c2571b — then route every use through var(), including one fallback: the tag's text becomes var(--tag-ink, #fdf8ef)."
docs: [html-css/colors-and-typography, html-css/selectors]
checks:
  - id: tokens-declared
    type: dom
    assertions:
      - { selector: ":root", cssRule: { property: "--paper", equals: "#fdf8ef" } }
      - { selector: ":root", cssRule: { property: "--ink", equals: "#2e2a24" } }
      - { selector: ":root", cssRule: { property: "--accent", equals: "#c2571b" } }
  - id: tokens-used
    type: dom
    assertions:
      - { selector: "body", cssRule: { property: "background-color", equals: "var(--paper)" } }
      - { selector: "body", cssRule: { property: "color", equals: "var(--ink)" } }
      - { selector: "a", cssRule: { property: "color", equals: "var(--accent)" } }
      - { selector: ".tag", cssRule: { property: "background-color", equals: "var(--accent)" } }
  - id: fallback-used
    type: dom
    assertions:
      - { selector: ".tag", cssRule: { property: "color", equals: "var(--tag-ink, #fdf8ef)" } }
  - id: single-source-of-truth
    type: ai-judge
    rubric: "The three palette colors live as hex literals in the :root token block, and the only other hex occurrence of any of them is the required fallback inside .tag's var(--tag-ink, #fdf8ef) — every other place the palette appears (body colors, link color, h1 border, blockquote border, tag background) now goes through var(--paper)/var(--ink)/var(--accent), including the shorthand uses like border-bottom on h1 and border-left on blockquote. The .tag color uses the fallback form var(--tag-ink, #fdf8ef) and no --tag-ink token is defined, so the fallback is what renders. Changing --accent alone in :root would recolor the link, both borders, and the tag background simultaneously. The page's rendered appearance is unchanged from the starter."
hints:
  - "Declare tokens in one rule at the top: :root { --paper: #fdf8ef; --ink: #2e2a24; --accent: #c2571b; } — the leading double dash is what makes it a custom property."
  - "Then replace every literal: color: #c2571b becomes color: var(--accent), border-left: 4px solid #c2571b becomes border-left: 4px solid var(--accent), and so on for all three colors."
  - "var() takes a second argument as a fallback, used when the token isn't defined: .tag { color: var(--tag-ink, #fdf8ef); } — there is no --tag-ink, so the paper color applies. Type it exactly, one space after the comma."
---
## Name the color once

Count the burnt-orange `#c2571b` in the starter stylesheet. It's the
link color, the h1's underline, the blockquote's border, the tag's
background — four scattered copies. The editor wants it "a touch
deeper"? That's a find-and-replace and a prayer.

A **custom property** turns a repeated value into a single named fact:

```css
:root {
  --accent: #c2571b;
}

a {
  color: var(--accent);
}
```

Two halves. The *declaration* — any property starting with `--` — and
the *use*, `var(--accent)`, valid anywhere a value can appear, including
inside shorthands like `border-left: 4px solid var(--accent)`.

Why `:root`? Custom properties **inherit**, like `color` does. Declared
on the document's root element, a token is visible to every element on
the page — one palette, globally readable. (Declared on `.card`, it
would exist only inside cards. That scoping is a feature you'll use
later; today the palette is global.)

`var()` also takes a fallback for when the token isn't defined:

```css
.tag {
  color: var(--tag-ink, #fdf8ef);
}
```

No `--tag-ink` exists, so the fallback renders — but the hook is there.
This is how component libraries expose theming: the component names the
knob, and anyone can set it later without touching component CSS.

This isn't a convenience trick; it's the foundation of the next lesson.
A stylesheet whose palette lives in one `:root` block can be re-themed
by overriding *three lines*. A stylesheet with the palette smeared
through forty declarations cannot.

The discipline that makes it work: **after tokenizing, the literals
appear exactly once.** If `#c2571b` still lurks in a rule somewhere,
that rule silently ignores your future theme.

### Your goal

In `styles.css`:

1. Declare `--paper: #fdf8ef`, `--ink: #2e2a24`, `--accent: #c2571b`
   on `:root`.
2. Replace every use of those three literals with `var()` — body
   colors, link, h1 border, blockquote border, tag background.
3. Give `.tag` the fallback form: `color: var(--tag-ink, #fdf8ef);`.
