---
id: 08-query-syntax-and-deferred-execution
title: Query Syntax and Deferred Execution
language: csharp
runner: local
estMinutes: 18
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Write one query in query syntax (from / where / orderby / select), run it, add an item to the source list, then run the SAME query again to watch deferred execution pick up the change."
docs: [csharp/linq-basics]
checks:
  - id: deferred-output
    type: stdout
    entry: Program.cs
    match: exact
    value: "ASTEROID\nORBIT\nPLANETARY\n--- after adding comet ---\nASTEROID\nCOMET\nORBIT\nPLANETARY\n4\n"
  - id: one-deferred-query
    type: ai-judge
    rubric: "Exactly one query is built, using query syntax (from ... in ... where ... orderby ... select ...), stored in a variable without ToList()/ToArray(), and defined BEFORE \"comet\" is added to the source list. Both foreach loops enumerate that same query variable — the second set of results comes from re-running the original query after the list changed, not from building a second query or filtering manually. The final count uses Count() on the query variable."
hints:
  - "Query shape: var longWords = from w in words where w.Length > 4 orderby w select w.ToUpper();"
  - "Don't call ToList() — the variable must stay a live query, not a snapshot."
  - "After words.Add(\"comet\") and the divider line, foreach over longWords again — the SAME variable — then print longWords.Count()."
---
## A question, not an answer

LINQ has a second outfit. **Query syntax** expresses the same operators in
SQL-flavored keywords the compiler translates to the methods you already
know:

```csharp
var longWords = from w in words
                where w.Length > 4
                orderby w
                select w.ToUpper();
```

`from` names each element, `where` is `Where`, `orderby` is `OrderBy`,
`select` is `Select`. Same power, different reading experience — for
multi-clause queries, many C# developers find this easier to scan. Both
syntaxes are professional C#; you should be able to read each.

Now the concept that surprises everyone once: that variable does **not**
hold results. It holds *the question* — a stored plan that only executes
when something enumerates it, like a `foreach` or `Count()`. This is
**deferred execution**, and you can prove it:

```csharp
var query = from n in numbers where n > 10 select n;
numbers.Add(99);                 // change the source AFTER building the query
foreach (int n in query) { }     // runs NOW — and it sees 99
```

The query re-reads its source every time it runs. Enumerate it twice and the
work happens twice, possibly with different answers. That's a feature —
define once, always fresh — and a trap: three `foreach` loops over one query
means three full passes over the data. When you want the answer frozen,
`query.ToList()` executes it once and snapshots the results into a plain
list.

Today: prove deferral to yourself with your own eyes.

### Your goal

Produce exactly:

```
ASTEROID
ORBIT
PLANETARY
--- after adding comet ---
ASTEROID
COMET
ORBIT
PLANETARY
4
```

1. In **query syntax**, build `longWords`: words longer than 4 letters,
   ordered alphabetically, selected as `.ToUpper()`. No `ToList()`.
2. `foreach`-print it.
3. `Add` `"comet"` to `words`, print the divider `--- after adding comet ---`.
4. `foreach`-print the **same** `longWords` variable again, then print
   `longWords.Count()`.
