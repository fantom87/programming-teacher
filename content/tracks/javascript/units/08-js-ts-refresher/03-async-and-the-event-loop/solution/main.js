function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function trace() {
  console.log("sync 1");
  setTimeout(() => console.log("macrotask"), 0);
  Promise.resolve().then(() => console.log("microtask"));
  console.log("sync 2");
}

async function finishLine() {
  const results = await Promise.all([
    delay(60).then(() => "tortoise"),
    delay(20).then(() => "hare"),
  ]);
  console.log(results.join(", "));
}

// Drill — leave these lines exactly as they are:
trace();
finishLine().then(() => console.log("all settled"));
console.log("script end");
