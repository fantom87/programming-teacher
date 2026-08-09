using System.Diagnostics;

// A dashboard pulls three independent feeds. Sequential awaits would cost
// 120 + 80 + 100 ms; started together they cost about the slowest one.
Stopwatch sw = Stopwatch.StartNew();
Console.WriteLine("== Dashboard ==");
Console.WriteLine("fetching 3 feeds...");

// 1. Write the fetcher (bottom of the file):
//      static async Task<string> Fetch(string name, string payload, int ms)
//    It awaits Task.Delay(ms), then returns $"{name}: {payload}".
// 2. Start ALL THREE fetches before any await — three Task<string> variables:
//      weather: "21C sunny"  (120 ms)
//      news:    "3 headlines" (80 ms)
//      stocks:  "ACME +2.4%" (100 ms)
// 3. Collect with ONE await:
//      string[] results = await Task.WhenAll(weather, news, stocks);
//    and print each result — the array is in ARGUMENT order, not finish order.
// 4. Prove it ran concurrently:
//      Console.WriteLine($"concurrent: {sw.ElapsedMilliseconds < 250}");
// Output:
//   == Dashboard ==
//   fetching 3 feeds...
//   weather: 21C sunny
//   news: 3 headlines
//   stocks: ACME +2.4%
//   concurrent: True
