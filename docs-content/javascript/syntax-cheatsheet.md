# JavaScript syntax cheatsheet

A quick tour of the pieces you'll use every day. Don't memorize it — just know it's here when you need a reminder.

## Variables

```js
const name = "Ada";   // can't be reassigned — use this most of the time
let score = 0;        // can be reassigned
score = 10;
```

## Values

```js
const text = "hello";           // string
const count = 42;               // number
const isReady = true;           // boolean
const nothing = null;           // deliberately empty
const list = [1, 2, 3];         // array
const person = { name: "Ada" }; // object
```

## Doing things with values

```js
const total = 2 + 3;                 // 5
const greeting = `Hi, ${name}!`;     // template literal: "Hi, Ada!"
const isAdult = age >= 18;           // comparison gives true or false
const same = a === b;                // strict equality — always use ===
```

## Making decisions

```js
if (score > 100) {
  console.log("High score!");
} else {
  console.log("Keep trying!");
}
```

## Repeating things

```js
for (const item of list) {
  console.log(item);
}
```

## Functions

```js
function add(a, b) {
  return a + b;
}

const double = (n) => n * 2;   // arrow function, short form
```

## Comments

```js
// a single-line note to yourself
/* a longer note that
   can span lines */
```

## Printing for debugging

```js
console.log("score is", score);
```

Every one of these has its own page in this section with more detail and examples. When something here looks mysterious, that's your cue for what to read next.
