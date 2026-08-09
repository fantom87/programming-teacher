---
id: 01-tasks-and-await
title: "Tasks and Await"
language: csharp
runner: local
estMinutes: 15
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Write an async step runner on Task.Delay, start a task without awaiting it to prove the server stays responsive, then await three build steps in dependency order."
docs: [csharp/async-await, csharp/methods]
checks:
  - id: build-run
    type: stdout
    entry: Program.cs
    match: exact
    value: "== Build server ==\njob accepted\nrestore done\ncompile done\npublish done\nbuild succeeded\n"
  - id: hot-task-real-awaits
    type: ai-judge
    rubric: "RunStep is declared static async Task<string>, awaits Task.Delay(ms), and returns the interpolated string — the printed step lines come from awaited return values, not retyped literals. The restore task is STARTED (RunStep called, result stored in a Task<string> variable) before the job accepted line prints, and only awaited after it — proving the task runs while the top-level code continues. Compile and publish are awaited sequentially after restore. Nowhere in the file: Thread.Sleep, .Result, .Wait(), or .ContinueWith."
hints:
  - "The runner, at the bottom of the file: static async Task<string> RunStep(string name, int ms) { await Task.Delay(ms); return $\"{name} done\"; } — calling it gives you a Task<string>."
  - "Start-without-await: Task<string> restoring = RunStep(\"restore\", 80); Console.WriteLine(\"job accepted\"); — no await on the first line, so the print happens while the restore's 80ms clock is already running."
  - "Collect where you need the value: Console.WriteLine(await restoring); then await the next steps inline — Console.WriteLine(await RunStep(\"compile\", 60)); and the same for publish at 40."
---
## The value that isn't there yet

Everything you've called so far answered immediately. Real programs spend
most of their lives *waiting* — on disks, networks, other machines — and
C#'s unit of waiting is the **`Task`**. A `Task<string>` is a promise: the
string isn't here yet, but the work producing it is in flight. `await`
collects on the promise — pause *this method* until the task finishes,
then hand over its value. No thread sits blocked in the meantime.

```csharp
static async Task<string> RunStep(string name, int ms)
{
    await Task.Delay(ms);   // an asynchronous pause — no thread held hostage
    return $"{name} done";
}
```

Mark the method `async`, and its `return` fulfills the `Task<string>` the
caller holds. `Task.Delay` stands in for real I/O — `HttpClient
.GetStringAsync`, `File.ReadAllTextAsync`, every `...Async` method in .NET
has exactly this shape.

Now the detail that separates *using* async from *understanding* it:
**calling an async method starts it.**

```csharp
Task<string> restoring = RunStep("restore", 80);   // running NOW
Console.WriteLine("job accepted");                 // prints while it restores
Console.WriteLine(await restoring);                // need the value — collect
```

The task is hot the moment you call the method; `await` only marks where
you refuse to continue without the result. Steps that depend on each other
get awaited in sequence — compiling can't start before the restore is done.

Three things you never write again: `Thread.Sleep` (blocks the thread —
the exact thing async exists to avoid), and `.Result` / `.Wait()` on a
task (block too, and can deadlock real apps). Want the value? `await` it —
your file can await at the top level because the compiler wraps it in an
async `Main`.

### Your goal

Produce exactly:

```
== Build server ==
job accepted
restore done
compile done
publish done
build succeeded
```

1. Write `RunStep(name, ms)` — async, `Task.Delay(ms)`, returns
   `"{name} done"`.
2. Print the header, then **start** the restore step (80 ms) without
   awaiting it.
3. Print `job accepted` — proof the server isn't blocked.
4. Await the restore and print its value; then await and print
   compile (60 ms) and publish (40 ms) in order.
5. Close with `build succeeded`.
