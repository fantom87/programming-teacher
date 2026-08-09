// Both bugs found, fixed at the cause, and written down — the receipt
// now agrees with the till.

const RAW = `latte,4.50
bagel,3.25
tea,2.75
`;

function parseItems(raw) {
  const items = [];
  for (const line of raw.split("\n")) {
    // BUG 1: RAW ends with a newline, so split("\n") produces a final
    // empty string; splitting "" on "," gives [""], parts[1] is
    // undefined, and .trim() on undefined crashed. Skip blank lines.
    if (line.trim() === "") continue;
    const parts = line.split(",");
    items.push({ name: parts[0], price: Number(parts[1].trim()) });
  }
  return items;
}

function totalOf(items) {
  let total = 0;
  for (const item of items) {
    // BUG 2: this was `total = item.price` — assignment instead of
    // accumulation, so total only ever held the LAST price (2.75).
    total += item.price;
  }
  return total;
}

const items = parseItems(RAW);
console.log(`${items.length} items`);
for (const item of items) {
  console.log(`${item.name} ${item.price.toFixed(2)}`);
}
console.log(`total: ${totalOf(items).toFixed(2)}`);
