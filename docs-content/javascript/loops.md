# Loops

Loops repeat work so you don't have to copy-paste code. "Do this for every item" and "keep going until something changes" are both loops.

## for...of — the friendly workhorse

The easiest way to visit every item in an array:

```js
const colors = ["red", "green", "blue"];

for (const color of colors) {
  console.log(color);
}
// red, green, blue
```

Read it as: "for each `color` of `colors`, do this."

## The classic for loop

When you need a counter or precise control:

```js
for (let i = 0; i < 5; i++) {
  console.log(`Round ${i}`);
}
// Round 0 ... Round 4
```

Three parts, separated by semicolons: start (`let i = 0`), keep-going condition (`i < 5`), and what changes each round (`i++`).

## while — loop until a condition changes

Use `while` when you don't know in advance how many rounds you need:

```js
let health = 100;

while (health > 0) {
  health -= 30;
  console.log(`Health: ${health}`);
}
// Health: 70, 40, 10, -20
```

Careful: if the condition never becomes false, the loop runs forever and freezes the page. Make sure something inside the loop moves it toward the exit.

## break and continue

```js
for (const n of [1, 5, 8, 3, 9]) {
  if (n === 8) break;      // stop the whole loop
  console.log(n);          // 1, 5
}

for (const n of [1, 2, 3, 4]) {
  if (n % 2 === 0) continue;  // skip to the next round
  console.log(n);             // 1, 3
}
```

## Looping with array methods

Often you don't write a loop at all — array methods loop for you:

```js
const names = ["ada", "grace", "alan"];

names.forEach((name) => console.log(name));
const capitalized = names.map((n) => n.toUpperCase());
```

Rule of thumb: use `for...of` or array methods for lists, the classic `for` when you need the index, and `while` when the end depends on a condition.
