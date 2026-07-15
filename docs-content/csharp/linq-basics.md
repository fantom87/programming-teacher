# LINQ basics

**LINQ** (Language Integrated Query) lets you ask questions of collections — filter, transform, sort, summarize — in readable chains instead of hand-written loops.

Add `using System.Linq;` (modern projects include it automatically).

## The core trio

```csharp
var numbers = new List<int> { 5, 1, 8, 3, 9, 2 };

// Where: keep items that pass a test (like a sieve)
var big = numbers.Where(n => n > 4);          // 5, 8, 9

// Select: transform every item
var doubled = numbers.Select(n => n * 2);     // 10, 2, 16, 6, 18, 4

// OrderBy: sort
var sorted = numbers.OrderBy(n => n);         // 1, 2, 3, 5, 8, 9
```

The `n => n > 4` part is a **lambda** — a tiny inline function: "given n, is n greater than 4?"

## Chaining: where LINQ shines

Real queries read like a sentence:

```csharp
var players = new List<Player>
{
    new("Alice", 92), new("Bob", 45), new("Carol", 78),
};

var topNames = players
    .Where(p => p.Score >= 60)        // passing players...
    .OrderByDescending(p => p.Score)  // best first...
    .Select(p => p.Name)              // just their names
    .ToList();                        // ["Alice", "Carol"]
```

## Single answers

```csharp
numbers.Count();                 // 6
numbers.Count(n => n > 4);       // 3 — count matching a test
numbers.Sum();                   // 28
numbers.Average();               // 4.66...
numbers.Max();                   // 9
numbers.First();                 // 5 (throws if empty)
numbers.FirstOrDefault();        // 5, or 0 if the list is empty
numbers.Any(n => n > 8);         // true — is there at least one?
numbers.All(n => n > 0);         // true — do they all pass?
```

## Laziness: queries run when you ask for results

`Where` and `Select` don't do the work immediately — they build a *description* of the query. It executes when you loop over it or call `ToList()`:

```csharp
var query = numbers.Where(n => n > 4);   // nothing has happened yet
numbers.Add(100);
var results = query.ToList();            // runs NOW — includes 100!
```

When you want a snapshot, end with `.ToList()`.

## The mindset shift

Instead of "make an empty list, loop, if-check, add" — say *what* you want: "the names of players scoring 60+, best first." LINQ handles the *how*.
