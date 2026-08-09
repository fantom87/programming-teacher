List<int> temps = new List<int> { 18, 24, 31, 15, 28, 35, 22 };

var warm = temps.Where(t => t >= 25);
foreach (int t in warm)
{
    Console.WriteLine(t);
}

var labels = temps
    .Where(t => t >= 25)
    .OrderBy(t => t)
    .Select(t => $"{t}C");

foreach (string label in labels)
{
    Console.WriteLine(label);
}
