---
id: 03-cancellation
title: "Cancellation Tokens"
language: csharp
runner: local
estMinutes: 16
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Thread a CancellationToken through an async download loop, cancel it mid-flight with CancelAfter, catch OperationCanceledException specifically, and clean up in finally."
docs: [csharp/async-await, csharp/exceptions]
checks:
  - id: cancelled-download
    type: stdout
    entry: Program.cs
    match: exact
    value: "== Downloader ==\nchunk 1 saved\nchunk 2 saved\ndownload cancelled\ncleanup: connection closed\ndone\n"
  - id: cooperative-cancellation
    type: ai-judge
    rubric: "A CancellationTokenSource is created (ideally with a using declaration) and CancelAfter(500) is called on it. Download is static async Task taking (int chunks, CancellationToken token), loops chunk 1..5, and passes the token into Task.Delay(200, token) — the worker itself contains no try/catch and never references the source, only the token. The caller awaits Download inside a try whose catch clause is specifically OperationCanceledException (not Exception or a bare catch) printing the cancelled line, with cleanup: connection closed printed from a finally block. The chunk N saved lines come from the loop's counter, not retyped literals."
hints:
  - "The plumbing: using CancellationTokenSource cts = new(); cts.CancelAfter(500); — then hand cts.Token (never cts itself) to the worker."
  - "The worker: static async Task Download(int chunks, CancellationToken token) { for (int i = 1; i <= chunks; i++) { await Task.Delay(200, token); Console.WriteLine($\"chunk {i} saved\"); } } — the token-aware Delay throws OperationCanceledException the moment cancel fires."
  - "The caller owns the reaction: try { await Download(5, cts.Token); Console.WriteLine(\"download complete\"); } catch (OperationCanceledException) { Console.WriteLine(\"download cancelled\"); } finally { Console.WriteLine(\"cleanup: connection closed\"); } — then print done."
---
## Pulling the plug politely

A task you can start but not stop is a liability — the user closed the
tab, the request timed out, the deploy was rolled back. .NET's answer is
**cooperative cancellation**: nobody kills a task from outside. Instead
you pass a `CancellationToken` down the call chain, and the work checks
it and quits at the next safe moment.

Two halves. The *owner* creates a `CancellationTokenSource` and decides
when to fire it; the *worker* receives only the source's `.Token` — it
can listen but never cancel anyone else:

```csharp
using CancellationTokenSource cts = new();
cts.CancelAfter(500);                   // or cts.Cancel() on a button press
await Download(5, cts.Token);
```

The worker's job is to keep the token flowing. Every well-behaved async
API in .NET accepts one — and `Task.Delay(200, token)` is the pattern in
miniature: if the token fires mid-delay, the delay stops *immediately*
and throws **`OperationCanceledException`**. Long compute loops without
awaits use `token.ThrowIfCancellationRequested()` instead — same
exception, checked by hand.

That exception is not an error; it's the agreed signal that work stopped
on request. So you catch it *specifically* — `catch
(OperationCanceledException)` — and treat it as an outcome. A bare
`catch (Exception)` would lump "the user cancelled" together with "the
disk is on fire," and you've learned better. Cleanup that must happen
either way — closing connections, deleting half-written files — goes in
`finally`, which runs whether the download finished, cancelled, or blew
up.

Your downloader saves five 200 ms chunks, but the source is wired to
cancel at 500 ms: chunks 1 and 2 land, chunk 3's delay is cut short, and
the exception surfaces at the `await`. Two saved chunks, one clean
cancellation, cleanup guaranteed. That's the whole protocol.

### Your goal

Produce exactly:

```
== Downloader ==
chunk 1 saved
chunk 2 saved
download cancelled
cleanup: connection closed
done
```

1. Create the source with a `using` declaration and `CancelAfter(500)`.
2. Write `Download(int chunks, CancellationToken token)` — a 1-to-5
   loop of `Task.Delay(200, token)` then `chunk {i} saved`. No
   try/catch inside.
3. Await it in a `try`; catch `OperationCanceledException` to print
   `download cancelled`; print the cleanup line from `finally`.
4. End with `done`.
