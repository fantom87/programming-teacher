---
id: 03-creating-and-changing-elements
title: Creating and Changing Elements
language: javascript
runner: browser
estMinutes: 15
files:
  - path: main.js
    starter: starter/main.js
goal: "Write setText to change an element's text, createElement to build fresh elements, and append to nest a child inside a parent — then use them to grow the article."
docs: [javascript/dom-basics, javascript/objects]
checks:
  - id: element-tools-work
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-demo
    type: stdout
    entry: main.js
    match: exact
    value: "2\nIt works.\n"
hints:
  - "setText is one line inside: el.text = text; — you're changing the object itself, so every variable pointing at it sees the change."
  - "createElement must build a NEW object each call: return { tag: tag, id: \"\", classes: [], text: text, children: [] };"
  - "append: parent.children.push(child); return child; — then use all three to change the heading and add the p."
---
## Pages that grow

Reading the tree is half the job. The DOM's real magic is that it's
*writable* — change the objects and the page changes on screen. Three moves
cover most of it in the real DOM:

```js
heading.textContent = "Fresh headline";   // change what an element says
const p = document.createElement("p");    // make a brand-new element
article.append(p);                        // nest it inside a parent
```

Notice what kind of operations these are: an assignment, a function that
returns an object, an array getting a new item. You've done all three —
just not to a page. Today you wrap each move in a small tool of your own.

**`setText(el, text)`** stores new text in the element. This is
*mutation*: you change the object itself, not a copy. If `heading` sits
inside `article.children`, changing `heading` changes what the article
contains — same object, seen from two places.

**`createElement(tag, text)`** returns a brand-new element object, with
empty `id`, `classes`, and `children`. The word *new* matters: every call
must build a fresh object. If two calls shared one object, editing your
second paragraph would silently edit the first — a classic bug the tests
will hunt for.

**`append(parent, child)`** pushes the child onto `parent.children` and
returns the child (the real `append` family behaves this way, which lets
you create, append, and keep a reference in one line).

Small functions, but this is the exact toolkit every dynamic page is built
from — later this unit you'll render whole lists with it.

### Your goal

1. Write `setText(el, text)` — put `text` into `el.text`.
2. Write `createElement(tag, text)` — return a **new** element object:
   `tag`, `id` `""`, empty `classes`, the given `text`, empty `children`.
3. Write `append(parent, child)` — add `child` to `parent.children`,
   return `child`.
4. Use them: change the starter heading's text to `"Fresh headline"`,
   create a `p` saying `"It works."`, append it to `article`, then print
   `article.children.length` and the new paragraph's `text`.
