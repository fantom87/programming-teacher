// Reporting layer: a store in, finished lines out. Returning the lines instead
// of printing them keeps this testable — and keeps Console.WriteLine in one file.

static class Report
{
    // TODO Part 2 — public static IReadOnlyList<string> Lines(TaskStore store)
    //   Build a List<string> starting with "by category:", then:
    //
    //   1. one line per category, alphabetical, padded to the longest name:
    //        "  code      1/2 done"      <- "  " + Key.PadRight(width) + "  "
    //      GroupBy(t => t.Category).OrderBy(g => g.Key); the numbers are
    //      group.Count(t => t.Done) and group.Count().
    //   2. "next up: #4 Wire persistence (code/Medium)" — the open task with
    //      the highest Priority, ties broken by lowest Id (OrderByDescending
    //      then ThenBy, FirstOrDefault). Empty board -> say so instead.
    //   3. "progress: [######----] 60%" — DoneCount * 100 / Count, then a bar
    //      of ten characters, one '#' per completed 10%.
}
