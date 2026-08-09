List<string> tasks = new List<string> { "Email Dana", "Fix login bug", "Water plants" };

tasks.Add("Compile report");
tasks.Remove("Water plants");

Console.WriteLine(tasks.Count);
Console.WriteLine(tasks.Contains("Fix login bug"));

tasks.Sort();
foreach (string task in tasks)
{
    Console.WriteLine(task);
}
