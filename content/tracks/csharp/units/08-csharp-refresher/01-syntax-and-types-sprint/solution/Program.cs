// Drill 1 — types + formatted interpolation.
double hours = 7.25;
int rate = 40;
Console.WriteLine($"pay: {hours * rate:F2}");

// Drill 2 — TryParse, never Parse.
foreach (string raw in new[] { "42", "4x" })
{
    int value = int.TryParse(raw, out int parsed) ? parsed : -1;
    Console.WriteLine($"parse {raw} -> {value}");
}

// Drill 3 — integer vs promoted division.
int a = 7, b = 2;
Console.WriteLine($"int: {a / b}");
Console.WriteLine($"cast: {(double)a / b}");

// Drill 4 — relational switch expression.
foreach (int score in new[] { 91, 84, 70, 12 })
{
    Console.WriteLine($"{score} -> {Grade(score)}");
}

// Drill 5 — default + named arguments.
Console.WriteLine(Tag("refresher"));
Console.WriteLine(Tag("drill", prefix: "unit"));

// Drill 6 — null-coalescing.
int? maybe = null;
Console.WriteLine($"maybe: {maybe ?? -1}");

string Grade(int score) => score switch
{
    >= 90 => "A",
    >= 80 => "B",
    >= 70 => "C",
    _ => "F",
};

string Tag(string name, string prefix = "cs") => $"{prefix}:{name}";
