Directory.CreateDirectory("notes");
string path = Path.Combine("notes", "journal.txt");

File.WriteAllText(path, "Day 1: read the csproj\n");
File.AppendAllText(path, "Day 2: tamed the CLI\n");

string[] entries = File.ReadAllLines(path);
foreach (string entry in entries)
{
    Console.WriteLine(entry);
}
Console.WriteLine($"{entries.Length} entries on disk");
Console.WriteLine(File.Exists(path));
