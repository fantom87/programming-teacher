# Strings

A string is a piece of text: a name, a sentence, an emoji, or nothing at all (`""`, the empty string).

## Making strings

```js
const single = 'hello';
const double = "hello";
const fancy = `hello`;   // backticks — the most useful kind
```

Backtick strings are called **template literals**. They let you drop values straight into text with `${...}`:

```js
const name = "Sam";
const age = 12;
console.log(`${name} is ${age} years old.`);
// "Sam is 12 years old."
```

Template literals can also span multiple lines — regular quotes can't.

## Joining and measuring

```js
const first = "Ada";
const last = "Lovelace";

const full = `${first} ${last}`;   // "Ada Lovelace"
console.log(full.length);          // 12 — includes the space
```

## Useful string methods

A *method* is a built-in action you call with a dot. Strings come with lots of them:

```js
const s = "  Hello, World!  ";

s.trim();                 // "Hello, World!" — removes surrounding spaces
s.toUpperCase();          // "  HELLO, WORLD!  "
s.toLowerCase();          // "  hello, world!  "
s.includes("World");      // true
s.replace("World", "JS"); // "  Hello, JS!  "
s.split(",");             // ["  Hello", " World!  "] — an array of pieces
```

Important: these methods **return a new string** — the original never changes.

```js
const original = "hello";
const loud = original.toUpperCase();
console.log(original);  // still "hello"
console.log(loud);      // "HELLO"
```

## Getting characters

Each character has a position (an *index*), starting from 0:

```js
const word = "cat";
word[0];          // "c"
word[2];          // "t"
word.slice(1);    // "at" — everything from index 1 onward
word.slice(0, 2); // "ca" — from index 0 up to (not including) 2
```

When in doubt, open the console and experiment — strings are perfect for playing around.
