// C# refresher, sprint 1 of 6. Six micro-drills, twelve exact lines.
// Everything is computed — no literal answers inside output strings.

// Drill 1 — done for you: types + formatted interpolation.
double hours = 7.25;
int rate = 40;
Console.WriteLine($"pay: {hours * rate:F2}");

// Drill 2 — parsing. For "42" and then "4x", print the parsed value or -1:
//   parse 42 -> 42
//   parse 4x -> -1
//   int.TryParse with an out variable and ?: — no try/catch, no int.Parse.
//   (A loop over new[] { "42", "4x" } keeps it to one TryParse.)

// Drill 3 — division. With int a = 7, b = 2 print:
//   int: 3          (integer division truncates)
//   cast: 3.5       (cast ONE operand to double)

// Drill 4 — switch expression. Write Grade(int) with relational patterns:
//   >= 90 "A", >= 80 "B", >= 70 "C", otherwise "F".
//   Loop over the scores 91, 84, 70, 12 printing "<score> -> <grade>".

// Drill 5 — default + named arguments. Write
//   string Tag(string name, string prefix = "cs") => "<prefix>:<name>"
//   Print Tag("refresher"), then Tag("drill", prefix: "unit").

// Drill 6 — null handling. Declare int? maybe = null and print:
//   maybe: -1       (null-coalescing ??, no if)
