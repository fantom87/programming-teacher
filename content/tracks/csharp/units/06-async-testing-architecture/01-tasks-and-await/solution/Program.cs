Console.WriteLine("== Build server ==");

Task<string> restoring = RunStep("restore", 80);   // started, not awaited
Console.WriteLine("job accepted");                 // prints while restore runs

Console.WriteLine(await restoring);
Console.WriteLine(await RunStep("compile", 60));
Console.WriteLine(await RunStep("publish", 40));
Console.WriteLine("build succeeded");

static async Task<string> RunStep(string name, int ms)
{
    await Task.Delay(ms);
    return $"{name} done";
}
