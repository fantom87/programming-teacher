---
id: 05-audit-and-launch
title: "Capstone 5: Audit and Launch"
language: html-css
runner: browser
estMinutes: 40
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Run the launch audit: a skip link to #main-content, aria-label on the nav, var(--brass) focus rings, a card hover lift that prefers-reduced-motion switches off, and every earlier session's work still intact."
docs: [html-css/accessibility-basics, html-css/transitions-and-animation, html-css/selectors]
checks:
  - id: skip-path
    type: dom
    assertions:
      - { selector: "body > a.skip-link:first-child", exists: true }
      - { selector: "a.skip-link", attr: "href", equals: "#main-content" }
      - { selector: "main", attr: "id", equals: "main-content" }
      - { selector: ".skip-link", cssRule: { property: "position", equals: "absolute" } }
      - { selector: ".skip-link", cssRule: { property: "top", equals: "-3rem" } }
      - { selector: ".skip-link:focus", cssRule: { property: "top", equals: "0px" } }
  - id: nav-aria
    type: dom
    assertions:
      - { selector: "nav", attr: "aria-label", equals: "Primary" }
      - { selector: "[role]", count: 0 }
  - id: focus-ring
    type: dom
    assertions:
      - { selector: "a:focus-visible", cssRule: { property: "outline", equals: "3px solid var(--brass)" } }
      - { selector: "a:focus-visible", cssRule: { property: "outline-offset", equals: "2px" } }
  - id: motion-courtesy
    type: dom
    assertions:
      - { selector: ".film-card", cssRule: { property: "transition", equals: "none" } }
      - { selector: ".film-card:hover", cssRule: { property: "transform", equals: "none" } }
  - id: launch-audit
    type: ai-judge
    rubric: "The finished Harborlight site, audited like a handoff review. (1) Keyboard: the skip link is body's first child, parked off-screen by position absolute with a negative top (never display: none) and revealed by a .skip-link:focus rule, readable via curtain/marquee tokens; a:focus-visible rings use var(--brass) so they're visible on paper in both themes. (2) Motion: the base rules add a transform transition and a :hover translateY lift to .film-card, and the @media (prefers-reduced-motion: reduce) block — placed after them — neutralizes BOTH (transition and transform to none). (3) The four earlier passes survived intact: semantic landmarks with zero role attributes and one h1; the descriptive facade alt text; the mobile-first grid ladder (base single column, repeat(2, 1fr) at 40rem, repeat(4, 1fr) at 64rem); the five tokens with the dark block re-declaring only paper/ink/brass, and no raw colors outside :root blocks. (4) Copy is still real and coherent with the brief, the nav is labeled Primary, and nothing was broken to make a check pass. Judge it as: would you hand this to the Harborlight and put your name in the footer?"
hints:
  - "Skip link first in body: <a class=\"skip-link\" href=\"#main-content\">Skip to main content</a> with main gaining id=\"main-content\". CSS: .skip-link { position: absolute; top: -3rem; left: 0; background-color: var(--curtain); color: var(--marquee); padding: 0.5rem 1rem; } and .skip-link:focus { top: 0; }."
  - "Rings and label: a:focus-visible { outline: 3px solid var(--brass); outline-offset: 2px; } and <nav aria-label=\"Primary\"> — still zero role attributes anywhere."
  - "Motion pair, then the off-switch after it: .film-card { transition: transform 160ms ease; } and .film-card:hover { transform: translateY(-4px); }, followed by @media (prefers-reduced-motion: reduce) { .film-card { transition: none; } .film-card:hover { transform: none; } }."
---
## Audit and launch

Last session. Nothing new to design — this is the pass where a
professional walks the whole site as three different visitors and
fixes what each one hits. Then it ships.

**The keyboard visitor.** Tab from the top. The first stop should be
a skip link — first child of `body`, pointing at `#main-content`,
absolutely positioned off-screen until `:focus` slides it in. Never
`display: none`; that removes it from the tab order and defeats the
point. Style it in curtain and marquee so it looks like part of the
building. Then give every link a visible ring:

```css
a:focus-visible {
  outline: 3px solid var(--brass);
  outline-offset: 2px;
}
```

Brass rides the theme — the ring stays visible on paper whether the
visitor is in matinee light or after-dark mode. That's your token
system paying rent again.

**The screen-reader visitor.** Landmarks are in place from session 2;
what's missing is a name for the nav: `aria-label="Primary"`. Still
zero `role` attributes — the elements are the roles. Check the `h1` →
`h2` → `h3` outline and the facade alt text one last time; they're
part of the audit, not past it.

**The motion-sensitive visitor.** First, earn the courtesy: give the
film cards a little life — `transition: transform 160ms ease` and a
`:hover` lift of `translateY(-4px)`. Then switch it off for people
whose vestibular systems disagree, in a block placed after the base
rules:

```css
@media (prefers-reduced-motion: reduce) {
  .film-card { transition: none; }
  .film-card:hover { transform: none; }
}
```

The deterministic checks read the audit's mechanics; the AI reviewer
walks the entire site — all five sessions of it — and asks the only
question that matters at handoff: would you put your name in the
footer?

### Your goal

1. Skip link (body's first child, off-screen until focused) into
   `main#main-content`; nav labeled `Primary`; zero `role` attributes.
2. `var(--brass)` focus-visible rings with a `2px` offset on links.
3. Card hover lift with a transition, both neutralized inside
   `prefers-reduced-motion: reduce` — and every earlier check still
   green.
