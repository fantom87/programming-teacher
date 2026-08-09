---
id: 07-nullable-reference-types
title: Nullable Reference Types
language: csharp
runner: local
estMinutes: 18
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Write FindEmail returning string? — null for missing — and a caller that handles it with ?? and is-not-null, keeping the compiler's null warnings clean without a single !."
docs: [csharp/types-and-variables, csharp/methods]
checks:
  - id: lookup-report
    type: stdout
    entry: Program.cs
    match: exact
    value: "ada -> ada@algorithms.dev\nlinus -> no email on file\ngrace -> grace@navy.mil\nFound 2 of 3\n"
  - id: honest-nullability
    type: ai-judge
    rubric: "FindEmail is declared with return type string? and returns null on a miss — never an empty string and never the fallback message; the \"no email on file\" text lives at the call site, supplied with the ?? operator. The lookup uses TryGetValue. The caller counts hits with an `is not null` (or != null) check, and the Found line is computed from that count and the array's Length. The null-forgiving operator ! is not used anywhere."
hints:
  - "static string? FindEmail(Dictionary<string, string> book, string name) — that ? on the return type is the lesson: this method may hand back nothing, and the compiler now makes every caller deal with it."
  - "Body: if (book.TryGetValue(name, out string? email)) { return email; } return null;"
  - "Caller: string? email = FindEmail(book, name); if (email is not null) { found++; } Console.WriteLine($\"{name} -> {email ?? \"no email on file\"}\");"
---
## The billion-dollar question mark

Every reference type in C# has a dirty secret: a `string` variable might
hold text — or `null`, and touching a member on null detonates a
`NullReferenceException` at runtime. Sir Tony Hoare, who invented null
references in 1965, calls them his "billion-dollar mistake" — and C#'s
answer is the `<Nullable>enable</Nullable>` line you read out of your own
csproj in lesson 1. That switch makes the *type system* track the danger:

```csharp
string title = null;    // warning — title promised it would never be null
string? maybe = null;   // fine — the ? declares "null is a legal value here"
```

Plain `string` now means *never null*; `string?` means *maybe*. The
compiler follows your code's flow (**null-state analysis**) and warns
wherever a maybe-null gets used without being checked. These are warnings,
not errors — the program still builds — but professionals read them like
failing tests, and today your job includes keeping them at zero.

The toolkit for living with `?` is small and elegant:

```csharp
if (email is not null) { ... }        // prove it, then use it freely
Console.WriteLine(email ?? "none");   // ?? supplies a fallback when null
```

— plus the `!` you met in lesson 5 ("trust me, compiler"), which today is
banned: earning a clean build beats asserting one.

The deeper skill is *API design*. `FindEmail` below returns `string?`,
where `null` means "not found" — and notice what it does **not** return:
the text `no email on file`. Methods report facts; presentation belongs to
the caller. .NET is full of this shape — `TryGetValue` is the same idea
wearing different clothes.

### Your goal

Print exactly:

```
ada -> ada@algorithms.dev
linus -> no email on file
grace -> grace@navy.mil
Found 2 of 3
```

1. Write `static string? FindEmail(Dictionary<string, string> book,
   string name)` — `TryGetValue`, return the email or `null`.
2. Loop the starter's `names`; print each as `name -> email`, using `??`
   to supply `no email on file`.
3. Count hits with `is not null`; close with `Found {found} of
   {names.Length}`.
4. No `!` anywhere — the warnings should read clean on their own.
