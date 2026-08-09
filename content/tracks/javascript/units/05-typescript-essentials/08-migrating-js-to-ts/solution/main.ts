interface Item {
  name: string;
  qty: number;
  price: number;
}

const supplies: Item[] = [
  { name: "ink", qty: 10, price: 150 },
  { name: "stapler", qty: 4, price: 700 },
  { name: "tape", qty: 8, price: 200 },
];

function findItem(items: Item[], name: string): Item | undefined {
  return items.find((item) => item.name === name);
}

function restock(items: Item[], name: string, amount: number): void {
  const item = findItem(items, name);
  if (item) item.qty += amount;
}

function report(items: Item[], name: string): string {
  const item = findItem(items, name);
  if (!item) return `${name}: not found`;
  return `${name}: ${item.qty} in stock`;
}

function totalValue(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.qty * item.price, 0);
}

restock(supplies, "ink", 2);
console.log(report(supplies, "ink"));
console.log(report(supplies, "glitter"));
console.log("total value: $" + (totalValue(supplies) / 100).toFixed(2));
