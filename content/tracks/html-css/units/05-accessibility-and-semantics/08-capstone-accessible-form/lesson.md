---
id: 08-capstone-accessible-form
title: "Capstone: Accessible Signup Page"
language: html-css
runner: browser
estMinutes: 35
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Build the Rootworks volunteer signup end to end: a landmark skeleton with a working skip link, a labeled nav, a three-fieldset form where every control has a real label, visible focus rings, and AA contrast throughout."
docs: [html-css/forms, html-css/accessibility-basics, html-css/semantic-html, html-css/selectors]
checks:
  - id: landmarks-and-skip-link
    type: dom
    assertions:
      - { selector: "body > a.skip-link:first-child", exists: true }
      - { selector: "a.skip-link", attr: "href", equals: "#main-content" }
      - { selector: "main", attr: "id", equals: "main-content" }
      - { selector: "main", count: 1 }
      - { selector: "h1", count: 1 }
      - { selector: "header nav", exists: true }
      - { selector: "footer", exists: true }
      - { selector: "[role]", count: 0 }
  - id: nav-aria
    type: dom
    assertions:
      - { selector: "nav", attr: "aria-label", equals: "Primary" }
      - { selector: "nav a", attr: "aria-current", equals: "page" }
  - id: form-sections
    type: dom
    assertions:
      - { selector: "form", count: 1 }
      - { selector: "form fieldset", count: 3 }
      - { selector: "form fieldset legend", count: 3 }
      - { selector: "form button", attr: "type", equals: "submit" }
  - id: labeled-controls
    type: dom
    assertions:
      - { selector: "label[for=volunteer-name]", exists: true }
      - { selector: "input#volunteer-name", exists: true }
      - { selector: "label[for=volunteer-email]", exists: true }
      - { selector: "input#volunteer-email", attr: "type", equals: "email" }
      - { selector: "fieldset input[type=radio]", count: 2 }
      - { selector: "fieldset input[type=checkbox]", count: 3 }
  - id: visible-focus
    type: dom
    assertions:
      - { selector: "a:focus-visible", cssRule: { property: "outline", equals: "3px solid darkorange" } }
      - { selector: "button:focus-visible", cssRule: { property: "outline", equals: "3px solid darkorange" } }
  - id: accessibility-audit
    type: ai-judge
    rubric: "A complete, accessible signup page with real copy about the garden (no lorem). (1) Semantics: native header/nav/main/footer landmarks with no role attributes duplicating them, and the single h1 tops a sane outline. (2) Form: all seven controls (name, email, two radios, three checkboxes) are each paired to their own label via for/id, the three legends genuinely name their groups, no placeholder stands in as a label, and the submit is a real button. (3) Keyboard: the skip link is absolutely positioned off-screen until a .skip-link:focus rule reveals it (never display: none), and no rule suppresses focus outlines without the visible :focus-visible replacement. (4) Contrast: every text/background pair the stylesheet creates — body text, nav links, legends, button text, and the revealed skip link — reads at WCAG AA (4.5:1 for body-size text). Styling is deliberate and consistent: a chosen palette applied in at least two places, not default-white everything."
hints:
  - "Work in unit order: skeleton and skip link first (lesson 5's pattern verbatim), then the form (lesson 4's), then focus rings and palette."
  - "The ids the checker looks for: volunteer-name and volunteer-email (type=email); the radio and checkbox ids are yours to choose, but every control gets its own label[for]."
  - "One grouped rule covers the rings: a:focus-visible, button:focus-visible, input:focus-visible { outline: 3px solid darkorange; }. Then check every text color against its background at 4.5:1 — DevTools or the WebAIM checker does the math."
---
## The accessibility audit, in reverse

Time to run this unit forward instead of fixing other people's pages.
Rootworks Community Garden needs a volunteer signup page, and you're
building it accessible from the first tag — the way it's actually
cheapest to do.

The anatomy, straight from the unit:

```
a.skip-link        → "#main-content"              (lesson 5)
header             → brand + nav[aria-label]      (lessons 1, 3)
main#main-content  → the only h1 + intro + form
  fieldset × 3     → legend + labeled controls    (lesson 4)
footer             → a sign-off line
```

Work in passes:

**Skeleton.** Skip link as `body`'s first element, then
`header`/`main`/`footer` landmarks — no `role` attributes anywhere,
because the elements *are* the roles. The nav gets
`aria-label="Primary"` and `aria-current="page"` on the Volunteer
link. One `h1`, real copy about the garden.

**Form.** Three fieldsets, each with a legend that names its group:
*About you* (`volunteer-name`, and `volunteer-email` with
`type="email"`), *Availability* (two radios — weekdays, weekends),
and *What interests you* (three checkboxes — your call; compost
wrangling is popular). Every control paired with its own
`label[for]`. Finish with `<button type="submit">`.

**Focus and palette.** The grouped focus rule from the hints —
`3px solid darkorange`, exactly. The `.skip-link` parks off-screen and
returns on `:focus`. Then choose a palette and *verify it*: every text
color at 4.5:1 or better against what it sits on, including button
text and the skip link when visible. Dark greens on paper-white have
been working well for gardens since before the web.

The deterministic checks read your structure; the AI reviewer audits
the rest — labels that mean something, contrast that passes, a skip
link that actually works. This is the Intermediate capstone: the page
a volunteer with a screen reader, a broken trackpad, or twilight
vision can use without asking for help.

### Your goal

1. Landmark skeleton with working skip link, labeled nav, one `h1`,
   and zero `role` attributes.
2. One form, three fieldsets with legends, seven labeled controls,
   real submit button.
3. Grouped `:focus-visible` rings, off-screen-until-focused skip link,
   and a palette that passes AA everywhere.
