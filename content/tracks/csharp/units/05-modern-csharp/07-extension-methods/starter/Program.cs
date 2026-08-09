// 1. At the bottom of the file, declare:  static class StringExtensions
//    with TWO extension methods (note the `this` on the first parameter):
//      public static string Shout(this string s)
//          -> the string uppercased, with "!" appended
//      public static string Truncate(this string s, int max)
//          -> s unchanged if it fits within max, else the first max chars + "..."
// 2. Call them INSTANCE-style (that's the whole point):
//      "launch the probe".Shout()
//      "a mission to the outer planets".Truncate(12)
//      "ok".Shout().Truncate(2)        <- chaining, just like LINQ
//    Print each result.
