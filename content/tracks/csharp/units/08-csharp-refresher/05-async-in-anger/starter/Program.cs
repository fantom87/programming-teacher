// Async in anger: the same three jobs sequentially, then concurrently.
// Banned: Thread.Sleep, .Result, .Wait(). The Stopwatch lines are wired —
// your code goes where the TODOs sit, so the measurements stay honest.

using System.Diagnostics;

var jobs = new (string Name, int Ms)[] { ("api", 140), ("cache", 40), ("db", 90) };
List<string> finished = new();

Console.WriteLine("-- sequential --");
var clock = Stopwatch.StartNew();
// TODO 1: loop over jobs, await FetchAsync(job.Name, job.Ms) ONE AT A TIME,
// printing each returned string. Order here is argument order: api, cache, db.
long sequentialMs = clock.ElapsedMilliseconds;

finished.Clear();
Console.WriteLine("-- concurrent --");
clock.Restart();
// TODO 2: start ALL three FetchAsync calls FIRST (no await yet), then
// await Task.WhenAll for the results array and print each result.
// WhenAll preserves argument order — but finished fills in completion order.
long concurrentMs = clock.ElapsedMilliseconds;

Console.WriteLine($"completed: {string.Join(", ", finished)}");
Console.WriteLine($"faster: {concurrentMs < sequentialMs}");

// TODO 3: await FlakyAsync() inside try/catch (InvalidOperationException ex)
// and print "caught: <message>".

// TODO: async Task<string> FetchAsync(string name, int ms) —
//   await Task.Delay(ms); record name in finished; return "<name> data".

// TODO: async Task<string> FlakyAsync() —
//   await Task.Delay(20); throw new InvalidOperationException("boom");
