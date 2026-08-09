// The espresso stand's receipt tool. It crashed this morning — and
// once you fix the crash, the total it prints is WRONG (should be
// 10.50). Two bugs. Debug like a pro:
//
//   1. Run it. Read the stack trace: the topmost frame in YOUR file
//      points at the crime scene. What value makes that line impossible?
//   2. Fixed? Run again. Now interrogate the quiet bug with
//      console.log until you see which line doesn't do its job.
//   3. Document each fix where you made it:
//        // BUG 1: <root cause, one line>
//        // BUG 2: <root cause, one line>
//
// House rule: RAW stays exactly as it is. Real files end with a
// newline — the parser has to cope, not the data.

const RAW = `latte,4.50
bagel,3.25
tea,2.75
`;

function parseItems(raw) {
  const items = [];
  for (const line of raw.split("\n")) {
    const parts = line.split(",");
    items.push({ name: parts[0], price: Number(parts[1].trim()) });
  }
  return items;
}

function totalOf(items) {
  let total = 0;
  for (const item of items) {
    total = item.price;
  }
  return total;
}

const items = parseItems(RAW);
console.log(`${items.length} items`);
for (const item of items) {
  console.log(`${item.name} ${item.price.toFixed(2)}`);
}
console.log(`total: ${totalOf(items).toFixed(2)}`);
