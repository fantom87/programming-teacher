---
id: 02-transforms
title: Transforms
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Scatter the darkroom wall with transform: .tilt-left gets rotate(-3deg), .tilt-right gets rotate(2deg), and .polaroid:hover gets translateY(-10px) rotate(0deg) so a print lifts and straightens as you reach for it."
docs: [html-css/transitions-and-animation]
checks:
  - id: prints-tilt
    type: dom
    assertions:
      - { selector: ".tilt-left", cssRule: { property: "transform", equals: "rotate(-3deg)" } }
      - { selector: ".tilt-right", cssRule: { property: "transform", equals: "rotate(2deg)" } }
  - id: hover-lifts
    type: dom
    assertions:
      - { selector: ".polaroid:hover", cssRule: { property: "transform", equals: "translateY(-10px) rotate(0deg)" } }
  - id: transform-not-layout
    type: ai-judge
    rubric: "All motion is done with transform: the tilts via rotate() on .tilt-left/.tilt-right and the hover lift via translateY(-10px) rotate(0deg) on .polaroid:hover — no margin, top, left, or position changes are used to move anything. The hover rule composes both functions in one transform declaration (not two separate transform lines, which would overwrite each other). The starter's transition: transform 0.2s ease on .polaroid is still in place so the lift glides. Visually the wall reads as casually scattered prints that straighten and rise on hover."
hints:
  - "One transform declaration per rule: .tilt-left { transform: rotate(-3deg); } and .tilt-right { transform: rotate(2deg); }"
  - "Compose functions by listing them in one value, space-separated: transform: translateY(-10px) rotate(0deg); — two transform declarations in the same rule would just overwrite each other."
  - "Why rotate(0deg) in the hover rule? A hover transform REPLACES the base one — leave it out and the tilt doesn't just stay, it vanishes without animating. Stating 0deg makes the straightening explicit and smooth."
---
## Moving things without moving the layout

`transform` repositions, rotates, and scales an element *visually* —
after layout is finished. The element still occupies its original slot;
its neighbors don't shift; nothing reflows. That's what makes transforms
the tool for motion: change `margin-top` and the whole page renegotiates;
change `transform` and only pixels move.

The functions you'll use constantly:

```css
transform: translateY(-10px);   /* slide up, slot unchanged */
transform: scale(1.05);         /* grow from the center */
transform: rotate(-3deg);       /* tilt */
```

And the one grammar rule that matters: **`transform` is a single
property.** To combine effects, list functions in one value —

```css
transform: translateY(-10px) rotate(0deg);
```

— because a second `transform` declaration doesn't add, it *replaces*.
That's true across rules too: when a `:hover` rule sets `transform`, the
base rule's transform is gone for the duration, not merged.

The starter is a darkroom wall: three polaroid prints in a row, all
sitting bolt upright like a spreadsheet. Real prints get pinned up
crooked. The HTML already tags them `.tilt-left` and `.tilt-right`; you
supply the rotations. Then the payoff move — on hover, a print lifts
toward you and straightens, like picking it off the wall. `.polaroid`
already carries `transition: transform 0.2s ease` from last lesson, so
your hover transform will glide for free.

Note what `translateY(-10px) rotate(0deg)` is doing in that hover rule.
The lift is the translate. The *straightening* is `rotate(0deg)` —
because the hover transform replaces the tilt, you say explicitly "and
rotation goes to zero," and the transition animates the un-tilting too.
Delete the `rotate(0deg)` and watch what changes; putting it back will
feel like understanding.

### Your goal

In `styles.css`:

1. `.tilt-left { transform: rotate(-3deg); }`
2. `.tilt-right { transform: rotate(2deg); }`
3. `.polaroid:hover { transform: translateY(-10px) rotate(0deg); }`
