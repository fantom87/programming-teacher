Console.WriteLine("launch the probe".Shout());
Console.WriteLine("a mission to the outer planets".Truncate(12));
Console.WriteLine("ok".Shout().Truncate(2));

static class StringExtensions
{
    public static string Shout(this string s)
    {
        return s.ToUpper() + "!";
    }

    public static string Truncate(this string s, int max)
    {
        if (s.Length <= max) return s;
        return s.Substring(0, max) + "...";
    }
}
