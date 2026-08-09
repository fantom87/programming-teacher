---
id: 04-parallelism-basics
title: "Parallelism Basics"
language: csharp
runner: local
estMinutes: 18
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Split a CPU-bound prime count across four Task.Run jobs, collect the per-range counts with WhenAll in argument order, and sum the total from the results array."
docs: [csharp/async-await, csharp/linq-basics]
checks:
  - id: prime-census
    type: stdout
    entry: Program.cs
    match: exact
    value: "== Prime census ==\n1..25000: 2762 primes\n25001..50000: 2371 primes\n50001..75000: 2260 primes\n75001..100000: 2199 primes\ntotal: 9592\n"
  - id: task-run-fan-out
    type: ai-judge
    rubric: "CountPrimes stays a plain synchronous static int method (no async, no Task inside) — the parallelism lives entirely at the call site. Each range is dispatched with Task.Run(() => CountPrimes(...)) into a Task<int>[] built by a loop or Select over the ranges array, with the range copied into locals (or a Select parameter) before the lambda captures it — not a naked loop variable captured by all four lambdas. Results come from one await Task.WhenAll and each report line pairs ranges[i] with counts[i] by index, relying on WhenAll's argument-order guarantee. The total is summed from the counts array (Sum or a loop), and none of the numbers 2762, 2371, 2260, 2199, 9592 appear as literals. No shared mutable counter incremented from inside the tasks."
hints:
  - "Dispatch, copying the range first: for (int i = 0; i < ranges.Length; i++) { (int from, int to) = ranges[i]; jobs[i] = Task.Run(() => CountPrimes(from, to)); } — capture the locals, not i itself."
  - "Collect in argument order: int[] counts = await Task.WhenAll(jobs); — counts[i] belongs to ranges[i], however the four jobs raced."
  - "Report from the pair: Console.WriteLine($\"{ranges[i].From}..{ranges[i].To}: {counts[i]} primes\"); then Console.WriteLine($\"total: {counts.Sum()}\");"
---
## When waiting isn't the problem

`await` shines when the work happens *elsewhere* — a server, a disk —
and your thread has nothing to do but wait. Counting primes is the
opposite: the work is right here, burning your CPU. `await`ing it buys
nothing; there's no wait to overlap. What you want is **parallelism** —
more cores on the job — and the front door is `Task.Run`:

```csharp
Task<int> job = Task.Run(() => CountPrimes(1, 25000));
```

`Task.Run` hands the lambda to the **thread pool** — a set of worker
threads .NET keeps warm — and gives you back the same `Task<int>`
currency you've been awaiting all week. That's the beauty: CPU work and
I/O work compose identically. Four ranges, four `Task.Run` calls, one
`Task.WhenAll`, and yesterday's guarantee does the heavy lifting —
**results in argument order**, no matter which core finished first.
`counts[i]` always belongs to `ranges[i]`; a four-way race produces
byte-identical output every run.

Two traps live in this pattern. First, **captured loop variables**: all
four lambdas closing over the same `i` would see whatever `i` is when
they finally run. Copy the range into locals *before* the lambda touches
it. Second, **shared counters**: four tasks doing `total++` on one
variable is a data race — increments vanish. The fix is structural, not
locks: each task returns its *own* count, and you sum the array
afterward. Partition, compute independently, combine — that's the shape
of almost all safe parallelism (PLINQ's `.AsParallel()` and
`Parallel.ForEach` industrialize exactly this).

And the rule that keeps teams out of trouble: `Task.Run` is for
CPU-bound work. Wrapping an already-async I/O call in it just burns a
pool thread to wait.

### Your goal

Produce exactly:

```
== Prime census ==
1..25000: 2762 primes
25001..50000: 2371 primes
50001..75000: 2260 primes
75001..100000: 2199 primes
total: 9592
```

1. Keep `CountPrimes` synchronous — the starter provides it and the
   ranges array.
2. Dispatch each range with `Task.Run` into a `Task<int>[]`, copying
   the range into locals before the lambda captures it.
3. Collect with one `await Task.WhenAll`, print each range with its
   count by shared index, and sum the total from the array.
