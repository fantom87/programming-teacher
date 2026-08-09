---
id: 06-dotnet-tooling-and-testing
title: .NET Tooling and Testing
language: csharp
runner: local
estMinutes: 20
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Write three xUnit-shaped tests against a finished Price.Total — a plain fact, a data-driven theory looping InlineData-style cases, and an Assert.Throws-style exception test — through the starter's Check harness."
docs: [csharp/dotnet-cli, csharp/nuget-basics, csharp/exceptions]
checks:
  - id: test-run-output
    type: stdout
    entry: Program.cs
    match: exact
    value: "PASS Total_multiplies_unit_by_qty\nPASS coupon_SAVE10\nPASS coupon_HALF\nPASS coupon_BOGUS\nPASS Total_rejects_negative_qty\n5 passed, 0 failed\n"
  - id: real-test-shape
    type: ai-judge
    rubric: "The Check harness, the Price class, and the driver block are unmodified. Total_multiplies_unit_by_qty follows arrange-act-assert: it calls Price.Total with a unit price and quantity and passes a COMPUTED-or-obviously-derived expected value to Check.Equal — it does not call Total twice and compare Total to itself. Total_applies_coupons is data-driven in the [Theory]/[InlineData] shape: a loop over a collection of (coupon, expected) cases — including SAVE10, HALF, and an unknown coupon expecting full price — each iteration calling Price.Total once and Check.Equal with a name like coupon_<name>; three near-identical copy-pasted asserts instead of a loop fails this rubric. Total_rejects_negative_qty approximates Assert.Throws: it calls Price.Total with a negative qty inside try, reports failure via Check.True(false, ...) if the call returns, and reports success in a catch clause typed ArgumentOutOfRangeException — not bare Exception. No test prints PASS/FAIL directly; all results flow through Check."
hints:
  - "A fact is arrange-act-assert in three lines: Check.Equal(30.00m, Price.Total(6.00m, 5), \"Total_multiplies_unit_by_qty\"); — expected first, actual second, exactly like xUnit's Assert.Equal."
  - "The theory is one loop: foreach (var (coupon, expected) in new[] { (\"SAVE10\", 90.00m), (\"HALF\", 50.00m), (\"BOGUS\", 100.00m) }) { Check.Equal(expected, Price.Total(10.00m, 10, coupon), $\"coupon_{coupon}\"); }"
  - "Assert.Throws by hand: try { Price.Total(10.00m, -1); Check.True(false, \"Total_rejects_negative_qty\"); } catch (ArgumentOutOfRangeException) { Check.True(true, \"Total_rejects_negative_qty\"); } — the Check.True(false, ...) line is what catches a SUT that forgot to throw."
---
## The test reflex

Real .NET testing is a separate project — `dotnet new xunit`, a
`PackageReference` pulled from NuGet, `dotnet test` discovering
attributes:

```csharp
[Fact]
public void Total_multiplies_unit_by_qty()
    => Assert.Equal(30.00m, Price.Total(6.00m, 5));

[Theory]
[InlineData("SAVE10", 90.00)]
public void Applies_coupons(string c, decimal want) { /* ... */ }

Assert.Throws<ArgumentOutOfRangeException>(() => Price.Total(10m, -1));
```

Our runner can't restore NuGet packages, so the starter ships a
four-line `Check` harness that plays Assert; **the shapes you drill are
xUnit's own**:

- **Fact** — one scenario, arrange-act-assert, expected value *first*.
- **Theory** — one test body, many `InlineData` rows; here, a loop over
  case tuples, one named result per row.
- **Exception test** — the call *must* throw the *specific* type;
  if it returns normally, that's a failure you assert explicitly.

Test names state behavior (`Total_rejects_negative_qty`), and every
expected value is precomputed by you — never by calling the code under
test twice.

### Your goal

`Price.Total` is finished. Write the three test methods the driver
already calls, producing exactly:

```
PASS Total_multiplies_unit_by_qty
PASS coupon_SAVE10
PASS coupon_HALF
PASS coupon_BOGUS
PASS Total_rejects_negative_qty
5 passed, 0 failed
```

A fact, a three-row theory (`SAVE10` 90.00, `HALF` 50.00, `BOGUS` full
price on a 100.00 order), and a throws-test for negative quantity.
Harness, `Price`, and driver stay untouched.
