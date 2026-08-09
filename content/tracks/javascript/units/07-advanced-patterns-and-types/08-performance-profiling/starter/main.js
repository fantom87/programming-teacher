// Profile it or it didn't happen: one harness, two implementations,
// verdicts computed from the clock.

// 1. timeIt(label, work) — performance.now() before, work() ONCE,
//    performance.now() after. Print `${label}: ${result} hits in
//    ${ms.toFixed(1)}ms`, return ms.

// 2. The data (loops, not paste):
//    catalog:  "track-0" ... "track-19999"
//    searches: 20000 entries — even n: `track-${n}` (hit),
//              odd n: `missing-${n}` (miss)

// 3. scanWithArray() — count searches found via catalog.includes(id).
//    scanWithSet()   — identical count via a Set BUILT ONCE from
//                      catalog, outside the timed function's loop.

// 4. const arrayMs = timeIt("array scan", scanWithArray);
//    const setMs   = timeIt("set scan", scanWithSet);
//    Print computed verdicts:
//      `hits agree: ${...}`      — the two counts match
//      `set is faster: ${...}`   — compare the returned times
