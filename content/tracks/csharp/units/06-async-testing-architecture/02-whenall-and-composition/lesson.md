---
id: 02-whenall-and-composition
title: "WhenAll and Task Composition"
language: csharp
runner: local
estMinutes: 15
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Start three feed fetches together, collect them with one await Task.WhenAll, print the results in argument order, and prove concurrency with the Stopwatch."
docs: [csharp/async-await, csharp/collections]
checks:
  - id: dashboard-run
    type: stdout
    entry: Program.cs
    match: exact
    value: "== Dashboard ==\nfetching 3 feeds...\nweather: 21C sunny\nnews: 3 headlines\nstocks: ACME +2.4%\nconcurrent: True\n"
  - id: real-whenall
    type: ai-judge
    rubric: "Fetch is static async Task<string>, awaits Task.Delay(ms), and returns the interpolated name/payload string. All three fetches are STARTED (three Task<string> variables assigned) before any await appears, then collected by exactly one await Task.WhenAll(...) whose string[] result is what gets printed — either by index or a foreach over the array, never by re-awaiting the individual tasks one after another as the primary flow. The concurrent line prints an interpolated comparison of sw.ElapsedMilliseconds against a threshold (e.g. < 250), not a hardcoded True. No Thread.Sleep, .Result, or .Wait() anywhere."
hints:
  - "Start all three first: Task<string> weather = Fetch(\"weather\", \"21C sunny\", 120); and the same for news (80) and stocks (100) — three hot tasks, zero awaits so far."
  - "One collection point: string[] results = await Task.WhenAll(weather, news, stocks); — WhenAll's array is in ARGUMENT order, so results[0] is weather even if news finished first."
  - "The Stopwatch is already running from the starter's first line. After printing the results: Console.WriteLine($\"concurrent: {sw.ElapsedMilliseconds < 250}\"); — three sequential awaits would total 300+ ms and print False."
---
## Waiting for everything at once

Yesterday's build steps depended on each other, so you awaited them one
by one. But a dashboard's weather, news, and stocks feeds don't care
about each other — awaiting them in sequence means paying 120 + 80 + 100
milliseconds when you could pay 120. You already know the trick's first
half: **calling an async method starts it**. Start all three, *then*
worry about collecting.

The collector is `Task.WhenAll`:

```csharp
Task<string> weather = Fetch("weather", "21C sunny", 120);  // hot
Task<string> news    = Fetch("news", "3 headlines", 80);    // hot
Task<string> stocks  = Fetch("stocks", "ACME +2.4%", 100);  // hot

string[] results = await Task.WhenAll(weather, news, stocks);
```

`WhenAll` wraps many tasks into one that finishes when the slowest does.
Await it once and you get every result as an array — and here's the
detail interviews love: **the array is in argument order, not finish
order**. `news` finishes first at 80 ms, but it's still `results[1]`,
because it was the second argument. Concurrency without chaos: the
timing may scramble, your indexes never do.

The whole pattern costs about as long as the slowest task — which is
exactly what you'll prove. The starter starts a `Stopwatch` on line one;
after printing the feeds you'll print whether the elapsed time beat
250 ms. Start-start-start-await and you land near 120. Await each fetch
as you make it and you pay the full 300+, and the check calls you out
with a `False`.

One sibling worth knowing: `Task.WhenAny` returns as soon as the *first*
task finishes — the backbone of timeouts and races. Same shape, opposite
question.

### Your goal

Produce exactly:

```
== Dashboard ==
fetching 3 feeds...
weather: 21C sunny
news: 3 headlines
stocks: ACME +2.4%
concurrent: True
```

1. Write `Fetch(name, payload, ms)` — async, `Task.Delay(ms)`, returns
   `"{name}: {payload}"`.
2. Print the header and `fetching 3 feeds...`, then start all three
   fetches — weather (120 ms), news (80 ms), stocks (100 ms) — before
   any await.
3. Collect with one `await Task.WhenAll(...)` and print the three
   results from its array, in argument order.
4. Print the `concurrent:` line computed from `sw.ElapsedMilliseconds
   < 250`.
