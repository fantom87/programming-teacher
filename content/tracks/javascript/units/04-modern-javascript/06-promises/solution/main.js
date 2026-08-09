function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function brew(drink, ms) {
  return wait(ms).then(() => `${drink} ready`);
}

console.log("order: latte");

brew("latte", 120)
  .then((msg) => {
    console.log(msg);
    return "have a great day!";
  })
  .then((line) => console.log(line));

console.log("(register is free)");
