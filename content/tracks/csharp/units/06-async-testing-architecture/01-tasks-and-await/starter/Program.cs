// A tiny build server: accept the job, then run restore -> compile -> publish.
Console.WriteLine("== Build server ==");

// 1. Write the step runner (bottom of the file):
//      static async Task<string> RunStep(string name, int ms)
//    It awaits Task.Delay(ms), then returns $"{name} done".
// 2. START the restore step (80 ms) WITHOUT awaiting it — store the
//    Task<string> in a variable. The task is running from that moment.
// 3. Print "job accepted" — it must appear while restore is still going.
// 4. Await the stored restore task and print its value.
// 5. Await + print compile (60 ms), then publish (40 ms) — in order:
//    each step depends on the one before it.
// 6. Print "build succeeded".
// Forbidden: Thread.Sleep, .Result, .Wait().
// Output:
//   == Build server ==
//   job accepted
//   restore done
//   compile done
//   publish done
//   build succeeded
