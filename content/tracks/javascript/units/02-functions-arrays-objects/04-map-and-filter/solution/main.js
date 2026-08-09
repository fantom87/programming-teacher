const numbers = [1, 2, 3, 4, 5, 6];

const doubleAll = (nums) => nums.map((n) => n * 2);
const evensOnly = (nums) => nums.filter((n) => n % 2 === 0);
const shoutAll = (words) => words.map((word) => word.toUpperCase() + "!");

console.log(doubleAll(numbers).join(", "));
console.log(evensOnly(numbers).join(", "));
