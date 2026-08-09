function kindOf(x) {
  if (x === null) return "null";
  if (Array.isArray(x)) return "array";
  if (Number.isNaN(x)) return "nan";
  return typeof x;
}

function row(name, price) {
  return `${name.padEnd(8)}|${price.toFixed(2).padStart(7)}`;
}

function counters() {
  const out = [];
  for (let i = 0; i < 3; i++) out.push(() => i);
  return out;
}

// Drill — leave these prints exactly as they are:
console.log([null, [1, 2], NaN, "hi", 42, undefined].map(kindOf).join(" "));
console.log(row("coffee", 4.5));
console.log(row("keyboard", 89.999));
console.log(counters().map((f) => f()).join(" "));
