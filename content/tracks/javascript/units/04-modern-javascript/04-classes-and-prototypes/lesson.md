---
id: 04-classes-and-prototypes
title: Classes and Prototypes
language: javascript
runner: browser
estMinutes: 20
files:
  - path: main.js
    starter: starter/main.js
goal: "Write Book and Audiobook — a class with constructor and method, a subclass built on super — then print the demo lines that expose the prototype chain underneath."
docs: [javascript/objects, javascript/syntax-cheatsheet]
checks:
  - id: classes-work
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-demo
    type: stdout
    entry: main.js
    match: exact
    value: "Dune (412 pages)\nWyrd Sisters (265 pages), read by Nadia Cole\ntrue\ntrue\n"
  - id: real-inheritance
    type: ai-judge
    rubric: "Book and Audiobook use class syntax: Book's constructor assigns this.title and this.pages, and describe is a normal prototype method (not an arrow function assigned per-instance in the constructor). Audiobook extends Book, its constructor calls super(title, pages) instead of reassigning those fields itself, and its describe override calls super.describe() and appends the narrator rather than rebuilding the base string. The demo's last two lines are the real instanceof and prototype-identity expressions — 'true' never appears as a hardcoded string."
hints:
  - "Book first: constructor(title, pages) { this.title = title; this.pages = pages; } — then describe() templates them from this."
  - "Audiobook's constructor takes (title, pages, narrator) and MUST call super(title, pages) before touching this — that's Book doing its own setup."
  - "The override is one line: return `${super.describe()}, read by ${this.narrator}`; — reuse the parent's work, don't retype it."
---
## Blueprints, and the chain behind them

You've built objects by hand and with factories. When a program needs
*many* objects of the same shape sharing the same behavior, JavaScript's
blueprint syntax is **`class`**:

```js
class Book {
  constructor(title, pages) {
    this.title = title;      // each instance's own data
    this.pages = pages;
  }
  describe() {               // shared behavior
    return `${this.title} (${this.pages} pages)`;
  }
}

const dune = new Book("Dune", 412);
```

`new` creates a fresh object and runs the constructor with `this` set to
it. Methods go right in the body — no commas, no `function` keyword.

One class can build on another with **`extends`** and **`super`**:

```js
class Audiobook extends Book {
  constructor(title, pages, narrator) {
    super(title, pages);          // let Book set up its part
    this.narrator = narrator;
  }
  describe() {
    return `${super.describe()}, read by ${this.narrator}`;
  }
}
```

`super(...)` in the constructor runs Book's constructor; `super.describe()`
inside a method reuses the parent's version. Overriding a method while
*borrowing* the original is the polite way to extend behavior — no
copy-paste, one source of truth.

So what *is* a class, under the hood? Prototypes. `describe` is not
copied into every book — it lives once, on `Book.prototype`, and each
instance holds a hidden *link* to that object. Call `dune.describe()`
and JavaScript looks on `dune`, finds nothing, and follows the link.
That lookup path is the **prototype chain**: an Audiobook links to
`Audiobook.prototype`, which links on to `Book.prototype`. `instanceof`
simply walks the chain, and two demo lines make all of it visible:

```js
console.log(wyrd instanceof Book);                       // the chain walk
console.log(dune.describe === Book.prototype.describe);  // ONE shared function
```

### Your goal

1. `class Book` — constructor stores `title` and `pages`; `describe()`
   returns `` `${title} (${pages} pages)` ``.
2. `class Audiobook extends Book` — constructor adds `narrator` via
   `super`; `describe()` returns the parent's line plus
   `` `, read by ${narrator}` ``.
3. Run the starter's four demo prints:

```
Dune (412 pages)
Wyrd Sisters (265 pages), read by Nadia Cole
true
true
```
