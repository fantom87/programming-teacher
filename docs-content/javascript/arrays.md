# Arrays

An array is an ordered list of values. Shopping lists, high scores, chat messages — anytime you have "several of something," you want an array.

## Creating and reading

```js
const fruits = ["apple", "banana", "cherry"];

fruits[0];         // "apple" — positions start at 0
fruits[2];         // "cherry"
fruits.length;     // 3
fruits.at(-1);     // "cherry" — negative index counts from the end
```

## Adding and removing

```js
const list = ["a", "b"];

list.push("c");     // add to the end → ["a", "b", "c"]
list.pop();         // remove from the end → ["a", "b"]
list.unshift("z");  // add to the start → ["z", "a", "b"]
list.shift();       // remove from the start → ["a", "b"]
```

Note: an array declared with `const` can still be changed — `const` only stops you from replacing the whole array with something else.

## Looping over arrays

```js
const scores = [90, 75, 88];

for (const score of scores) {
  console.log(score);
}
```

## The big three: map, filter, find

These take a function and return a result without changing the original array:

```js
const nums = [1, 2, 3, 4, 5];

// map: transform every item
const doubled = nums.map((n) => n * 2);      // [2, 4, 6, 8, 10]

// filter: keep only items that pass a test
const evens = nums.filter((n) => n % 2 === 0); // [2, 4]

// find: get the first item that passes a test
const firstBig = nums.find((n) => n > 3);    // 4
```

## Other handy tools

```js
nums.includes(3);          // true
nums.indexOf(4);           // 3 — position, or -1 if missing
nums.join(", ");           // "1, 2, 3, 4, 5" — array → string
nums.slice(1, 3);          // [2, 3] — a copy of part of the array
[...nums, 6];              // [1, 2, 3, 4, 5, 6] — spread into a new array
```

Arrays and loops go hand in hand — if this feels abstract, try the loops page next.
