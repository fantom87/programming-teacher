---
id: 09-span-and-performance
title: "Span<T> and Performance"
language: csharp
runner: local
estMinutes: 18
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Rewrite a Split-based CSV field extractor with ReadOnlySpan<char> slicing, then prove the difference by measuring allocated bytes around both loops with GC.GetAllocatedBytesForCurrentThread."
docs: [csharp/types-and-variables, csharp/collections]
checks:
  - id: allocation-lab
    type: stdout
    entry: Program.cs
    match: exact
    value: "== Allocation lab ==\nsplit total: 237.75\nspan total: 237.75\nsplit allocated: True\nspan allocated less: True\n"
  - id: real-spans-real-measurement
    type: ai-judge
    rubric: "SumWithSpans gets the amount by slicing: line.AsSpan() (or an implicit span conversion), LastIndexOf(',') to find the final comma, a range or Slice to take everything after it, and decimal.Parse on the ReadOnlySpan<char> — no Split, no Substring, no new string allocations anywhere in that method. Both paths are called once BEFORE measurement begins (JIT warm-up), and each measured loop is bracketed by GC.GetAllocatedBytesForCurrentThread() calls whose difference produces splitBytes/spanBytes. The verdict lines are computed — splitBytes > 0 and spanBytes < splitBytes interpolated into the strings — with True never typed as a literal, and both totals printed via :F2 from the returned decimals, not hardcoded."
hints:
  - "The span version of one line: ReadOnlySpan<char> span = line.AsSpan(); ReadOnlySpan<char> amount = span[(span.LastIndexOf(',') + 1)..]; total += decimal.Parse(amount); — a window into the existing string, no copies."
  - "Measure by differencing: long before = GC.GetAllocatedBytesForCurrentThread(); for (int i = 0; i < Rounds; i++) splitTotal = SumWithSplit(lines); long splitBytes = GC.GetAllocatedBytesForCurrentThread() - before; — then the same bracket around the span loop."
  - "Warm up first — call SumWithSplit(lines) and SumWithSpans(lines) once before any measuring, so JIT compilation doesn't land inside your brackets. Verdicts: $\"split allocated: {splitBytes > 0}\" and $\"span allocated less: {spanBytes < splitBytes}\"."
---
## The garbage you didn't order

`line.Split(',')[2]` reads innocently, but count the purchases: one
array, plus a fresh string *per field* — copied character by character —
just to look at one number and throw the rest away. Each is a heap
**allocation**, and allocations are how you summon the garbage
collector. In a loop handling millions of lines, parsing this way means
the GC pauses your program to sweep up confetti you never needed.

**`ReadOnlySpan<char>`** is the no-copy alternative: not a string but a
*window* over one — a pointer and a length, living on the stack.
Slicing a span makes another window, no characters copied:

```csharp
ReadOnlySpan<char> span = line.AsSpan();
ReadOnlySpan<char> amount = span[(span.LastIndexOf(',') + 1)..];
total += decimal.Parse(amount);   // parses the slice in place
```

Same range syntax you know, `IndexOf`/`LastIndexOf`/`Trim` all present,
and modern .NET APIs — `decimal.Parse`, `int.TryParse`,
`File.ReadLines` pipelines — accept spans precisely so hot paths can
skip the string factory. (The mutable sibling `Span<T>` does the same
over arrays and `stackalloc` buffers.)

Performance claims demand receipts, so you'll measure. The honest
protocol, in miniature: run both paths once first — the *warm-up*, so
the JIT compiles them outside the measurement — then bracket each loop
with **`GC.GetAllocatedBytesForCurrentThread()`** and subtract. Elapsed
time you'd measure with `Stopwatch` the same way, but we assert on
allocated *bytes* today: time wobbles with the machine's mood, while
allocation counts are exact — the Split loop buys megabytes, the span
loop buys almost nothing, every single run. When you graduate to real
tuning, [BenchmarkDotNet](https://benchmarkdotnet.org) runs this whole
ritual — warm-up, iterations, allocation column — as a library, in
Release mode. Today you *are* the benchmark harness, which is exactly
why you'll trust the numbers.

### Your goal

Produce exactly:

```
== Allocation lab ==
split total: 237.75
span total: 237.75
split allocated: True
span allocated less: True
```

1. Write `SumWithSpans` — `AsSpan`, `LastIndexOf(',')`, slice past it,
   `decimal.Parse` the span. No Split, no Substring.
2. Warm both paths up, then measure each 2000-round loop by
   differencing `GC.GetAllocatedBytesForCurrentThread()`.
3. Print both totals (`:F2`) and the two verdict lines computed from
   `splitBytes` and `spanBytes`.
