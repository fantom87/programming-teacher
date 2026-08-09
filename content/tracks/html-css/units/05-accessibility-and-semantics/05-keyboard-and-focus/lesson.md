---
id: 05-keyboard-and-focus
title: Keyboard Navigation and Focus
language: html-css
runner: browser
estMinutes: 18
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Give keyboard users a way in: a skip link that jumps to main#main-content and appears on focus, a 3px solid darkorange focus-visible ring on links, and the outline: none rule gone for good."
docs: [html-css/accessibility-basics, html-css/selectors]
checks:
  - id: skip-link
    type: dom
    assertions:
      - { selector: "body > a.skip-link:first-child", exists: true }
      - { selector: "a.skip-link", attr: "href", equals: "#main-content" }
      - { selector: "main", attr: "id", equals: "main-content" }
  - id: visible-focus-ring
    type: dom
    assertions:
      - { selector: "a:focus-visible", cssRule: { property: "outline", equals: "3px solid darkorange" } }
  - id: focus-never-lost
    type: ai-judge
    rubric: "The a { outline: none; } rule is gone (or replaced by an equally visible focus treatment), leaving links with an obvious high-contrast focus indicator via the a:focus-visible rule. The skip link follows the classic pattern: absolutely positioned off-screen by default (a negative top or equivalent), pulled into view by a .skip-link:focus rule, and styled with enough background and color contrast to be readable when it appears — not hidden with display: none, which would remove it from the tab order entirely."
hints:
  - "First, delete a { outline: none; }. Then add a:focus-visible { outline: 3px solid darkorange; } — typed exactly; it's the rule the checker looks for."
  - "The skip link is the FIRST thing inside body: <a class=\"skip-link\" href=\"#main-content\">Skip to main content</a> — and main needs id=\"main-content\" to catch it."
  - "Hide it without killing it: .skip-link { position: absolute; top: -3rem; } then .skip-link:focus { top: 0; }. display: none would remove it from the tab order, which defeats the point."
---
## The invisible cursor

Put your mouse out of reach and press Tab. Each press moves **focus** to
the next link or control, and the ring drawn around it is the keyboard
user's cursor. Plenty of people browse this way every day — powered by
habit, injury, or a screen reader.

Now look at the starter stylesheet for the Museum of Tiny Things:

```css
a {
  outline: none;
}
```

The previous designer found the ring "visually noisy." This deletes the
cursor. Tab through the preview: focus still moves, but you cannot see
where it is. It's the single most common accessibility bug on the web,
and the fix is a strict upgrade:

```css
a:focus-visible {
  outline: 3px solid darkorange;
}
```

`:focus` matches whenever an element has focus — including after a
mouse click, which is what made designers reach for `outline: none` in
the first place. **`:focus-visible`** matches only when the browser
knows the user is navigating by keyboard. Mouse users see nothing;
keyboard users get a ring you could spot from across the room. The
"ugly ring" argument dissolves.

One more gift: this page's nav has eight links, and a keyboard user
must tab through all of them on *every page* before reaching the
content. The classic cure is a **skip link** — the first tabbable thing
on the page, pointing at `#main-content`:

```css
.skip-link {
  position: absolute;
  top: -3rem;
}
.skip-link:focus {
  top: 0;
}
```

Parked above the viewport, it's invisible until the first Tab lands on
it — then it slides into view offering one keystroke past the whole
nav. Sighted keyboard users love it; screen-reader users expect it.

### Your goal

1. Delete `a { outline: none; }` and add the `a:focus-visible` ring —
   `3px solid darkorange`, typed exactly.
2. Add the skip link as `body`'s first element, `href="#main-content"`,
   and give `main` the matching `id`.
3. Style `.skip-link` off-screen until `.skip-link:focus` reveals it —
   with a readable background. Then Tab through the preview and enjoy.
