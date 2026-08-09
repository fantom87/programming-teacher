---
id: 06-object-methods-and-this
title: Object Methods and this
language: javascript
runner: browser
estMinutes: 15
files:
  - path: main.js
    starter: starter/main.js
goal: "Build a hero object with describe() and addPoints(points) methods that use this — award 50 points in two calls, then print the description."
docs: [javascript/objects, javascript/functions-and-closures]
checks:
  - id: methods-work
    type: tests
    entry: main.js
    testFile: tests/test_main.js
  - id: prints-description
    type: stdout
    entry: main.js
    match: exact
    value: "Ada has 50 points\n"
hints:
  - "Method shorthand goes right in the braces: describe() { return `${this.name} has ${this.score} points`; } — comma after it like any other entry."
  - "addPoints changes the object through this: this.score = this.score + points;"
  - "Use the function shorthand shown in the lesson, NOT an arrow — arrows don't get their own this."
---
## Objects that can act

Your objects so far have been filing cabinets — data in, data out. But an
object can also carry **functions** that work on its own data. A function
stored on an object is called a **method**, and you've been calling them
all along: `colors.push(...)`, `word.toUpperCase()`. Time to write your
own.

```js
const dog = {
  name: "Biscuit",
  tricks: 3,
  brag() {
    return `${this.name} knows ${this.tricks} tricks!`;
  },
};

console.log(dog.brag());   // Biscuit knows 3 tricks!
```

That `brag() { ... }` is **method shorthand** — a function living right
inside the object, written without the `function` keyword.

The star of the show is **`this`**. Inside a method, `this` means *the
object the method was called on*. When you call `dog.brag()`, `this` is
`dog`, so `this.name` is `"Biscuit"`. The method doesn't need the
variable name `dog` at all — which means the object could be renamed,
passed to a function, or sit in an array, and the method still finds its
own data.

Methods can *change* the object too:

```js
learnTrick() {
  this.tricks = this.tricks + 1;
},
```

One warning worth carrying forward: **don't use arrow functions for
methods.** Arrows don't get their own `this` — it's their one blind
spot. Use the shorthand above and `this` behaves.

### Your goal

1. Create an object `hero` with `name: "Ada"`, `score: 0`, and two
   methods:
   - `describe()` — **returns** `` `${this.name} has ${this.score} points` ``
   - `addPoints(points)` — increases `this.score` by `points`
2. Award the points: call `hero.addPoints(25)` **twice**.
3. Print `hero.describe()`:

```
Ada has 50 points
```

The tests will award extra points and check `describe()` again — so
build the string from `this`, don't hardcode `50`.
