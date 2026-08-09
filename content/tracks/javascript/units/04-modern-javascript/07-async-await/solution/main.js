// From last lesson — the promisified timer, ready to use.
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function step(name, ms) {
  await wait(ms);
  return `${name} done`;
}

async function makeBreakfast() {
  console.log("kitchen open");
  const eggs = await step("eggs", 60);
  console.log(eggs);
  const toast = await step("toast", 40);
  console.log(toast);
  const [juice, coffee] = await Promise.all([step("juice", 30), step("coffee", 50)]);
  console.log(juice);
  console.log(coffee);
  console.log("breakfast served");
}

makeBreakfast();
console.log("(taking more orders)");
