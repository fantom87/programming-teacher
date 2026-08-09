// Your stats library. Export, don't print — main.js does the talking.

// 1. export function mean(numbers) — the average: total / count.

// 2. export function median(numbers) — sort a COPY with a numeric
//    compare ([...numbers].sort((a, b) => a - b)), then RETURN the
//    middle: sorted[Math.floor(sorted.length / 2)].
//    (Odd-length input only for this lesson.)

// 3. export default function summarize(numbers) — RETURN
//    `${numbers.length} runs — mean ${...}, median ${...}` by CALLING
//    mean and median.
