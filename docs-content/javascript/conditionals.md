# Conditionals

Conditionals let your program make decisions: *if* this is true, do that; *otherwise*, do something else.

## if, else if, else

```js
const temperature = 28;

if (temperature > 30) {
  console.log("It's hot!");
} else if (temperature > 20) {
  console.log("Nice and warm.");
} else {
  console.log("Bring a jacket.");
}
// "Nice and warm."
```

JavaScript checks each condition top to bottom and runs the **first** block whose condition is true, then skips the rest.

## Comparisons

These expressions produce `true` or `false`:

```js
age >= 18       // greater than or equal
count < 10      // less than
name === "Ada"  // equal (strict — checks type too)
name !== "Bob"  // not equal
```

Always use `===` and `!==`. The loose versions (`==`, `!=`) convert types behind your back — `5 == "5"` is `true`, which causes confusing bugs.

## Combining conditions

```js
const age = 25;
const hasTicket = true;

if (age >= 18 && hasTicket) {   // && means AND — both must be true
  console.log("Come on in!");
}

if (age < 13 || age > 65) {     // || means OR — at least one must be true
  console.log("Discount applies.");
}

if (!hasTicket) {               // ! means NOT — flips true/false
  console.log("Ticket required.");
}
```

## Truthy and falsy

In a condition, JavaScript treats some values as false even though they aren't literally `false`: `0`, `""`, `null`, `undefined`, and `NaN`. Everything else counts as true.

```js
const username = "";

if (username) {
  console.log(`Hi, ${username}`);
} else {
  console.log("Please enter a name.");   // runs — "" is falsy
}
```

## The ternary operator

A compact one-line if/else, great for picking between two values:

```js
const label = count === 1 ? "1 item" : `${count} items`;
```

Read it as: *condition* `?` *value if true* `:` *value if false*. Use it for simple choices; reach for full `if` blocks when logic grows.
