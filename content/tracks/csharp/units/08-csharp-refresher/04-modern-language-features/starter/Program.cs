// Modern C# drills. Five ideas, nine exact lines — every value computed.

// Drill 1 — records + with. p1 is seeded. Make p2 from p1 with Y = 9 (a
// `with` expression, NOT new Point) and p3 as a fresh Point(3, 4). Print:
//   p2: Point { X = 3, Y = 9 }     (records print themselves — interpolate p2)
//   same: True                     (p1 == p3 — value equality)
Point p1 = new(3, 4);

// Drill 2 — deconstruction. Split p2 into x and y, print their sum:
//   sum: 12

// Drill 3 — named tuples. Write (int Lo, int Hi) Bounds(int[] xs) using
// Min and Max, call it on new[] { 7, 2, 9, 4 }, deconstruct, and print:
//   lo 2 hi 9

// Drill 4 — property patterns. Write string Rate(Box b) as ONE switch
// expression: Kg > 20 "freight"; Size "S" "small parcel"; Size "M" with
// Kg <= 5 "standard"; otherwise "heavy". Loop the boxes printing
// "<Size> <Kg>kg -> <rate>".
List<Box> boxes = new()
{
    new("S", 0.5),
    new("M", 4),
    new("M", 12),
    new("L", 32),
};

// Drill 5 — extension method. Give string a Slug() extension —
// ToLowerInvariant, spaces to '-' — and print "Modern CSharp".Slug():
//   slug: modern-csharp

record Point(int X, int Y);
record Box(string Size, double Kg);

// Drill 5's static class goes here, after the records.
