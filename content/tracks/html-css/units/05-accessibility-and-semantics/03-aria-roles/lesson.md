---
id: 03-aria-roles
title: ARIA, and When Not to Use It
language: html-css
runner: browser
estMinutes: 15
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Replace fake ARIA — two role=\"navigation\" divs and a role=\"button\" span — with native nav and button elements, then add the ARIA that earns its place: aria-label on each nav and aria-current=\"page\" on the active link."
docs: [html-css/accessibility-basics, html-css/semantic-html]
checks:
  - id: native-elements
    type: dom
    assertions:
      - { selector: "nav.site-nav", exists: true }
      - { selector: "nav.footer-nav", exists: true }
      - { selector: "button.order-btn", exists: true }
      - { selector: "[role]", count: 0 }
      - { selector: "[tabindex]", count: 0 }
  - id: navs-labeled
    type: dom
    assertions:
      - { selector: "nav.site-nav", attr: "aria-label", equals: "Primary" }
      - { selector: "nav.footer-nav", attr: "aria-label", equals: "Footer" }
  - id: current-page-marked
    type: dom
    assertions:
      - { selector: "nav.site-nav a", attr: "aria-current", equals: "page" }
hints:
  - "div role=\"navigation\" → <nav> (keep the class). The role comes built in — that's the whole point of the element."
  - "The span becomes <button class=\"order-btn\" type=\"button\">Order pickup</button> — and delete the tabindex; real buttons are keyboard-reachable on their own."
  - "Two navs sound identical in a landmark list, so name them: aria-label=\"Primary\" and aria-label=\"Footer\". Then aria-current=\"page\" goes on the Home link."
---
## The first rule of ARIA

ARIA attributes let you *claim* things about your markup:
`role="button"` tells assistive tech "this is a button." Which sounds
useful until you notice what it doesn't do. A `<span role="button">` is
**announced** as a button but **behaves** like a span: Enter and Space
do nothing, and the author has to bolt on `tabindex`, key handlers, and
focus styling by hand — forever.

Hence the famous first rule of ARIA: **don't use ARIA** when a native
element already does the job. `<button>` ships with keyboard activation,
focusability, and the right announcement, for free, tested by every
browser vendor. `<nav>` *is* `role="navigation"`. The role attribute on
a real `nav` is just noise — and the fake button is worse than noise,
because it looks done while being broken.

So when *does* ARIA earn its place? When it adds information HTML can't
express. Today, two honest cases:

- **Naming twins.** This page has two navigation landmarks — site nav
  and footer nav. In a screen reader's landmark list they'd both
  announce as "navigation," indistinguishable. `aria-label="Primary"`
  and `aria-label="Footer"` give each a name.
- **State.** Which nav link is the page you're *on*?
  `aria-current="page"` says so — screen readers announce it, and CSS
  can style it with the selector `a[aria-current="page"]`.

The starter is a coffee shop header assembled from a tutorial gone
wrong: two `role="navigation"` divs and a `role="button"` span with a
`tabindex` doing its best. Your job is a downgrade in attribute count
and an upgrade in everything else.

### Your goal

1. Both `role="navigation"` divs become real `<nav>` elements — classes
   stay, `role` and `tabindex` attributes all disappear.
2. The order span becomes
   `<button class="order-btn" type="button">Order pickup</button>`.
3. Add the ARIA that earns it: `aria-label="Primary"` on the site nav,
   `aria-label="Footer"` on the footer nav, and `aria-current="page"`
   on the Home link.
