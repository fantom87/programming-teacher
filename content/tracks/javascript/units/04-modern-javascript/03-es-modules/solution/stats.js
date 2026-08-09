// Your stats library. Export, don't print — main.js does the talking.

export function mean(numbers) {
  const total = numbers.reduce((sum, n) => sum + n, 0);
  return total / numbers.length;
}

export function median(numbers) {
  const sorted = [...numbers].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

export default function summarize(numbers) {
  return `${numbers.length} runs — mean ${mean(numbers)}, median ${median(numbers)}`;
}
