Console.WriteLine("== Test run ==");

(string Name, Action Test)[] tests =
{
    ("Slugify_Lowercases", Slugify_Lowercases),
    ("Slugify_HyphenatesSpaces", Slugify_HyphenatesSpaces),
    ("Slugify_CollapsesExtraSpaces", Slugify_CollapsesExtraSpaces),
};

int passed = 0, failed = 0;
foreach ((string name, Action test) in tests)
{
    try { test(); Console.WriteLine($"PASS {name}"); passed++; }
    catch (Exception e) { Console.WriteLine($"FAIL {name}: {e.Message}"); failed++; }
}
Console.WriteLine($"{passed} passed, {failed} failed");

static void Slugify_Lowercases()
{
    string title = "Hello";                     // arrange
    string slug = Slug.Slugify(title);          // act
    AssertEqual("hello", slug);                 // assert
}

static void Slugify_HyphenatesSpaces()
{
    string title = "hello world";
    string slug = Slug.Slugify(title);
    AssertEqual("hello-world", slug);
}

static void Slugify_CollapsesExtraSpaces()
{
    string title = "  big   sale  ";
    string slug = Slug.Slugify(title);
    AssertEqual("big-sale", slug);
}

static void AssertEqual(string expected, string actual)
{
    if (expected != actual) throw new Exception($"expected \"{expected}\", got \"{actual}\"");
}

static class Slug
{
    public static string Slugify(string title)
        => string.Join("-", title.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries));
}
