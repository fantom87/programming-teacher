---
id: 02-queryselector
title: "Finding Elements: querySelector"
language: javascript
runner: browser
estMinutes: 15
files:
  - path: main.js
    starter: starter/main.js
goal: "Write matches(el, selector) understanding tag, #id, and .class selectors, then querySelector(root, selector) returning the first matching element in the tree — or null."
docs: [javascript/dom-basics, javascript/strings]
checks:
  - id: selector-functions
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-demo
    type: stdout
    entry: main.js
    match: exact
    value: "My Blog\nTuesday: broke it\nnull\n"
hints:
  - "selector[0] tells you which kind it is: \"#\" means id, \".\" means class, anything else is a tag name."
  - "selector.slice(1) drops the first character: \"#title\".slice(1) is \"title\". For classes, el.classes.includes(name) checks membership."
  - "querySelector: for (const el of allElements(root)) { if (matches(el, selector)) return el; } return null;"
---
## One string to find anything

In the real DOM you rarely walk the tree by hand. You *ask* for what you
want with a **selector** — the same little language CSS uses:

```js
document.querySelector("h1");        // first <h1> on the page
document.querySelector("#signup");   // the element with id="signup"
document.querySelector(".error");    // first element with class="error"
```

One function, three kinds of question: a bare word matches a **tag**, `#`
matches an **id**, and `.` matches a **class**. It returns the *first*
match — and if nothing matches, it returns `null`, which is why seasoned
developers check before using the result.

Today you build `querySelector` for our model page, and it works exactly
like the real one. Elements now carry two new properties: an `id` (a
string, usually empty) and `classes` (an array — a real element can wear
several classes at once).

The plan splits cleanly in two. First, `matches(el, selector)` decides
whether *one* element fits a selector. Peek at the first character:
`selector[0]` is `"#"`? Compare `el.id` against the rest of the string —
`selector.slice(1)` chops the marker off. A `"."`? Check `el.classes`
contains the rest. Anything else is a plain tag comparison.

Second, `querySelector(root, selector)` hunts through the whole tree. The
starter gives you `allElements(root)` — already written — which flattens
the tree into one array, top to bottom. Loop it, return the first element
that `matches`, and return `null` if the loop finds nothing.

### Your goal

1. Write `matches(el, selector)` handling `#id`, `.class`, and tag
   selectors — return `true` or `false`.
2. Write `querySelector(root, selector)` — the first matching element in
   `allElements(root)`, or `null`.
3. Print the `text` of `#title`, the `text` of `.draft`, and the result of
   searching for `"footer"` (which should be `null`).
