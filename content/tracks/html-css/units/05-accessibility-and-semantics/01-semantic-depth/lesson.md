---
id: 01-semantic-depth
title: Beyond the Div
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Refactor the Gazette's div soup into semantic elements — header, main, article, figure with figcaption, aside, footer — keeping every class so the page looks identical."
docs: [html-css/semantic-html, html-css/common-elements]
checks:
  - id: landmarks
    type: dom
    assertions:
      - { selector: "header.masthead", exists: true }
      - { selector: "main.content", count: 1 }
      - { selector: "footer.bottom", exists: true }
  - id: article-and-aside
    type: dom
    assertions:
      - { selector: "article.story", exists: true }
      - { selector: "aside.sidebar", exists: true }
  - id: figure-with-caption
    type: dom
    assertions:
      - { selector: "figure.photo img", exists: true }
      - { selector: "figure.photo figcaption.caption", exists: true }
      - { selector: "p.caption", count: 0 }
  - id: no-divs-left
    type: dom
    assertions:
      - { selector: "div", count: 0 }
hints:
  - "Swap one wrapper at a time and keep the class: <div class=\"masthead\"> becomes <header class=\"masthead\">. The CSS targets classes, so nothing visual changes."
  - "The photo block: div.photo becomes figure.photo, and the caption paragraph becomes <figcaption class=\"caption\">."
  - "For the last two: could .story stand alone in a feed? That's an article. Is .sidebar related-but-separate? That's an aside. The checker wants zero divs left."
---
## What a div means

Nothing. That's not an insult — it's the definition. A `div` is a box with
no opinion: the browser renders it, but can't *say* anything about it.
And plenty of software wants your HTML to say things: screen readers,
reader modes, search engines, browser extensions. To all of them, a page
built from divs is a map with no labels.

You already use `header`, `main`, and `footer`. This unit goes deeper,
starting with the core move: **choosing elements by meaning**.

- `<article>` — a self-contained piece that would make sense on its own:
  a news story, a blog post, a review. The test: could it be syndicated
  in a feed and still make sense? Article.
- `<aside>` — related-but-separate: a sidebar, a pull quote, the "This
  Week" box sitting next to the main story.
- `<figure>` + `<figcaption>` — an image (or chart, or code sample) with
  its caption *attached*, so the pairing is explicit instead of "these
  two happen to be adjacent."

Why it matters concretely: screen-reader users jump between **landmarks**
— straight to `main`, past the `header`, over to the `aside` — the same
way you visually skim. Give them divs and every one of those shortcuts
goes dead.

The starter is a neighborhood newsletter built entirely from classed
divs. Your refactor rule: **the element replaces the div; the class
stays.** `<div class="story">` becomes `<article class="story">`, and
since the stylesheet targets `.story`, the page looks identical after
every swap. Semantic HTML costs zero visual budget — check the preview
after each change and watch nothing happen.

### Your goal

Refactor `index.html` until no `div` remains:

1. `.masthead` → `header`, `.content` → `main`, `.bottom` → `footer`.
2. The story becomes an `article`; the "This Week" box becomes an
   `aside`.
3. The photo block becomes a `figure`, and its caption paragraph a
   `figcaption` — both keeping their classes.
