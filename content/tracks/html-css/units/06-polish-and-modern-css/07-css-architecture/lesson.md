---
id: 07-css-architecture
title: CSS Architecture
language: html-css
runner: browser
estMinutes: 20
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Refactor the festival's tangled CSS into one flat, named component: every card becomes .screening, titles .screening__title, times .screening__when, the gold one .screening--featured — and the id hook, the .card2 class, and every descendant-chain selector disappear."
docs: [html-css/selectors, html-css/semantic-html]
checks:
  - id: bem-classes-in-html
    type: dom
    assertions:
      - { selector: ".screening", count: 3 }
      - { selector: ".screening__title", count: 3 }
      - { selector: ".screening__when", count: 3 }
      - { selector: ".screening--featured", count: 1 }
  - id: old-hooks-gone
    type: dom
    assertions:
      - { selector: "#special", count: 0 }
      - { selector: ".card2", count: 0 }
      - { selector: ".txt", count: 0 }
  - id: component-styled-flat
    type: dom
    assertions:
      - { selector: ".screening", cssRule: { property: "background-color", equals: "rgb(255, 255, 255)" } }
      - { selector: ".screening__title", cssRule: { property: "font-size", equals: "1.15rem" } }
      - { selector: ".screening--featured", cssRule: { property: "background-color", equals: "rgb(255, 248, 225)" } }
  - id: architecture-audit
    type: ai-judge
    rubric: "The stylesheet's component section uses only flat, single-class selectors — .screening, .screening__title, .screening__when, .screening--featured — with no id selectors, no element-qualified selectors like article.card2 or .cards article h2, and no descendant chains for the component's parts. The modifier rule .screening--featured declares only what differs from the base card (the gold background and border treatment), relying on .screening for everything shared, and the featured article in the HTML carries BOTH classes. Class names follow block__element--modifier consistently. The rendered page matches the starter's design: three white cards with the first one gold-tinted and gold-bordered — the refactor changed names and selector shape, not appearance."
hints:
  - "Rename in the HTML first: every article gets class=\"screening\" (the first one class=\"screening screening--featured\"), each h2 gets screening__title, each time-line p gets screening__when. Delete the id entirely."
  - "Then rebuild the selectors to match, one flat class each: .screening { }, .screening__title { }, .screening__when { }, .screening--featured { } — copy the declarations across from whichever tangle used to supply them."
  - "The modifier stays minimal: .screening--featured only re-declares background-color: #fff8e1 and border-color: #b8860b, and must come after .screening in the file so its overrides win."
---
## Naming is the architecture

The starter styles three festival cards with the greatest hits of
unmaintainable CSS: an `#special` id ruling one card by specificity
fiat, an `article.card2` qualified class, and `.cards article h2` —
a selector that styles titles *by their address*. It renders fine.
It's also unmodifiable: move a card, restyle one title, add a fourth —
something unrelated breaks, because every selector encodes assumptions
about where things sit.

At scale, teams solve this with a naming **convention**. The most
durable one is BEM — block, element, modifier:

```css
.screening { }                /* block: the component */
.screening__title { }         /* element: a part of it  (double underscore) */
.screening--featured { }      /* modifier: a variant of it (double dash) */
```

Three rules of the school:

- **One class per selector, flat.** `.screening__title` says *what it
  is*, not where it lives — so it works wherever the card goes, and its
  specificity is always one class. No ids, no `article.card2`, no
  descendant chains. The cascade can't ambush you if every selector
  weighs the same.
- **Modifiers ride on the base.** The featured card's HTML carries
  `class="screening screening--featured"` — base supplies everything
  shared, modifier re-declares *only the differences* (here: gold
  background, gold border). Later in the file, same specificity, so it
  wins by order. That's the cascade working *for* you — deliberately.
- **The HTML becomes self-documenting.** `screening__when` in the
  markup tells the next developer exactly which rule styles it and what
  else it's related to. `#special` told them nothing except "good luck."

Yes — the names are ugly. Two underscores, two dashes, and the word
`screening` seventeen times. That ugliness *is* the feature: grep-able,
collision-proof, and boring, which is what you want from load-bearing
infrastructure. This refactor changes no pixels; run the preview before
and after to prove it.

### Your goal

1. In `index.html`: cards → `screening` (featured one also
   `screening--featured`, id deleted), titles → `screening__title`,
   time lines → `screening__when`.
2. In `styles.css`: rebuild the component section as four flat rules —
   `.screening`, `.screening__title`, `.screening__when`, and a
   minimal `.screening--featured` (only `background-color: #fff8e1`
   and `border-color: #b8860b`) placed after the base rule.
