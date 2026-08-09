---
id: 09-pseudo-classes-and-elements
title: Pseudo-classes and Pseudo-elements
language: html-css
runner: browser
estMinutes: 20
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Finish the reading list with selector magic: links turn crimson on a:hover, odd list rows get a #eef2f7 stripe via li:nth-child(odd), and the intro opens with a 2.5rem drop cap via .intro::first-letter."
docs: [html-css/selectors, html-css/transitions-and-animation]
checks:
  - id: hover-state
    type: dom
    assertions:
      - { selector: "a:hover", cssRule: { property: "color", equals: "crimson" } }
  - id: zebra-stripes
    type: dom
    assertions:
      - { selector: "li:nth-child(odd)", cssRule: { property: "background-color", equals: "rgb(238, 242, 247)" } }
  - id: drop-cap
    type: dom
    assertions:
      - { selector: ".intro::first-letter", cssRule: { property: "font-size", equals: "2.5rem" } }
  - id: finishing-pass
    type: ai-judge
    rubric: "The stylesheet uses pseudo-classes and pseudo-elements as a deliberate finishing pass: an a:hover rule that gives links clear feedback (a color change, optionally with underline or background changes), an li:nth-child(odd) or equivalent nth-child striping rule for alternating rows, and a ::first-letter drop cap on the intro paragraph. Selectors are well-formed (single colon for pseudo-classes, double for pseudo-elements) and the choices would read as polish, not noise."
hints:
  - "State selectors bolt onto the end: a:hover { color: crimson; } — one colon."
  - "li:nth-child(odd) matches rows 1, 3, 5… Type it exactly — odd inside the parentheses."
  - "Pseudo-ELEMENTS take two colons: .intro::first-letter { font-size: 2.5rem; }"
---
## Styling things that aren't in your HTML

Every selector so far pointed at something you wrote. This last lesson is
about the rest: **states** the reader creates and **fragments** the browser
can see but you never marked up.

**Pseudo-classes** (one colon) match elements *in a situation*:

```css
a:hover {
  color: crimson;
}
```

That rule sleeps until a pointer rests on the link — then it wakes. `:hover`
is the web's handshake; its cousin `:focus` does the same job for keyboard
users tabbing through, and you'll treat them as a pair when we reach
accessibility.

Position is a situation too. `li:nth-child(odd)` matches the 1st, 3rd, 5th…
list items — zebra striping without touching the HTML. (`even` works, and so
do patterns like `3n+1`, which is pleasantly nerdy.) `:first-child` and
`:last-child` are the common special cases.

**Pseudo-elements** (two colons) go further — they select a *piece* of an
element that has no tag of its own:

```css
.intro::first-letter {
  font-size: 2.5rem;
}
```

That's a drop cap: the first letter, as if it were wrapped in its own
element, no wrapper required. `::first-line` works the same way, and
`::before`/`::after` can conjure entirely new decorative boxes — a story for
the animations unit.

The starter is your reading list for this course: an intro paragraph and five
linked books. It works; it just doesn't *respond*. Time for the finishing
pass.

### Your goal

In `styles.css`:

1. `a:hover { color: crimson; }` — run your mouse down the list afterward.
2. `li:nth-child(odd) { background-color: #eef2f7; }` — stripe the odd rows.
3. `.intro::first-letter { font-size: 2.5rem; }` — open big.

Small touches, big difference: the page now reacts to its reader. That's the
whole unit in one stylesheet — selectors, cascade, color, type, and polish.
