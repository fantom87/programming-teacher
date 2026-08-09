string[] scans = { "ada", "grace", "ada", "linus", "grace", "ada" };

HashSet<string> visitors = new HashSet<string>();
foreach (string name in scans)
{
    visitors.Add(name);
}

Console.WriteLine($"{scans.Length} scans, {visitors.Count} unique visitors");
Console.WriteLine(visitors.Contains("grace"));
Console.WriteLine(visitors.Contains("brad"));

bool added = visitors.Add("ada");
Console.WriteLine(added);
