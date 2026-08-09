// 1. Which world are we in? typeof can safely mention missing names.
function detectRuntime() {
  return typeof window === "undefined" && typeof process !== "undefined"
    ? "node"
    : "browser";
}

// 2. All argument logic lives here — a plain array in, a string out.
//    No process anywhere: tests (and browsers) can call it directly.
function describeArgs(args) {
  if (args.length === 0) return "args: none";
  return `args (${args.length}): ${args.join(", ")}`;
}

// 3. The edge: process is touched once, right where the program starts.
console.log(`runtime: ${detectRuntime()}`);
console.log(describeArgs(process.argv.slice(2)));
console.log(`node ${process.version}`);
