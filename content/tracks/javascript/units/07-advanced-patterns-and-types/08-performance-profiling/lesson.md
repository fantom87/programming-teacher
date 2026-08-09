---
id: 08-performance-profiling
title: Performance Profiling
language: javascript
runner: local
estMinutes: 20
timeoutMs: 30000
files:
  - path: main.js
    starter: starter/main.js
goal: "Measure instead of guessing: build a timeIt harness on performance.now(), race a 20,000-lookup scan through array.includes against a Set, and let the numbers name the winner."
docs: [javascript/debugging-devtools, javascript/arrays, javascript/numbers]
checks:
  - id: array-scan-measured
    type: stdout
    entry: main.js
    match: regex
    value: "array scan: 10000 hits in \\d+\\.\\dms"
  - id: set-scan-measured
    type: stdout
    entry: main.js
    match: regex
    value: "set scan: 10000 hits in \\d+\\.\\dms"
  - id: computed-verdict
    type: stdout
    entry: main.js
    match: contains
    value: "hits agree: true\nset is faster: true"
  - id: honest-measurement
    type: ai-judge
    rubric: "timeIt(label, work) is a reusable harness: it reads performance.now() before and after calling work() exactly once, prints `${label}: ${result} hits in ${ms.toFixed(1)}ms` from the measured values, and RETURNS the milliseconds. The catalog (20000 track-N ids) and searches (alternating hits and misses, 20000 entries) are built by loops — not pasted. scanWithArray counts matches via catalog.includes per search; scanWithSet does the identical work against a Set built ONCE from the catalog (a Set constructed inside the timed function per-lookup, or a set built from searches, fails the comparison's honesty). Both verdict lines are COMPUTED — hits agree compares the two scans' counts, set is faster compares the two returned durations — never typed as literals. No hardcoded hit counts or millisecond values anywhere."
hints:
  - "The harness is the lesson: const start = performance.now(); const result = work(); const ms = performance.now() - start; — print label, result, and ms.toFixed(1), then return ms so callers can compare runs."
  - "Build both datasets with plain loops: catalog.push(`track-${n}`) for 20000 ids, and searches.push(n % 2 === 0 ? `track-${n}` : `missing-${n}`) — exactly half will hit."
  - "Time the two scans, then compute the verdicts from what timeIt returned: console.log(`set is faster: ${setMs < arrayMs}`); — if you ever type the word true yourself, you've stopped measuring."
---
## Measure, then optimize

"This feels slow" has launched a thousand pointless rewrites. The
professional discipline is brutal and simple: **profile first**. In
DevTools, the Performance tab records a flame chart — every function
call as a bar whose width is time — and the widest bars, not your
hunches, tell you where the milliseconds live. Node has the same
machinery (`node --cpu-prof`, and `console.profile()` when DevTools is
attached via `node --inspect`).

Those tools don't fit in our runner, but the *skill* under them does —
because every profiler is built on one primitive: a clock around a
function call. You'll build that primitive yourself:

```js
function timeIt(label, work) {
  const start = performance.now();
  const result = work();
  const ms = performance.now() - start;
  // print, then return ms so callers can compare
}
```

`performance.now()` is the high-resolution monotonic clock — fractions
of a millisecond, never jumps backwards, the same API in browsers and
Node. (Never time with `new Date()`; it can shift under NTP mid-run.)

Your benchmark is the most common real-world win there is. Checking
20,000 ids against a 20,000-element **array** with `.includes` scans on
average half the array per lookup — roughly 200 *million* comparisons.
A **`Set`** answers `has()` from a hash table in constant time: same
answer, thousandths of the cost. That's the profiling lesson in
miniature: the fix was a data structure, not micro-tweaks — and you
only know it worked because two numbers from the same harness say so.

Two honesty rules, which the AI reviewer enforces: build the `Set`
**once**, outside the timed lookups (building it per-lookup would
smuggle the array cost back in), and compute every printed verdict
from measurements — type the word `true` yourself and you're guessing
again.

### Your goal

1. `timeIt(label, work)` — measure, print
   `` `${label}: ${result} hits in ${ms.toFixed(1)}ms` ``, return `ms`.
2. Build `catalog` (`track-0` … `track-19999`) and `searches` (20,000
   entries alternating hits and `missing-N`).
3. `scanWithArray()` and `scanWithSet()` — count matching searches;
   the `Set` is constructed once, before timing.
4. Time both, then print the computed verdicts:

```
array scan: 10000 hits in <measured>ms
set scan: 10000 hits in <measured>ms
hits agree: true
set is faster: true
```
