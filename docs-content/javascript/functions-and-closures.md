# Functions and closures

A function is a reusable recipe: you give it ingredients (arguments), it does its steps, and it can hand back a result (`return`).

## Defining and calling

```js
function greet(name) {
  return `Hello, ${name}!`;
}

const message = greet("Ada");   // "Hello, Ada!"
```

`name` is a **parameter** (the placeholder); `"Ada"` is an **argument** (the actual value). Without a `return`, a function gives back `undefined`.

## Arrow functions

A shorter syntax, used constantly in modern code:

```js
const add = (a, b) => a + b;          // one expression? it's returned automatically

const shout = (text) => {
  const loud = text.toUpperCase();    // multiple lines need braces...
  return `${loud}!!!`;                // ...and an explicit return
};
```

Arrow functions shine as arguments to other functions:

```js
[1, 2, 3].map((n) => n * 10);   // [10, 20, 30]
```

## Default parameters

```js
function greetPolitely(name = "friend") {
  return `Hello, ${name}!`;
}

greetPolitely();        // "Hello, friend!"
```

## Closures: functions that remember

Here's the magic part. A function keeps access to the variables that existed where it was **created** — even after the outer function has finished. That's a **closure**.

```js
function makeCounter() {
  let count = 0;                // private to this counter

  return function () {
    count++;
    return count;
  };
}

const counter = makeCounter();
counter();   // 1
counter();   // 2

const another = makeCounter();
another();   // 1 — a fresh, separate count
```

`makeCounter` ran and returned, but the inner function still "remembers" `count`. Each call to `makeCounter()` creates its own private `count` that nothing outside can touch.

Closures are how JavaScript does private state, and you use them constantly without noticing — every event handler that reads a nearby variable is a closure:

```js
const username = "Ada";
button.addEventListener("click", () => {
  console.log(`Clicked by ${username}`);   // closure over username
});
```

If closures feel slippery, that's normal. The one-sentence version: **functions carry a backpack of the variables around them when they were made.**
