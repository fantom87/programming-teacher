import summarize, { mean, median } from "./stats.js";

const RUN_TIMES = [30, 50, 62, 41, 47];

console.log(`mean: ${mean(RUN_TIMES)}`);
console.log(`median: ${median(RUN_TIMES)}`);
console.log(summarize(RUN_TIMES));
