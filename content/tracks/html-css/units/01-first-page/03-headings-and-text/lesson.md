---
id: 03-headings-and-text
title: Headings and Text
language: html-css
runner: browser
estMinutes: 12
files:
  - path: index.html
    starter: starter/index.html
goal: "Build a page with exactly one h1, two h2 section headings, a ul list with exactly three li items, and at least one strong and one em somewhere in the text."
docs: [html-css/common-elements, html-css/lists-and-tables]
checks:
  - id: heading-levels
    type: dom
    assertions:
      - { selector: "h1", count: 1 }
      - { selector: "h2", count: 2 }
  - id: has-list
    type: dom
    assertions:
      - { selector: "ul", exists: true }
      - { selector: "ul li", count: 3 }
  - id: uses-emphasis
    type: dom
    assertions:
      - { selector: "strong", exists: true }
      - { selector: "em", exists: true }
hints:
  - "Heading levels are h1 through h6 — h1 is the page title, h2 starts a section."
  - "A list is a ul wrapping li items: <ul><li>one</li><li>two</li></ul>"
  - "Each li needs its own opening and closing tag, all inside the ul."
---
## Giving a page a shape

Real pages aren't one heading and one paragraph — they have an outline, like a
book has chapters. HTML gives you six heading levels, `<h1>` down to `<h6>`,
and the rule is about *meaning*, not size: **one `<h1>`** names the whole page,
and each `<h2>` starts a new section inside it. Think newspaper: one masthead,
many section headers.

The other structure you'll use daily is the list. An *unordered list* is a
`<ul>` wrapping one `<li>` (list item) per bullet:

```html
<h2>Groceries</h2>
<ul>
  <li>Garlic</li>
  <li>More garlic</li>
</ul>
```

Notice the nesting from last lesson doing real work: the `<li>` tags live
inside the `<ul>`, and the indentation makes the structure obvious at a glance.
Browsers don't care about indentation — but the future you reading this file
absolutely will.

### Your goal

Build a small page about something you like — a hobby, a game, a food. It
needs:

1. Exactly **one** `<h1>` naming the page.
2. **Two** `<h2>` section headings, each followed by a `<p>` of text.
3. A `<ul>` with exactly **three** `<li>` items.
4. Somewhere in your paragraphs, one `<strong>` word and one `<em>` word.

Skim the preview when you're done — you should see the outline instantly.
