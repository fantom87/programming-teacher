// Command layer: one line of text in, one message out. It talks to the store;
// it never touches the Console. Every message is a normal return value —
// bad input is an answer, not an exception.

static class CommandRunner
{
    public static string Run(TaskStore store, string line)
    {
        string[] parts = line.Split(' ', 4);
        return parts[0] switch
        {
            "add" => Add(store, parts),
            "done" => Finish(store, parts),
            "drop" => Drop(store, parts),
            _ => $"unknown command: {parts[0]}",
        };
    }

    private static string Add(TaskStore store, string[] parts)
    {
        if (parts.Length < 4) return "usage: add <category> <priority> <title>";
        if (!Enum.TryParse(parts[2], out Priority priority)) return $"unknown priority: {parts[2]}";
        TaskItem created = store.Add(parts[3], parts[1], priority);
        return $"added #{created.Id} {created.Title} ({created.Category}/{created.Priority})";
    }

    private static string Finish(TaskStore store, string[] parts)
    {
        if (parts.Length < 2) return "usage: done <id>";
        if (!int.TryParse(parts[1], out int id)) return $"not a number: {parts[1]}";
        TaskItem? done = store.Complete(id);
        return done is null ? $"no task #{id}" : $"completed #{done.Id} {done.Title}";
    }

    private static string Drop(TaskStore store, string[] parts)
    {
        if (parts.Length < 2) return "usage: drop <id>";
        if (!int.TryParse(parts[1], out int id)) return $"not a number: {parts[1]}";
        TaskItem? gone = store.Remove(id);
        return gone is null ? $"no task #{id}" : $"removed #{gone.Id} {gone.Title}";
    }
}
