// A status page that pings three services — in parallel, not in a queue.

// 1. wait(ms) — the classic: new Promise((resolve) => setTimeout(resolve, ms));

// 2. async function ping(name, ms, up = true)
//    await wait(ms); throw new Error(`${name} down`) if !up;
//    otherwise return `${name} ok`.

// 3. async function main()
//    a. Promise.all: api (60ms), db (20ms), cache (40ms) — all three
//       calls INSIDE the array literal, so they start together.
//       Print the results joined with " | ".
//    b. Promise.race over three fresh pings — print `first answer: ...`.
//    c. Promise.allSettled with ping("db", 20, false) —
//       fulfilled -> print r.value
//       rejected  -> print `recovered: ${r.reason.message}`

// main();
