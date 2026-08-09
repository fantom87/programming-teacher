// Reporting layer: a store in, finished lines out. Returning the lines instead
// of printing them keeps this testable — and keeps Console.WriteLine in one file.

static class Report
{
    public static IReadOnlyList<string> Lines(TaskStore store)
    {
        List<string> lines = new List<string> { "by category:" };

        int width = store.All.Max(t => t.Category.Length);
        foreach (IGrouping<string, TaskItem> group in store.All.GroupBy(t => t.Category).OrderBy(g => g.Key))
        {
            lines.Add($"  {group.Key.PadRight(width)}  {group.Count(t => t.Done)}/{group.Count()} done");
        }

        TaskItem? next = store.All
            .Where(t => !t.Done)
            .OrderByDescending(t => t.Priority)
            .ThenBy(t => t.Id)
            .FirstOrDefault();
        lines.Add(next is null
            ? "next up: nothing — the board is clear"
            : $"next up: #{next.Id} {next.Title} ({next.Category}/{next.Priority})");

        int percent = store.Count == 0 ? 0 : store.DoneCount * 100 / store.Count;
        int filled = percent / 10;
        lines.Add($"progress: [{new string('#', filled)}{new string('-', 10 - filled)}] {percent}%");

        return lines;
    }
}
