---
id: 02-position
title: Position
language: html-css
runner: browser
estMinutes: 14
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Add a New badge span inside the featured card, then pin it to the card's top-right corner: position: relative on .card, position: absolute plus top and right offsets on .badge."
docs: [html-css/selectors, html-css/box-model]
checks:
  - id: badge-exists
    type: dom
    assertions:
      - { selector: ".card .badge", exists: true }
      - { selector: ".badge", textContains: "New" }
  - id: badge-pinned
    type: ai-judge
    rubric: "styles.css sets position: relative on .card and position: absolute on .badge, and gives .badge top and right offsets (small values like 12px) so it sits in the card's top-right corner. The relative rule must be on the card (or an equivalent card wrapper) — absolute positioning against the page, or offsets without position: absolute, does not meet the goal."
hints:
  - "First the HTML: <span class=\"badge\">New</span> goes just inside the featured .card div."
  - "position: absolute; lifts the badge out of flow — but it needs an anchor, or it measures from the page."
  - "Anchor with .card { position: relative; } then pin: .badge { position: absolute; top: 12px; right: 12px; }"
---
## Breaking out of flow

Normal flow is a queue: every box waits its turn, stacks politely. The
`position` property lets a box leave the queue.

The two values you'll use constantly work as a **pair**:

```css
.card {
  position: relative;   /* "measure positions from me" */
}
.badge {
  position: absolute;   /* leave flow entirely */
  top: 12px;            /* then pin: 12px from the top... */
  right: 12px;          /* ...12px from the right */
}
```

`position: absolute` pulls the badge out of flow — the other content closes
up as if it never existed — and pins it using offsets like `top` and
`right`. Pins measured from *what*, though? From the **nearest ancestor
with a position value**. That's the whole job of `position: relative` on
the card: it barely changes the card itself, but it plants a flag that
says "absolute descendants, measure from me." Forget the flag and the
badge pins itself to the page instead, which looks fine right up until
the page scrolls or the card moves.

This parent-relative, child-absolute pair is how corner badges, close
buttons, tooltips, and image captions have been built for twenty years.

Try it on the featured card in the preview. First add the badge to the
HTML and watch it land awkwardly *in* the text — it's still in flow.
Then position it and watch it snap to the corner.

### Your goal

1. In `index.html`, add `<span class="badge">New</span>` at the top of the
   featured card's div (the badge look is already styled for you).
2. In `styles.css`, give `.card` the declaration `position: relative;`.
3. Give `.badge` `position: absolute;` with `top: 12px;` and `right: 12px;`.
