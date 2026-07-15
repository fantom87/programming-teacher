# Variables and types

A variable is a named box that holds a value. You give it a name, put something in it, and use the name later.

## Declaring variables

Modern JavaScript gives you two keywords:

```js
const city = "Lisbon";  // const: the name can't be pointed at a new value
let visits = 3;         // let: the name can be reassigned later

visits = 4;             // fine
city = "Porto";         // Error! const can't be reassigned
```

A good habit: **use `const` by default**, and switch to `let` only when you actually need to reassign. You may see `var` in older code — it behaves in surprising ways, so avoid it in new code.

## The basic types

Every value has a type. The ones you'll meet first:

```js
const title = "Hello";     // string — text, in quotes
const price = 9.99;        // number — integers and decimals are one type
const isOpen = true;       // boolean — true or false
const middleName = null;   // null — "intentionally empty"
let nickname;              // undefined — declared but never given a value
```

You can ask JavaScript what type something is:

```js
console.log(typeof price);   // "number"
console.log(typeof title);   // "string"
console.log(typeof isOpen);  // "boolean"
```

## Types can change

JavaScript is *dynamically typed*: a variable declared with `let` can hold a string now and a number later. That's flexible, but it can hide bugs:

```js
let value = "5";
value = 5;        // allowed, but easy to confuse yourself
```

This is why comparisons use `===` (strict equality), which checks the type too:

```js
5 === "5";   // false — different types
5 == "5";    // true, but avoid == — it silently converts types
```

## Naming tips

Use `camelCase`, start with a letter, and pick names that say what the value *is*: `userAge` beats `x`. Future-you will thank present-you.
