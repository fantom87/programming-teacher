---
id: 01-transitions
title: Transitions
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Make the gig page's hovers glide instead of snap: .cta gets transition: background-color 0.3s ease, box-shadow 0.3s ease, and nav a gets transition: color 0.15s ease — declared on the base rules, not the hover rules."
docs: [html-css/transitions-and-animation, html-css/selectors]
checks:
  - id: cta-glides
    type: dom
    assertions:
      - { selector: ".cta", cssRule: { property: "transition", equals: "background-color 0.3s ease, box-shadow 0.3s ease" } }
  - id: nav-glides
    type: dom
    assertions:
      - { selector: "nav a", cssRule: { property: "transition", equals: "color 0.15s ease" } }
  - id: base-not-hover
    type: ai-judge
    rubric: "Both transition declarations live on the base rules (.cta and nav a), NOT inside the :hover rules — so the animation runs in both directions, on the way in and the way out. Each transition names exactly the properties that change on hover (background-color and box-shadow for .cta, color for nav a) rather than using 'all'. The :hover rules themselves are unchanged from the starter — still just the endpoint values. No transition-delay or extra properties were smuggled in."
hints:
  - "A transition is one declaration on the element's normal rule: transition: <property> <duration> <easing>. Comma-separate to cover several properties."
  - "On .cta add: transition: background-color 0.3s ease, box-shadow 0.3s ease; — on nav a add: transition: color 0.15s ease;"
  - "Put it on the base rule, not :hover. On the base rule it animates both directions; on :hover it would only animate the way in and snap back on the way out."
---
## From snap to glide

The starter is a gig page for Moth &amp; Lantern, and its hovers work —
hover the ticket button and it brightens, hover a nav link and it turns
gold. But every change lands in a single frame. *Snap.* Professional UIs
almost never do that; state changes **ease** from one value to the other.

That's one declaration:

```css
.cta {
  transition: background-color 0.3s ease;
}
```

Read it as: *whenever my `background-color` changes — for any reason —
spend 0.3 seconds getting there, easing in and out.* The `:hover` rule
still just states the destination. The transition, sitting on the base
rule, animates the trip.

Three decisions per transition:

- **Which property.** Name it. You'll see `transition: all` in the wild —
  resist it. `all` animates properties you never meant to move (tomorrow
  someone changes `padding` on hover and the whole layout oozes). List
  what changes: `transition: background-color 0.3s ease, box-shadow 0.3s ease;`
  covers two properties with one comma.
- **How long.** UI hovers live between 150 and 300ms. Slower reads as
  lag, not polish.
- **What easing.** `ease` (default-ish, gentle both ends), `ease-out`
  (fast start, soft landing — great for things appearing), `linear`
  (robotic; save it for spinners).

And the placement rule that trips everyone once: **base rule, not hover
rule.** Declared on `.cta:hover`, the transition only exists *while
hovering* — the glide in works, but the moment you leave, the hover rule
(and its transition) vanish and the button snaps back. Declared on
`.cta`, it's always in force, so both directions glide.

Hover the button after your change. In, out. Both directions should
breathe.

### Your goal

In `styles.css`, on the base rules:

1. `.cta` — add `transition: background-color 0.3s ease, box-shadow 0.3s ease;`
2. `nav a` — add `transition: color 0.15s ease;`

Leave both `:hover` rules exactly as they are — they're just the
destinations.
