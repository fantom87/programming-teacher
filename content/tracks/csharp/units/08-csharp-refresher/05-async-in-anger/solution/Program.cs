using System.Diagnostics;

var jobs = new (string Name, int Ms)[] { ("api", 140), ("cache", 40), ("db", 90) };
List<string> finished = new();

// Sequential: one at a time, argument order, cost = the sum of delays.
Console.WriteLine("-- sequential --");
var clock = Stopwatch.StartNew();
foreach (var (name, ms) in jobs)
{
    Console.WriteLine(await FetchAsync(name, ms));
}
long sequentialMs = clock.ElapsedMilliseconds;

finished.Clear();

// Concurrent: start everything, then await once — cost = the longest delay.
Console.WriteLine("-- concurrent --");
clock.Restart();
Task<string>[] tasks = jobs.Select(j => FetchAsync(j.Name, j.Ms)).ToArray();
string[] results = await Task.WhenAll(tasks);
foreach (string r in results)
{
    Console.WriteLine(r);
}
long concurrentMs = clock.ElapsedMilliseconds;

// Argument order above; completion order below — that's the proof it ran
// concurrently. And the speedup is measured, not asserted.
Console.WriteLine($"completed: {string.Join(", ", finished)}");
Console.WriteLine($"faster: {concurrentMs < sequentialMs}");

// The exception lives in the Task until the await re-throws it.
try
{
    Console.WriteLine(await FlakyAsync());
}
catch (InvalidOperationException ex)
{
    Console.WriteLine($"caught: {ex.Message}");
}

async Task<string> FetchAsync(string name, int ms)
{
    await Task.Delay(ms);
    finished.Add(name);
    return $"{name} data";
}

async Task<string> FlakyAsync()
{
    await Task.Delay(20);
    throw new InvalidOperationException("boom");
}
