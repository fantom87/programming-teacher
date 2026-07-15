# Numbers

JavaScript has one number type that covers both whole numbers and decimals.

```js
const apples = 3;
const price = 2.5;
const negative = -10;
```

## Arithmetic

```js
2 + 3;    // 5
10 - 4;   // 6
3 * 4;    // 12
10 / 4;   // 2.5
10 % 3;   // 1  — remainder ("modulo"): what's left after dividing
2 ** 3;   // 8  — exponent: 2 to the power of 3
```

Shortcuts for updating a variable:

```js
let score = 0;
score += 5;   // same as score = score + 5
score -= 2;   // 3
score++;      // add 1 → 4
```

## Decimals can be weird

Computers store decimals in binary, so some results are *slightly* off:

```js
0.1 + 0.2;   // 0.30000000000000004 — not a bug in your code!
```

For display, round with `toFixed`, which returns a **string**:

```js
const total = 0.1 + 0.2;
total.toFixed(2);   // "0.30"
```

## Converting strings to numbers

Input from users usually arrives as a string. Convert it before doing math:

```js
Number("42");      // 42
Number("3.14");    // 3.14
Number("hello");   // NaN — "Not a Number", the result of failed math

parseInt("42px", 10);   // 42 — reads the leading digits
parseFloat("3.9kg");    // 3.9
```

Check for `NaN` with `Number.isNaN(value)` — `NaN === NaN` is famously `false`.

## The Math toolbox

```js
Math.round(4.6);   // 5
Math.floor(4.9);   // 4 — always rounds down
Math.ceil(4.1);    // 5 — always rounds up
Math.abs(-7);      // 7
Math.max(1, 9, 3); // 9
Math.random();     // a random decimal from 0 up to (not including) 1
```

A random whole number from 1 to 6, like a die:

```js
const roll = Math.floor(Math.random() * 6) + 1;
```
