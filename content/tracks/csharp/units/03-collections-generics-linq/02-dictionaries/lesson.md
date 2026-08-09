---
id: 02-dictionaries
title: Dictionaries
language: csharp
runner: local
estMinutes: 14
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Build a Dictionary<string, int> stock counter: set three fruits, restock bananas by 8, then print the banana count, a ContainsKey check, a TryGetValue result, and the dictionary's Count."
docs: [csharp/collections]
checks:
  - id: dictionary-output
    type: stdout
    entry: Program.cs
    match: exact
    value: "13\nFalse\napple: 12\n3\n"
hints:
  - "Create with new Dictionary<string, int>(); then the indexer both writes and reads: stock[\"apple\"] = 12; later stock[\"apple\"] gives it back."
  - "Restocking is read-modify-write: stock[\"banana\"] = stock[\"banana\"] + 8;"
  - "TryGetValue shape: if (stock.TryGetValue(\"apple\", out int apples)) { Console.WriteLine($\"apple: {apples}\"); }"
---
## Labeled drawers

A `List<T>` finds things by *position*. But half the data in real programs is
looked up by *name*: a product's stock level, a user's score, a word's count.
For that, .NET gives you `Dictionary<TKey, TValue>` — a cabinet of labeled
drawers.

```csharp
Dictionary<string, int> stock = new Dictionary<string, int>();
stock["apple"] = 12;                  // create the drawer, put 12 in it
stock["apple"] = stock["apple"] - 2;  // read it, change it, store it back
Console.WriteLine(stock["apple"]);    // 10
```

Two type parameters this time: the key type and the value type. The indexer
`stock["apple"]` does double duty — assigning to a key that doesn't exist
*creates* the entry; assigning to one that does *overwrites* it.

Reading is the dangerous direction: `stock["durian"]` on a missing key
doesn't return zero — it **throws** a `KeyNotFoundException` and your program
dies. So dictionaries ship two safety tools:

```csharp
stock.ContainsKey("durian")                    // false — just asking
if (stock.TryGetValue("apple", out int n))     // fetch AND check, in one move
{
    Console.WriteLine(n);
}
```

`TryGetValue` is the idiom you'll see everywhere in professional C#: it
returns `true`/`false` for "was it there?", and smuggles the value out
through the `out` variable when it was. Check and fetch, one dictionary
lookup, no exception risk.

Like lists, dictionaries know their size — `stock.Count` is the number of
entries, not the sum of the values.

### Your goal

Run a fruit-stand stock counter that prints exactly:

```
13
False
apple: 12
3
```

1. Create a `Dictionary<string, int>` and set `apple` to 12, `banana` to 5,
   `cherry` to 30.
2. A delivery arrives: add 8 to the banana count, then print it.
3. Print `ContainsKey("durian")`.
4. Use `TryGetValue` to fetch `apple` and print `apple: 12` (label + value).
5. Print the dictionary's `Count`.
