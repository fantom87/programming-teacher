---
id: 02-specificity-and-cascade
title: Specificity and the Cascade
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Untangle the conflicting rules: make the h1 render teal (fix the duplicate rule), then add a .alert rule with color crimson that beats the plain p rule — without deleting the p rule."
docs: [html-css/selectors]
checks:
  - id: heading-fixed
    type: dom
    assertions:
      - { selector: "h1", cssRule: { property: "color", equals: "teal" } }
  - id: alert-wins
    type: dom
    assertions:
      - { selector: ".alert", cssRule: { property: "color", equals: "crimson" } }
  - id: base-rule-kept
    type: dom
    assertions:
      - { selector: "p", cssRule: { property: "color", equals: "dimgray" } }
hints:
  - "Two rules tie in specificity? The one written LOWER in the file wins."
  - "Delete (or re-color) the second h1 rule — the lightgray one is overriding teal."
  - "A class selector outranks a tag selector no matter where it sits, so .alert { color: crimson; } can go anywhere — even above the p rule."
---
## When rules collide

Sooner or later two rules will disagree about the same element. CSS settles
every fight with two questions, asked in order:

**1. Which selector is more specific?** Roughly: an `id` selector (`#hero`)
beats a class selector (`.alert`), and a class beats a plain tag (`p`). The
more specific rule wins, *regardless of where it appears in the file*.

**2. Tie? Last one wins.** Two rules with equal specificity — say, two `h1`
rules — resolve by source order: whichever comes later in the stylesheet takes
the property.

That's the **cascade**, the C in CSS. It's why you can set broad defaults with
tag selectors up top and override details with classes below.

The starter stylesheet has both problems live. Someone appended a second `h1`
rule, so the heading renders washed-out `lightgray` instead of `teal` — a
specificity *tie* being settled by order, against you. And the warning
paragraph is stuck `dimgray` like its siblings because nothing more specific
targets it.

One habit to build now: when a rule "doesn't work," the fix is almost never
`!important` (a sledgehammer that wins every fight and makes the *next*
conflict unfixable). The fix is understanding which rule is winning and why.

### Your goal

In `styles.css`:

1. Make the `h1` actually render `teal` — remove or repair the later
   `lightgray` rule that's overriding it.
2. Add a `.alert` rule with `color: crimson;`. Place it *above* the `p` rule
   on purpose, and watch it win anyway — class beats tag.
3. Leave the `p { color: dimgray; }` rule in place; the other paragraphs
   should stay gray.

When the heading is teal and only the warning glows crimson, the cascade is
working *for* you.
