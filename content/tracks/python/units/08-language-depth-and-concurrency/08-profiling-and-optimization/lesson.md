---
id: 08-profiling-and-optimization
title: Profiling and Optimization
language: python
runner: browser
estMinutes: 20
files:
  - path: main.py
    starter: starter/main.py
goal: "Instrument two dedupe implementations with comparison counters — the list-scan version and the set version — run both on the same 200-item feed, and print a report where every number, including the 25x speedup, is measured."
docs: [python/lists, python/tuples-and-sets, python/loops]
checks:
  - id: instrumented-correctly
    type: tests
    entry: main.py
    testFile: tests/test_main.py
  - id: prints-the-measurements
    type: stdout
    entry: main.py
    match: exact
    value: "slow: 50 unique in 5050 comparisons\nfast: 50 unique in 200 comparisons\nsame answer: True\nspeedup: 25x\n"
  - id: measured-not-guessed
    type: ai-judge
    rubric: "dedupe_slow keeps seen as a LIST and counts honestly: an inner loop over seen increments the counter once per equality check and breaks when it finds a match — not a bulk `comparisons += len(seen)` guess and not `item in seen` (which hides the cost being measured). dedupe_fast keeps seen as a SET and counts one check per item. Both return (unique_items, comparisons) with first-seen order preserved. The report is entirely computed from the two calls on `[*range(50)] * 4`: counts, the equality comparison for 'same answer', and the speedup via slow // fast — none of 5050, 200, 50, True, or 25 appears as a hardcoded print value."
hints:
  - "The slow scan, instrumented: for old in seen: comparisons += 1; if old == item: found = True; break — you're paying one comparison per stored item until a hit, which is exactly what `item in seen` costs on a list."
  - "The fast version is the same loop shape with seen = set() and comparisons += 1 per item — a set lookup is one hash probe, not a scan."
  - "Feed both the same data = [*range(50)] * 4 and print only computed values: the two counts, slow_result == fast_result for the True, and slow_count // fast_count for the 25."
---
## Measure, then optimize

The first rule of making Python fast: **don't guess where the time
goes — measure.** The standard toolkit has two instruments you should
know by name. `timeit` races small snippets with honest repetition:

```
python -m timeit -s "data = list(range(1000))" "500 in data"
```

And `cProfile` charts a whole program — every function, call counts,
cumulative time:

```
python -m cProfile -s cumtime app.py
```

Its table answers the only question that matters: *which lines are
hot?* Optimizing anything else is wasted effort — the classic finding
is 90% of runtime in one innocent-looking loop.

Wall-clock time is jittery in a shared runner, so today we profile
the way the pros count cache misses: **instrument the operations
themselves**. The hot operation in deduplication is the membership
check, and it's where big-O lives:

- `item in seen_list` *scans* — one equality comparison per stored
  item until a hit. n items, up to n each: **O(n²)** total.
- `item in seen_set` hashes — effectively **one** probe regardless of
  size: **O(n)** total.

You'll write both, with a `comparisons` counter standing in for the
profiler's column, and let the numbers argue. On 200 items the scan
pays 5050 comparisons, the set pays 200 — a measured 25x, and the gap
*widens* with n. That's the second rule: **a better data structure
beats a thousand micro-tweaks.** No amount of loop-tightening rescues
the list scan; one changed line (`seen = set()`) does.

### Your goal

1. `dedupe_slow(items)` — `seen` is a list; for each item, scan
   `seen` with an inner loop, counting **every** equality comparison
   and breaking on a match; unseen items go into `seen` and the
   result. Return `(result, comparisons)`.
2. `dedupe_fast(items)` — same contract, but `seen` is a set and each
   item costs exactly one counted check.
3. Run both on `data = [*range(50)] * 4` and print the measured
   report — counts, agreement, and `slow // fast` speedup:

```
slow: 50 unique in 5050 comparisons
fast: 50 unique in 200 comparisons
same answer: True
speedup: 25x
```
