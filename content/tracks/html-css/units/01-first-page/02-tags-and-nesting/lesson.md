---
id: 02-tags-and-nesting
title: Tags and Nesting
language: html-css
runner: browser
estMinutes: 10
files:
  - path: index.html
    starter: starter/index.html
goal: "Write a paragraph (p) that contains one bold word (strong) and one italic word (em), correctly nested inside the paragraph."
docs: [html-css/common-elements]
checks:
  - id: has-paragraph
    type: dom
    assertions:
      - { selector: "p", exists: true }
  - id: nested-emphasis
    type: dom
    assertions:
      - { selector: "p strong", exists: true }
      - { selector: "p em", exists: true }
hints:
  - "Tags go inside other tags: <p>a <strong>bold</strong> word</p>"
  - "<strong> marks important text (bold); <em> marks emphasized text (italic)."
  - "Close the inner tag before the outer one: <p><em>fine</em></p> — never <p><em>broken</p></em>."
---
## Tags inside tags

Last lesson you wrapped whole lines in tags. Here's the trick that makes HTML
powerful: tags can live **inside** other tags. Want one word in a paragraph to
be bold? Wrap just that word:

```html
<p>Never microwave <strong>metal</strong>.</p>
```

The `<strong>` element is *nested* inside the `<p>`. Two nesting elements you'll
use constantly:

- `<strong>` — important text (browsers show it **bold**)
- `<em>` — emphasized text (browsers show it *italic*)

There's one rule, and it's the same as stacking mixing bowls: whatever you put
in last comes out first. The tag you opened most recently must be the first one
you close:

```html
<p>This is <em>right</em>.</p>      ✅ em opens and closes inside p
<p>This is <em>wrong.</p></em>      ❌ tags overlap like tangled headphones
```

Browsers are forgiving and will *try* to display overlapping tags, which is
exactly why bugs like this hide for months. Get the habit right now and you'll
never think about it again.

### Your goal

The starter file has a bare sentence sitting outside any tag. Turn it into
proper HTML:

1. Wrap the sentence in a `<p>` paragraph.
2. Make one word bold with `<strong>`, nested inside the paragraph.
3. Make a different word italic with `<em>`, also nested inside.

Watch the preview: the moment your nesting is right, the words change style.
