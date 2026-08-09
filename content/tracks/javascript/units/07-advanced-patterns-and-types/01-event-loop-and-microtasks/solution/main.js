console.log("open");

setTimeout(() => console.log("timer a"), 0);

queueMicrotask(() => {
  console.log("micro a");
  queueMicrotask(() => console.log("micro c"));
});

Promise.resolve("micro b").then((line) => console.log(line));

setTimeout(() => console.log("timer b"), 0);

console.log("close");
