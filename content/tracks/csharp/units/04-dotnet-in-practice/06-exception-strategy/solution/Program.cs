string[] rows = File.ReadAllLines("scores.txt");
int total = 0;
int imported = 0;

foreach (string row in rows)
{
    string[] parts = row.Split(',');
    string name = parts[0];
    try
    {
        int score = int.Parse(parts[1]);
        total += score;
        imported++;
        Console.WriteLine($"Imported {name}: {score}");
    }
    catch (FormatException)
    {
        Console.WriteLine($"Skipped {name}: not a number");
    }
}

Console.WriteLine($"Team total: {total} ({imported} of {rows.Length} rows)");
