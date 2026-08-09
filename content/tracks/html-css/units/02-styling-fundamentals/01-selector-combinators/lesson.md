---
id: 01-selector-combinators
title: Combining Selectors
language: html-css
runner: browser
estMinutes: 12
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Write three combined selectors: a grouped h1, h2 rule (color darkslateblue), a descendant .card p rule (color dimgray), and a child main > p rule (font-style italic)."
docs: [html-css/selectors]
checks:
  - id: grouped-headings
    type: dom
    assertions:
      - { selector: "h1", cssRule: { property: "color", equals: "darkslateblue" } }
      - { selector: "h2", cssRule: { property: "color", equals: "darkslateblue" } }
  - id: descendant-card-text
    type: dom
    assertions:
      - { selector: ".card p", cssRule: { property: "color", equals: "dimgray" } }
  - id: child-intro
    type: dom
    assertions:
      - { selector: "main > p", cssRule: { property: "font-style", equals: "italic" } }
hints:
  - "Group selectors with a comma: h1, h2 { ... } styles both at once."
  - "A space means 'anywhere inside': .card p matches every p within a .card."
  - "Type the child selector exactly as main > p (spaces around the >) — that's the form the checker looks for."
---
## Selectors that team up

So far you've selected by tag (`p`) and by class (`.card`). Real stylesheets
get their power from *combining* those pieces, and three combinations do most
of the work.

**Grouping** — a comma applies one rule to several selectors:

```css
h1, h2 {
  color: darkslateblue;
}
```

One rule, both heading levels. No copy-paste.

**Descendant** — a space means "anywhere inside":

```css
.card p {
  color: dimgray;
}
```

Read it right-to-left: paragraphs, but only ones living inside something with
the class `card`. Paragraphs elsewhere are untouched. This is how you style a
*region* of the page without classing every element in it.

**Child** — a `>` means "directly inside, one level down":

```css
main > p {
  font-style: italic;
}
```

That matches a `p` sitting immediately inside `main` — but *not* a `p` buried
deeper, say inside a card that's inside `main`. The space is greedy; the `>`
is strict.

The starter page is a tide-pool field guide: an intro paragraph directly in
`main`, then two `.card` write-ups with paragraphs of their own. Perfect
terrain for telling "inside" apart from "directly inside."

### Your goal

In `styles.css`, write three rules:

1. A grouped rule `h1, h2` with `color: darkslateblue;`
2. A descendant rule `.card p` with `color: dimgray;`
3. A child rule `main > p` with `font-style: italic;` — type it with spaces,
   `main > p`, so the checker finds it.

When it works, the intro line turns italic while the card paragraphs stay
upright — proof the `>` really is stricter than the space.
