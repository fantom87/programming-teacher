// Drill 1 — records + with expression + value equality.
Point p1 = new(3, 4);
Point p2 = p1 with { Y = 9 };
Point p3 = new(3, 4);
Console.WriteLine($"p2: {p2}");
Console.WriteLine($"same: {p1 == p3}");

// Drill 2 — deconstruction.
var (x, y) = p2;
Console.WriteLine($"sum: {x + y}");

// Drill 3 — named tuple return, deconstructed at the call site.
var (lo, hi) = Bounds(new[] { 7, 2, 9, 4 });
Console.WriteLine($"lo {lo} hi {hi}");

// Drill 4 — one switch expression, property patterns, greedy arm first.
List<Box> boxes = new()
{
    new("S", 0.5),
    new("M", 4),
    new("M", 12),
    new("L", 32),
};
foreach (Box b in boxes)
{
    Console.WriteLine($"{b.Size} {b.Kg}kg -> {Rate(b)}");
}

// Drill 5 — extension method.
Console.WriteLine($"slug: {"Modern CSharp".Slug()}");

(int Lo, int Hi) Bounds(int[] xs) => (xs.Min(), xs.Max());

string Rate(Box b) => b switch
{
    { Kg: > 20 } => "freight",
    { Size: "S" } => "small parcel",
    { Size: "M", Kg: <= 5 } => "standard",
    _ => "heavy",
};

record Point(int X, int Y);
record Box(string Size, double Kg);

static class StringExtensions
{
    public static string Slug(this string s) => s.ToLowerInvariant().Replace(' ', '-');
}
