---
id: 01-normal-flow
title: Normal Flow
language: html-css
runner: browser
estMinutes: 12
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Show how normal flow treats block boxes: give .note a width of 260px and a margin-bottom of 16px, then flip .note to display: inline-block so the notes sit in a row."
docs: [html-css/box-model, html-css/common-elements]
checks:
  - id: note-width
    type: dom
    assertions:
      - { selector: ".note", cssRule: { property: "width", equals: "260px" } }
  - id: note-spacing
    type: dom
    assertions:
      - { selector: ".note", cssRule: { property: "margin-bottom", equals: "16px" } }
  - id: notes-in-a-row
    type: ai-judge
    rubric: "styles.css gives .note the declaration display: inline-block (alongside the width and margin rules), which makes the note boxes sit side by side and wrap like words instead of each taking its own row. Any equivalent inline-block rule on .note counts; setting display on a different selector, or leaving the notes as blocks, does not."
hints:
  - "Add the declarations to the .note rule that's already in styles.css."
  - "After width: 260px; the notes get narrow — but each still hogs its own row. That's block behavior."
  - "display: inline-block; makes a box flow like a word while keeping its width and padding. Add it to .note last and watch the row form."
---
## The layout you already have

Before flexbox and grid, there's the layout browsers do on their own:
**normal flow**. Every element is a box, and flow gives each box one of two
jobs.

**Block boxes** — `div`, `p`, headings — stack top to bottom, and each one
owns its entire row. **Inline boxes** — `span`, `a`, `strong` — flow along
the line of text like words, wrapping when they run out of room.

Open the preview: the sticky notes stack because `div` is a block. Here's
the part that surprises people — a block owns its row *even when it's
narrow*. You're about to prove it:

```css
.note {
  width: 260px;
}
```

The notes shrink, but they still refuse to share a row. The leftover space
to the right just sits there, reserved. That's not a bug; that's the block
contract.

There's a third display value that blends the two: `inline-block`. The box
keeps its width, padding, and margins like a block, but flows along the
line like a word:

```css
.note {
  display: inline-block;
}
```

Suddenly the notes line up side by side — and if you squeeze the preview
narrower, they wrap to the next line exactly like text does. Every layout
tool you'll meet in this unit works by changing how elements participate in
flow. Knowing the default is what makes the overrides make sense.

### Your goal

In the `.note` rule in `styles.css`:

1. Add `width: 260px;` — watch the notes shrink but keep stacking.
2. Add `margin-bottom: 16px;` to space them out.
3. Add `display: inline-block;` — watch the stack become a row that wraps.
