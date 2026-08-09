---
id: 08-overflow
title: Overflow
language: html-css
runner: browser
estMinutes: 12
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Tame two overflowing boxes: give .chat-log overflow-y: auto so it scrolls inside its 240px height, and give .sticker-strip overflow: hidden so it crops cleanly."
docs: [html-css/box-model]
checks:
  - id: chat-scrolls
    type: dom
    assertions:
      - { selector: ".chat-log", cssRule: { property: "overflow-y", equals: "auto" } }
  - id: strip-crops
    type: dom
    assertions:
      - { selector: ".sticker-strip", cssRule: { property: "overflow", equals: "hidden" } }
hints:
  - "Both fixes go on the boxes with the fixed sizes: .chat-log and .sticker-strip."
  - "overflow-y: auto; on .chat-log — a scrollbar appears only because the content actually overflows."
  - "overflow: hidden; on .sticker-strip simply crops everything past the box's edge — no scrollbar, no spill."
---
## When content doesn't fit

Here's a CSS fact that surprises everyone once: giving a box a fixed size
does **not** make its content respect it. Content that's too big simply
keeps going — right past the border, over whatever is nearby. The
default, `overflow: visible`, is the browser refusing to hide your
content without permission.

Open the preview: the chat panel has a fixed `height: 240px`, and the
conversation just... exits through the bottom border and floats over the
page. The sticker strip below has the same disease sideways.

The `overflow` property is the permission slip. Four values matter:

- `visible` — the default spill you're looking at.
- `hidden` — clip at the border. Clean, but anything past the edge is
  simply gone.
- `scroll` — clip, and always show scrollbars, even when nothing
  overflows.
- `auto` — clip, and show a scrollbar **only when needed**. This is the
  one you'll reach for 95% of the time.

You can also aim per axis: `overflow-y` controls vertical, `overflow-x`
horizontal. A chat log should scroll vertically only, so:

```css
.chat-log {
  overflow-y: auto;
}
```

The messages stay inside the panel, and a scrollbar appears — scroll it,
it's a real little window now. That's exactly how chat apps, code blocks,
and dropdown menus keep long content inside a fixed frame.

The sticker strip wants the other tool. It's decorative — cropping is the
*point*, and a scrollbar would be clutter. `overflow: hidden` crops both
axes and asks no questions.

### Your goal

In `styles.css`:

1. Give `.chat-log` the declaration `overflow-y: auto;` — the spill
   becomes a scrollable panel.
2. Give `.sticker-strip` the declaration `overflow: hidden;` — the strip
   crops neatly at its rounded edges.
