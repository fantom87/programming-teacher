---
id: 05-testing-with-xunit
title: "Testing with xUnit"
language: csharp
runner: local
estMinutes: 18
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Write three fact-style unit tests for a slug generator — arrange, act, assert with expected literals — watch one expose a real bug, and fix Slugify to go green."
docs: [csharp/dotnet-cli, csharp/exceptions]
checks:
  - id: green-run
    type: stdout
    entry: Program.cs
    match: exact
    value: "== Test run ==\nPASS Slugify_Lowercases\nPASS Slugify_HyphenatesSpaces\nPASS Slugify_CollapsesExtraSpaces\n3 passed, 0 failed\n"
  - id: real-facts
    type: ai-judge
    rubric: "Three parameterless static test methods exist named Slugify_Lowercases, Slugify_HyphenatesSpaces, and Slugify_CollapsesExtraSpaces, each arrange-act-assert shaped: an input (\"Hello\", \"hello world\", and \"  big   sale  \" or equivalent multi-space input), one call to Slug.Slugify, then AssertEqual with the EXPECTED value written as a literal (\"hello\", \"hello-world\", \"big-sale\") — never computed by calling Slugify again or by reusing its output as the expectation. All three are registered in the tests tuple array the runner iterates. Slug.Slugify has been fixed to collapse runs of spaces — Split with StringSplitOptions.RemoveEmptyEntries joined with \"-\" (or an equivalent regex) — instead of the buggy Replace(\" \", \"-\"), and Slugify still lowercases. The runner loop and AssertEqual are unmodified."
hints:
  - "A fact is just a method with an opinion: static void Slugify_HyphenatesSpaces() { string slug = Slug.Slugify(\"hello world\"); AssertEqual(\"hello-world\", slug); } — register it in the array as (\"Slugify_HyphenatesSpaces\", Slugify_HyphenatesSpaces)."
  - "Write the expected value as a LITERAL you worked out by hand. If the test computes its expectation from the code under test, it can never disagree with it — that's a tautology, not a test."
  - "The collapse test fails against Replace(\" \", \"-\") — \"  big   sale  \" becomes \"big---sale\"-ish garbage. Fix: string.Join(\"-\", title.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries));"
---
## Facts, not hopes

Professional C# tests live in an **xUnit** project — `dotnet new xunit`,
a class per subject, and every test is a public method tagged `[Fact]`:

```csharp
[Fact]
public void Slugify_HyphenatesSpaces()
{
    string slug = Slug.Slugify("hello world");   // arrange + act
    Assert.Equal("hello-world", slug);           // assert
}
```

`dotnet test` finds every `[Fact]`, runs each in isolation, and reports
PASS/FAIL per method. The assertion vocabulary reads the same way:
`Assert.Equal(expected, actual)`, `Assert.True`, `Assert.Contains`,
`Assert.Throws<T>` — expected first, a failure message with both values
when they disagree.

Our runner can't install packages, so today you'll run the same idea
with the machinery visible: an `AssertEqual` that throws on mismatch,
and a loop that calls each registered test, catching the throw to print
`FAIL` with the message. That loop *is* `dotnet test` in eight lines —
once you've built it, xUnit holds no mysteries, just attributes.

The craft transfers exactly:

- **Name the scenario.** `Slugify_CollapsesExtraSpaces` tells you what
  broke from the name alone; `Test3` tells you nothing.
- **Arrange, act, assert** — set up input, call the code once, compare
  against an expectation.
- **Expected values are literals you worked out by hand.** Write
  `AssertEqual(Slug.Slugify("x"), Slug.Slugify("x"))` and you've built a
  tautology — a test that passes *because* the code is the code, bug
  and all.

That last rule pays off immediately: the starter's `Slugify` handles
`"Hello"` and `"hello world"` fine, but feed it `"  big   sale  "` and
its naive `Replace(" ", "-")` mints a slug full of doubled hyphens. Your
third test states the slug that *should* come out — `"big-sale"` — and
goes red until you fix the implementation. That red-then-green moment is
the entire point of testing.

### Your goal

Produce exactly:

```
== Test run ==
PASS Slugify_Lowercases
PASS Slugify_HyphenatesSpaces
PASS Slugify_CollapsesExtraSpaces
3 passed, 0 failed
```

1. Write the three fact-style methods — `"Hello"` → `"hello"`,
   `"hello world"` → `"hello-world"`, `"  big   sale  "` →
   `"big-sale"` — each arrange/act/assert with a literal expectation.
2. Register all three in the `tests` array.
3. Run, watch the collapse test fail, and fix `Slugify` (Split +
   `RemoveEmptyEntries` + Join) until the run is green.
