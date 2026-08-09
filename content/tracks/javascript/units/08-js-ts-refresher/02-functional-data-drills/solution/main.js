// The data. Your functions take it as a parameter — and never mutate it.
const orders = [
  { id: 1, item: "keyboard", price: 90, qty: 1, shipped: true },
  { id: 2, item: "mouse", price: 25, qty: 2, shipped: false },
  { id: 3, item: "monitor", price: 180, qty: 1, shipped: true },
  { id: 4, item: "cable", price: 8, qty: 3, shipped: false },
];

function revenue(orders) {
  return orders.reduce((sum, o) => sum + o.price * o.qty, 0);
}

function unshipped(orders) {
  return orders.filter((o) => !o.shipped).map((o) => o.item);
}

function byId(orders) {
  return Object.fromEntries(orders.map((o) => [o.id, o]));
}

function topByValue(orders, n) {
  return [...orders]
    .sort((a, b) => b.price * b.qty - a.price * a.qty)
    .slice(0, n)
    .map((o) => o.item);
}

// Drill — leave these prints exactly as they are:
console.log(revenue(orders));
console.log(unshipped(orders).join(", "));
console.log(byId(orders)[3].item);
console.log(topByValue(orders, 2).join(" > "));
console.log(orders[0].item);
