---
id: 06-nesting-and-layers
title: Nesting and Layers
language: html-css
runner: browser
estMinutes: 20
files:
  - path: index.html
    starter: starter/index.html
  - path: styles.css
    starter: starter/styles.css
goal: "Reorganize the study-notes stylesheet the modern way: declare @layer base, components; wrap the page chrome in @layer base and the card in @layer components — with the card rewritten as ONE nested block using & .note-title, & .note-meta, and &:hover."
docs: [html-css/selectors]
checks:
  - id: card-is-nested
    type: dom
    assertions:
      - { selector: "& .note-title", cssRule: { property: "font-size", equals: "1.05rem" } }
      - { selector: "& .note-meta", cssRule: { property: "font-size", equals: "0.85rem" } }
      - { selector: "&:hover", cssRule: { property: "border-color", equals: "rgb(74, 111, 165)" } }
  - id: rules-survived-the-move
    type: dom
    assertions:
      - { selector: "body", cssRule: { property: "background-color", equals: "rgb(242, 239, 233)" } }
      - { selector: ".note-card", cssRule: { property: "background-color", equals: "rgb(255, 253, 247)" } }
  - id: layered-and-nested
    type: ai-judge
    rubric: "The stylesheet opens with the statement @layer base, components; naming the order. Two layer blocks follow: @layer base contains the page chrome (body, main, h1, .intro) and @layer components contains the card. The card is ONE nested .note-card block — its title, meta, and hover styles written inside it as & .note-title { }, & .note-meta { }, and &:hover { }, with no flat .note-card .note-title / .note-card .note-meta / .note-card:hover selectors left anywhere. Declarations were moved, not changed: same properties and values as the starter. Nesting stays one level deep — no nested rule contains further nested rules."
hints:
  - "Line one of the file: @layer base, components; — then two blocks: @layer base { ...body, main, h1, .intro... } and @layer components { ...the card... }."
  - "Nest by writing child rules inside the parent's braces, with & standing for the parent selector: .note-card { ...its own declarations...  & .note-title { ... }  & .note-meta { ... }  &:hover { ... } }"
  - "Write the & explicitly, with a space before descendant selectors: & .note-title means '.note-title inside .note-card', while &:hover (no space) means 'the .note-card itself, hovered'."
---
## Structure for stylesheets

Two modern features turn a pile of rules into an organized system —
they're both about *where rules live*.

**Nesting** lets a component's rules live inside it:

```css
.note-card {
  border: 1px solid #ddd6c7;

  & .note-title {
    font-size: 1.05rem;
  }
  &:hover {
    border-color: #4a6fa5;
  }
}
```

The `&` stands for the parent selector: `& .note-title` compiles to
`.note-card .note-title`, and `&:hover` — no space — to
`.note-card:hover`. What used to be four scattered rules starting with
`.note-card` becomes one block that reads like the component it styles.
Everything about the card, inside the card. The discipline: **nest one
level deep.** `&` is for a component's own parts and states, not for
mirroring your whole DOM tree — deep nesting recreates the specificity
wars you learned to avoid in Core.

**Layers** organize the other axis: *who wins conflicts*. Declare an
order, then file rules into named drawers:

```css
@layer base, components;

@layer base { /* page chrome */ }
@layer components { /* .note-card */ }
```

The statement on line one fixes priority: when layers conflict, **later
layers beat earlier ones — regardless of specificity.** A humble
`.note-card` rule in `components` outranks even a gnarly
high-specificity selector in `base`, because the drawer outranks the
rule. That's the point: instead of specificity arms races between your
reset, your components, and your utilities, you rank whole categories
once. (Unlayered styles outrank all layers — which is why a stray rule
left outside the drawers is now an organizational bug.)

The starter works fine; this refactor changes how it *reads*. You're
moving declarations, not editing them — when you're done the page
should look exactly the same, and the stylesheet should finally have a
floor plan.

### Your goal

In `styles.css`:

1. Open with `@layer base, components;`.
2. `@layer base { }` around the page chrome: `body`, `main`, `h1`,
   `.intro`.
3. `@layer components { }` holding the card as one nested block:
   `.note-card` with `& .note-title`, `& .note-meta`, and `&:hover`
   nested inside — the flat versions deleted.
