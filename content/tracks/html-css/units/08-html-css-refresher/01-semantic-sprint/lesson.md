---
id: 01-semantic-sprint
title: Semantic Sprint
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Re-tag The Beacon at speed: header, a nav with a real list, main, articles with time stamps, figure, aside, footer, the Subscribe link demoted to a real button — and zero divs left standing."
docs: [html-css/semantic-html, html-css/lists-and-tables, html-css/common-elements]
checks:
  - id: landmarks
    type: dom
    assertions:
      - { selector: "header.masthead", count: 1 }
      - { selector: "main.content", count: 1 }
      - { selector: "footer.bottom", count: 1 }
  - id: nav-is-a-list
    type: dom
    assertions:
      - { selector: "header nav.nav", exists: true }
      - { selector: "nav ul li a", count: 4 }
  - id: articles-with-machine-dates
    type: dom
    assertions:
      - { selector: "article.post", count: 2 }
      - { selector: "article.post time.stamp", count: 2 }
      - { selector: "article time", attr: "datetime", equals: "2026-03-04" }
      - { selector: "article time", attr: "datetime", equals: "2026-03-11" }
  - id: figure-and-aside
    type: dom
    assertions:
      - { selector: "article figure.photo img", exists: true }
      - { selector: "figure.photo figcaption.caption", exists: true }
      - { selector: "aside.events", exists: true }
  - id: button-not-link
    type: dom
    assertions:
      - { selector: "button.subscribe", attr: "type", equals: "button" }
      - { selector: "a.subscribe", count: 0 }
  - id: no-divs
    type: dom
    assertions:
      - { selector: "div", count: 0 }
hints:
  - "Element replaces div, class stays: <div class=\"masthead\"> becomes <header class=\"masthead\">. The CSS targets classes, so the page shouldn't flinch."
  - "The nav is a rebuild, not a rename: <nav class=\"nav\"><ul><li><a href=\"#\">Home</a></li>…</ul></nav> — the starter CSS already styles the list you're about to build."
  - "time carries both dates: <time class=\"stamp\" datetime=\"2026-03-04\">March 4, 2026</time>. And Subscribe triggers an action, so it's <button class=\"subscribe\" type=\"button\">."
---
## Div soup, one-pot recall

You have seen this page a hundred times: The Beacon, a harbor bulletin,
renders beautifully and means nothing. Ten divs, a link cosplaying as a
button, dates trapped in prose. Screen readers get a map with no labels;
reader mode shrugs.

Refresher rule one: **the element replaces the div; the class stays.**
The stylesheet targets classes, so the page must look identical after
every swap. If something shifts, you grabbed the wrong element.

Rapid recall, top to bottom:

- **Landmarks** — `.masthead` → `header`, `.content` → `main`,
  `.bottom` → `footer`.
- **Navigation is a list** — wrap the four links in
  `nav > ul > li > a`. Four links, four list items.
- **Posts are articles**, and each `.stamp` div becomes a `time`:
  human date as text, machine date in `datetime` — ISO `2026-03-04`
  and `2026-03-11`.
- **The photo** pairs with its caption explicitly: `figure` +
  `figcaption`, classes intact.
- **"This month"** is related-but-separate: `aside`.
- **Subscribe performs an action**, so the anchor goes and
  `<button type="button">` arrives. Links go places; buttons do
  things.

Fifteen minutes. The checker counts divs at the end and expects zero.

### Your goal

1. Landmarks in place: `header.masthead`, `main.content`,
   `footer.bottom`.
2. A real `nav` list with four links; two `article.post`s whose stamps
   are `time.stamp` elements with ISO `datetime`s.
3. `figure`/`figcaption` for the photo, `aside` for events,
   `button.subscribe` for the action — and a final `div` count of
   zero.
