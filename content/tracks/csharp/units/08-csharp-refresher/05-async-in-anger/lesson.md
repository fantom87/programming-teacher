---
id: 05-async-in-anger
title: Async in Anger
language: csharp
runner: local
estMinutes: 18
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "One async workload three ways: awaited sequentially in order, fired concurrently through Task.WhenAll (argument order in, completion order recorded), and a throwing async method caught around its await."
docs: [csharp/async-await, csharp/exceptions]
checks:
  - id: async-output
    type: stdout
    entry: Program.cs
    match: exact
    value: "-- sequential --\napi data\ncache data\ndb data\n-- concurrent --\napi data\ncache data\ndb data\ncompleted: cache, db, api\nfaster: True\ncaught: boom\n"
  - id: real-async
    type: ai-judge
    rubric: "FetchAsync is async Task<string>, awaits Task.Delay(ms), records its name in the shared finished list AFTER the delay, and returns the computed \"<name> data\" string — no Thread.Sleep, no .Result, no .Wait() anywhere in the file. The sequential section awaits FetchAsync inside a loop over jobs (one at a time, argument order). The concurrent section starts ALL three tasks before awaiting anything — a Select into tasks or explicit task variables — then a single await Task.WhenAll produces the results array, printed in argument order; the completed: line comes from joining the finished list, never from typed names. The faster: line compares the two Stopwatch elapsed values (concurrent < sequential), not a hardcoded True. FlakyAsync throws InvalidOperationException(\"boom\") after an await, and the last line comes from try/catch around its await printing ex.Message — the exception type in the catch clause is specific, not bare Exception... catch (InvalidOperationException) is required."
hints:
  - "FetchAsync is four lines: await Task.Delay(ms); finished.Add(name); return $\"{name} data\"; — the await point is where other tasks get to run."
  - "Concurrent means START first, await later: Task<string>[] tasks = jobs.Select(j => FetchAsync(j.Name, j.Ms)).ToArray(); string[] results = await Task.WhenAll(tasks); — WhenAll returns results in ARGUMENT order, while finished fills in COMPLETION order."
  - "An async method's exception surfaces at the await: try { Console.WriteLine(await FlakyAsync()); } catch (InvalidOperationException ex) { Console.WriteLine($\"caught: {ex.Message}\"); }"
---
## Async, used properly

Three jobs with fixed delays — `api` 140 ms, `cache` 40 ms, `db` 90 ms —
run twice. The output proves you understand the machinery:

- **Sequential**: `await` inside a loop runs one job at a time, in
  *argument* order. Total cost: the sum (~270 ms).
- **Concurrent**: start *all* the tasks first — calling an async method
  begins it — then `await Task.WhenAll(tasks)`. Two facts to burn in:
  `WhenAll` hands back results in **argument order** (api, cache, db),
  while the `finished` list your method appends to fills in
  **completion order** (cache, db, api). Total cost: the longest job,
  which is why `faster:` must print a *computed* `True`.
- **Failure**: an async method's exception is captured in its `Task` and
  re-thrown *at the `await`* — so `try/catch` wraps the await, catching
  the specific type, never bare `Exception`.

`Thread.Sleep`, `.Result`, and `.Wait()` are banned — the first blocks
the thread, the other two deadlock real apps.

### Your goal

Complete the starter to print exactly:

```
-- sequential --
api data
cache data
db data
-- concurrent --
api data
cache data
db data
completed: cache, db, api
faster: True
caught: boom
```

Write `FetchAsync(name, ms)` (delay, record, return `"<name> data"`),
the sequential loop, the start-all-then-`WhenAll` block, and
`FlakyAsync` — which throws `InvalidOperationException("boom")` after an
await and is caught around its await.
