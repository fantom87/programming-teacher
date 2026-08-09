// Functional data drills — four shapers, no loops.

// The data. Your functions take it as a parameter — and never mutate it.
const orders = [
  { id: 1, item: "keyboard", price: 90, qty: 1, shipped: true },
  { id: 2, item: "mouse", price: 25, qty: 2, shipped: false },
  { id: 3, item: "monitor", price: 180, qty: 1, shipped: true },
  { id: 4, item: "cable", price: 8, qty: 3, shipped: false },
];

// 1. revenue(orders) -> total of price * qty. One reduce, seeded with 0.

// 2. unshipped(orders) -> item names of the unshipped orders.
//    filter, then map.

// 3. byId(orders) -> a lookup object: { 1: {...}, 2: {...}, ... }.
//    Object.fromEntries over [id, order] pairs.

// 4. topByValue(orders, n) -> the n item names with the biggest
//    price * qty, biggest first. Sort a COPY — never the input.

// Drill — leave these prints exactly as they are:
console.log(revenue(orders));
console.log(unshipped(orders).join(", "));
console.log(byId(orders)[3].item);
console.log(topByValue(orders, 2).join(" > "));
console.log(orders[0].item);
