// Slug.Slugify (bottom of file) turns titles into URL slugs — and it has a
// bug. Your tests will find it. The runner below is dotnet test in miniature:
// each entry runs, a thrown assertion means FAIL, and the tally prints last.
Console.WriteLine("== Test run ==");

(string Name, Action Test)[] tests =
{
    // 1. Write three fact-style test methods (below the runner) and
    //    register each one here as ("Slugify_Lowercases", Slugify_Lowercases):
    //      Slugify_Lowercases            "Hello"           -> "hello"
    //      Slugify_HyphenatesSpaces      "hello world"     -> "hello-world"
    //      Slugify_CollapsesExtraSpaces  "  big   sale  "  -> "big-sale"
    //    Each: arrange the input, act (ONE Slugify call), assert with
    //    AssertEqual and a hand-written literal expectation.
};

int passed = 0, failed = 0;
foreach ((string name, Action test) in tests)
{
    try { test(); Console.WriteLine($"PASS {name}"); passed++; }
    catch (Exception e) { Console.WriteLine($"FAIL {name}: {e.Message}"); failed++; }
}
Console.WriteLine($"{passed} passed, {failed} failed");

// 2. Run. One test should FAIL — the bug is real. Fix Slugify so runs of
//    spaces collapse (Split + StringSplitOptions.RemoveEmptyEntries, then
//    string.Join) and rerun until everything is green.
// Output when green:
//   == Test run ==
//   PASS Slugify_Lowercases
//   PASS Slugify_HyphenatesSpaces
//   PASS Slugify_CollapsesExtraSpaces
//   3 passed, 0 failed

static void AssertEqual(string expected, string actual)
{
    if (expected != actual) throw new Exception($"expected \"{expected}\", got \"{actual}\"");
}

static class Slug
{
    public static string Slugify(string title)
        => title.Trim().ToLower().Replace(" ", "-");   // the bug lives here
}
