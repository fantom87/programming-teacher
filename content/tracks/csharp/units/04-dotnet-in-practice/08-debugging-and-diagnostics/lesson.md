---
id: 08-debugging-and-diagnostics
title: Debugging and Diagnostics
language: csharp
runner: local
estMinutes: 20
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Read the stack trace, fix the off-by-one crash properly, then instrument the scan with Console.Error [debug] lines and a Stopwatch that reports to stderr."
docs: [csharp/exceptions, csharp/control-flow]
checks:
  - id: fixed-report
    type: stdout
    entry: Program.cs
    match: exact
    value: "Scanning 7 readings\nBiggest jump: 6\nWarmest day: 79\n"
  - id: proper-fix-and-channels
    type: ai-judge
    rubric: "The IndexOutOfRangeException is fixed by correcting the loop's logic so temps[i + 1] can never pass the last index — the condition becomes i < temps.Length - 1, or an equivalent guard prevents the out-of-range read. It is NOT fixed by wrapping the crash in try/catch or clamping with Math.Min. Every [debug] line goes through Console.Error.WriteLine, never Console.WriteLine. A Stopwatch is started before the scan, stopped after it, and its elapsed time is reported to stderr only — stdout carries just the three report lines, with the 7, 6, and 79 computed from the array (Length, the loop, Max or equivalent)."
hints:
  - "Run it first and read the red text: IndexOutOfRangeException, then the 'at ... Program.cs:line N' frame hands you the address. On the last loop turn, what index does temps[i + 1] reach?"
  - "The last valid pair is (Length - 2, Length - 1) — so the loop must stop at i < temps.Length - 1."
  - "Diagnostics: Console.Error.WriteLine($\"[debug] day {i} -> {i + 1}: jump {jump}\") inside the loop; Stopwatch clock = Stopwatch.StartNew(); ... clock.Stop(); then report clock.ElapsedMilliseconds to Console.Error too — it changes every run, so it must stay off stdout."
---
## Read the crash like a map

This starter **crashes on purpose**. Run it, and don't skim the red text —
read it like a pro:

```
Unhandled exception. System.IndexOutOfRangeException: Index was outside the bounds of the array.
   at Program.<Main>$(String[] args) in ...\Program.cs:line 10
```

Two lines, three gifts. The **type** (`IndexOutOfRangeException`) narrows
the crime: an index walked off an array's edge. The **message** confirms
it. The **stack trace** hands you the address — your file, your line. Most
bugs fall to taking the report literally: go to that line, ask which value
could be illegal there, then look at the loop that produced it.
(`temps[i + 1]` — what's the largest `i` your loop allows?)

Resist the lesson 6 reflex: wrapping this in `try/catch` would be *hiding a
bug*. That rule cut both ways — expected failures get caught by name, and
bugs get to crash, because a crash carries the evidence. Fix the logic
instead.

Then instrument it like production code, with the **two-channel rule**:
stdout is your program's product; diagnostics belong on stderr.

```csharp
Console.Error.WriteLine($"[debug] day {i} -> {i + 1}: jump {jump}");
```

This app shows stderr in its own panel, and checks read only stdout — so
debug chatter never corrupts the real output. Anything that varies between
runs is automatically stderr material, which includes timings:

```csharp
using System.Diagnostics;              // top of the file

Stopwatch clock = Stopwatch.StartNew();
// ... the work ...
clock.Stop();                          // clock.ElapsedMilliseconds
```

Printf-debugging plus clean channels plus stack-trace literacy will carry
you shockingly far — the debugger you'll meet in an IDE someday is these
same instincts with breakpoints.

### Your goal

Fix the crash and print exactly (on stdout):

```
Scanning 7 readings
Biggest jump: 6
Warmest day: 79
```

1. Run, read the stack trace, and fix the loop bound — the last valid pair
   is `(Length - 2, Length - 1)`.
2. Add a `[debug]` line per comparison via `Console.Error.WriteLine`.
3. Time the scan with a `Stopwatch` and report the elapsed milliseconds to
   **stderr** — it varies every run, so it must stay off stdout.
