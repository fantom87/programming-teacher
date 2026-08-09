const addTen = (n) => n + 10;
const snacks = ["apples", "pretzels", "cocoa"];

function applyTwice(fn, value) {
  return fn(fn(value));
}

function forEachItem(items, action) {
  for (const item of items) {
    action(item);
  }
}

console.log(applyTwice(addTen, 5));

forEachItem(snacks, (snack) => console.log(`I like ${snack}`));
