// You are the linter. A real `npx eslint main.js` reports:
//
//   error  Unexpected var, use let or const instead      no-var   (6 places)
//   error  'oldRate' is assigned a value but never used  no-unused-vars
//   error  'totl' is not defined                         no-undef
//   error  Expected '===' and instead saw '=='           eqeqeq
//
// Fix every finding without changing what the program MEANS.
// One of them is a live bug: the subtotal should be 19.75.

var prices = [4.5, 12, 3.25];
var taxRate = 0.1;
var oldRate = 0.08;

var total = 0;
for (var i = 0; i < prices.length; i++) {
  totl = total + prices[i];
}

var withTax = total * (1 + taxRate);
if (prices.length == "3") {
  console.log("3 items");
}
console.log("subtotal: " + total.toFixed(2));
console.log("with tax: " + withTax.toFixed(2));
