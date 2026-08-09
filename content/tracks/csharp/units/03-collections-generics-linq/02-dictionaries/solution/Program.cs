Dictionary<string, int> stock = new Dictionary<string, int>();
stock["apple"] = 12;
stock["banana"] = 5;
stock["cherry"] = 30;

stock["banana"] = stock["banana"] + 8;
Console.WriteLine(stock["banana"]);

Console.WriteLine(stock.ContainsKey("durian"));

if (stock.TryGetValue("apple", out int apples))
{
    Console.WriteLine($"apple: {apples}");
}

Console.WriteLine(stock.Count);
