function* countdown(from) {
  for (let n = from; n >= 1; n--) yield n;
}

function* naturals() {
  let n = 1;
  while (true) yield n++;
}

function* take(iterable, count) {
  let taken = 0;
  for (const item of iterable) {
    if (taken >= count) return;
    yield item;
    taken += 1;
  }
}

const launch = countdown(3);
console.log(launch.next());
console.log(launch.next().value);
for (const n of launch) console.log(n);
console.log("liftoff!");

console.log([...take(naturals(), 5)].join(","));
console.log([...take(["ruby", "amber", "jade"], 2)].join(","));
