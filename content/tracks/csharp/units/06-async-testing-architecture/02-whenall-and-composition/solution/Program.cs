using System.Diagnostics;

Stopwatch sw = Stopwatch.StartNew();
Console.WriteLine("== Dashboard ==");
Console.WriteLine("fetching 3 feeds...");

Task<string> weather = Fetch("weather", "21C sunny", 120);
Task<string> news = Fetch("news", "3 headlines", 80);
Task<string> stocks = Fetch("stocks", "ACME +2.4%", 100);

string[] results = await Task.WhenAll(weather, news, stocks);
foreach (string result in results)
{
    Console.WriteLine(result);
}

Console.WriteLine($"concurrent: {sw.ElapsedMilliseconds < 250}");

static async Task<string> Fetch(string name, string payload, int ms)
{
    await Task.Delay(ms);
    return $"{name}: {payload}";
}
