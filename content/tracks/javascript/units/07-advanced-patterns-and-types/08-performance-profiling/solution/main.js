function timeIt(label, work) {
  const start = performance.now();
  const result = work();
  const ms = performance.now() - start;
  console.log(`${label}: ${result} hits in ${ms.toFixed(1)}ms`);
  return ms;
}

const catalog = [];
for (let n = 0; n < 20000; n++) catalog.push(`track-${n}`);

const searches = [];
for (let n = 0; n < 20000; n++) {
  searches.push(n % 2 === 0 ? `track-${n}` : `missing-${n}`);
}

function scanWithArray() {
  return searches.filter((id) => catalog.includes(id)).length;
}

const catalogSet = new Set(catalog);
function scanWithSet() {
  return searches.filter((id) => catalogSet.has(id)).length;
}

const arrayMs = timeIt("array scan", scanWithArray);
const setMs = timeIt("set scan", scanWithSet);

console.log(`hits agree: ${scanWithArray() === scanWithSet()}`);
console.log(`set is faster: ${setMs < arrayMs}`);
