---
id: 08-rendering-performance
title: Rendering Performance
language: html-css
runner: browser
estMinutes: 18
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Move the arcade page's motion off the layout engine: the promo's hover lift becomes transform: translateY(-6px) with transition: transform 0.25s ease, the bobbing coin's keyframes switch from top to transform: translateY, and .coin gets will-change: transform."
docs: [html-css/transitions-and-animation]
checks:
  - id: hover-on-the-compositor
    type: dom
    assertions:
      - { selector: ".promo", cssRule: { property: "transition", equals: "transform 0.25s ease" } }
      - { selector: ".promo:hover", cssRule: { property: "transform", equals: "translateY(-6px)" } }
  - id: coin-flagged
    type: dom
    assertions:
      - { selector: ".coin", cssRule: { property: "will-change", equals: "transform" } }
  - id: nothing-animates-layout
    type: ai-judge
    rubric: "No transition or animation touches a layout property anymore: the .promo transition names transform (not margin-top, not all), .promo:hover sets transform: translateY(-6px) with the old margin-top override deleted from the hover rule, and every step of @keyframes bob uses transform: translateY(...) — from/to at translateY(0) and the midpoint at translateY(-10px) — with no top declarations left inside the keyframes. The .coin rule may keep position: absolute and its top/left for one-time placement (that's layout done once, not per frame). will-change: transform appears ONLY on .coin, the element that animates continuously — not on .promo or sprayed across the stylesheet. The motion itself is unchanged: same distances, same durations, same easing."
hints:
  - "Two edits on the promo: transition: transform 0.25s ease; replaces the margin-top transition on the base rule, and the hover rule trades its margin-top override for transform: translateY(-6px);."
  - "In @keyframes bob, swap each top for a transform: from { transform: translateY(0); } 50% { transform: translateY(-10px); } to { transform: translateY(0); } — the .coin rule's own top stays; placing an element once is fine, moving it every frame was the problem."
  - "will-change: transform goes on .coin only. It's a standing reservation on the GPU — worth it for something that animates every frame, waste for things that animate once on hover."
---
## Cheap pixels, expensive pixels

Every frame a browser draws goes through a pipeline: **layout**
(where does everything go), **paint** (what color is every pixel),
**composite** (stack the finished pieces). Animate a property from
early in the pipeline and every frame redoes everything downstream —
animate `margin-top` and the browser re-lays-out the page sixty times a
second. Animate from the *end* of the pipeline and the browser just
slides an already-painted picture around on the GPU.

Two properties live at that cheap end: **`transform`** and
**`opacity`**. This is why lesson 2 called transform "the tool for
motion" — here's the bill it avoids paying.

The starter's arcade page commits both classic sins. The promo card
"lifts" on hover by transitioning `margin-top` — a layout property, so
every frame of that 250ms re-runs layout for the whole page. And the
coin bobs via keyframes animating `top` — layout again, sixty times a
second, forever. On your machine it may look fine. On a phone with a
cold battery, this is the page that stutters. The fix is a straight
swap: same distances, same timing, but `transform: translateY()` does
the moving in both places. (Note what *doesn't* change: the coin keeps
`position: absolute` and its `top` for placement. Positioning an
element once is layout doing its job — re-positioning it every frame
was the sin.)

One more tool, used precisely: **`will-change: transform`** tells the
browser to keep an element on its own GPU layer *before* the animation
needs it. It's a reservation, and reservations cost memory — the rule
of thumb is: fine for the element that animates constantly (the coin),
wasteful for everything else (browsers already promote hover-lift cards
fast enough). A stylesheet with `will-change` on twelve elements is
slower than one with it nowhere.

When you're done, the page behaves identically — that's the point.
Performance work that changes behavior is called a bug.

### Your goal

In `styles.css`:

1. `.promo` — `transition: transform 0.25s ease;` (replacing the
   margin-top transition); `.promo:hover` — `transform: translateY(-6px);`
   with its margin-top override deleted.
2. `@keyframes bob` — every step to `transform: translateY(...)`
   (`0`, `-10px`, `0`); no `top` left inside the keyframes.
3. `.coin` — add `will-change: transform;`.
