// Generators: functions that pause at yield and resume on next().

// 1. function* countdown(from) — yields from, from-1, ..., 1.

// 2. function* naturals() — yields 1, 2, 3, ... forever (while (true) is
//    safe: the loop only runs between next() calls).

// 3. function* take(iterable, count) — for...of the iterable, yield at
//    most count items, then return. Never collect the source into an
//    array — the infinite stream would win.

// 4. The demo. ONE iterator, driven three ways:
// const launch = countdown(3);
// console.log(launch.next());          // { value: 3, done: false }
// console.log(launch.next().value);    // 2
// for (const n of launch) console.log(n);  // 1 — for...of resumes the SAME iterator
// console.log("liftoff!");
//
// Then the lazy pipeline:
// console.log([...take(naturals(), 5)].join(","));
// console.log([...take(["ruby", "amber", "jade"], 2)].join(","));
