# Collections

Collections hold groups of values. C# gives you a few core ones, each with a specialty.

## Arrays: fixed-size lists

```csharp
int[] scores = { 90, 75, 88 };

scores[0];          // 90 — positions start at 0
scores.Length;      // 3
scores[1] = 80;     // update an element
```

Arrays can't grow or shrink. That's usually a reason to reach for...

## List<T>: the everyday resizable list

The `<T>` means "of some type" — `List<string>` is a list of strings, and the compiler enforces it:

```csharp
var fruits = new List<string> { "apple", "banana" };

fruits.Add("cherry");           // grow
fruits.Remove("apple");         // shrink
fruits.Count;                   // 2
fruits.Contains("banana");      // true
fruits[0];                      // "banana"

fruits.Add(42);                 // Compile error — ints don't belong here
```

Looping works the same as arrays:

```csharp
foreach (var fruit in fruits)
{
    Console.WriteLine(fruit);
}
```

## Dictionary<TKey, TValue>: lookups by key

A dictionary maps keys to values — like a real dictionary maps words to definitions. Lookups are fast no matter how big it gets:

```csharp
var ages = new Dictionary<string, int>
{
    ["Alice"] = 30,
    ["Bob"] = 25,
};

ages["Alice"];              // 30
ages["Carol"] = 41;         // add or update

if (ages.TryGetValue("Dave", out int daveAge))   // safe lookup — no crash if missing
{
    Console.WriteLine(daveAge);
}

foreach (var (name, age) in ages)
{
    Console.WriteLine($"{name} is {age}");
}
```

Asking for a missing key with `ages["Dave"]` throws an exception — prefer `TryGetValue` when unsure.

## HashSet<T>: unique values only

```csharp
var visited = new HashSet<string>();
visited.Add("home");
visited.Add("home");        // ignored — already there
visited.Count;              // 1
visited.Contains("home");   // true, and very fast
```

## Which one, when?

- Ordered items, will grow/shrink → **List**
- Look things up by a key → **Dictionary**
- "Have I seen this before?" → **HashSet**
- Size fixed forever and known upfront → **array**

All of these work beautifully with LINQ — that's the next page.
