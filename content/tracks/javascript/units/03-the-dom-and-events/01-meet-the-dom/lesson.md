---
id: 01-meet-the-dom
title: Meet the DOM
language: javascript
runner: browser
estMinutes: 12
files:
  - path: main.js
    starter: starter/main.js
goal: "Model a page as objects: build a heading element, write describeElement to format one element, and childTags to list the tags of its children."
docs: [javascript/dom-basics, javascript/objects]
checks:
  - id: dom-model-functions
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-demo
    type: stdout
    entry: main.js
    match: exact
    value: "<h1> My Page\n[ 'h1', 'p', 'ul' ]\n"
hints:
  - "An element is just an object literal: const heading = { tag: \"h1\", text: \"My Page\", children: [] };"
  - "describeElement builds a string: \"<\" + el.tag + \"> \" + el.text — and returns it."
  - "childTags: return el.children.map((child) => child.tag); — map turns each child into its tag."
---
## The page is a tree

Every web page starts as HTML text — but the browser reads it once and turns
it into something far more useful: a live tree of objects called the **DOM**
(Document Object Model). Every tag becomes an object. JavaScript's superpower
in the browser is reaching into that tree and changing it; that's what makes
pages interactive. Real DOM code looks like this:

```js
const heading = document.querySelector("h1");
heading.textContent = "Hello!";   // the page changes instantly
```

Here's the good news: you already know everything the DOM is made of.
Elements are **objects**. Their children live in **arrays**. Finding things
is **looping**. This whole unit builds on skills you have.

Our editor runs JavaScript without a page attached (a live page preview for
this unit arrives in a future update), so we'll do what browser engineers do
when they test their own code: **model** the page with plain objects:

```js
{ tag: "p", text: "Hi there", children: [] }
```

`tag` says what kind of element it is, `text` is what it says, and
`children` holds the elements nested inside it. The starter file has a whole
page built this way — a `body` holding a heading, a paragraph, and a list
with items inside. Nesting objects inside arrays inside objects *is* the
tree. Everything you build against this model transfers one-to-one to the
real `document`.

### Your goal

1. Build an element object `heading` with `tag` `"h1"`, `text` `"My Page"`,
   and no children (an empty array).
2. Write `describeElement(el)` — return the string `<tag> text`, so the
   heading becomes `<h1> My Page`.
3. Write `childTags(el)` — return an array of the tags of `el.children`
   (`.map` is perfect here).
4. Print `describeElement(heading)`, then `childTags(page)` — the starter's
   `page` should give `h1`, `p`, `ul`.
