// office-supplies.js — renamed to main.ts. Step one of the migration: done.
// It runs exactly as before. Now make the types tell the truth.

const supplies = [
  { name: "ink", qty: 10, price: 150 },
  { name: "stapler", qty: 4, price: 700 },
  { name: "tape", qty: 8, price: 200 },
];

function findItem(items, name) {
  return items.find((item) => item.name === name);
}

function restock(items, name, amount) {
  const item = findItem(items, name);
  if (item) item.qty += amount;
}

function report(items, name) {
  return name + ": " + findItem(items, name).qty + " in stock"; // crashes on a miss!
}

function totalValue(items) {
  return items.reduce((sum, item) => sum + item.qty * item.price, 0);
}

restock(supplies, "ink", 2);
console.log(report(supplies, "ink"));
// console.log(report(supplies, "glitter"));   // uncomment once report is fixed
console.log("total value: $" + (totalValue(supplies) / 100).toFixed(2));
