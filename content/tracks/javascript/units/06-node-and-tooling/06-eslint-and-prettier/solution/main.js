// Lint-clean: const where nothing is reassigned, let for the
// accumulator, the unused oldRate deleted, the totl typo fixed (that
// was the bug — it created a global while total stayed 0), and the
// coercing == replaced by === against a real number.

const prices = [4.5, 12, 3.25];
const taxRate = 0.1;

let total = 0;
for (const price of prices) {
  total = total + price;
}

const withTax = total * (1 + taxRate);
if (prices.length === 3) {
  console.log("3 items");
}
console.log("subtotal: " + total.toFixed(2));
console.log("with tax: " + withTax.toFixed(2));
