const inventory = ["sword", "map", "rope", "lantern", "coin"];

const hasRope = inventory.includes("rope");
const mapSpot = inventory.indexOf("map");
const firstThree = inventory.slice(0, 3);
const packed = inventory.join(" | ");

console.log(hasRope);
console.log(mapSpot);
console.log(packed);
