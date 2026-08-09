// Command layer: one line of text in, one message out. It talks to the store;
// it never touches the Console.

// TODO Part 1 — harden the three helpers. Today's script feeds them junk:
//   "done abc"                -> "not a number: abc"      (int.TryParse)
//   "add code Urgent Ship it" -> "unknown priority: Urgent" (Enum.TryParse)
//   "add code"                -> "usage: add <category> <priority> <title>"
//   Guard the length BEFORE touching parts[1] or parts[3], and give drop the
//   same treatment as done ("usage: drop <id>"). No try/catch: a typo isn't
//   exceptional, it's an answer.

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
        TaskItem created = store.Add(parts[3], parts[1], Enum.Parse<Priority>(parts[2]));
        return $"added #{created.Id} {created.Title} ({created.Category}/{created.Priority})";
    }

    private static string Finish(TaskStore store, string[] parts)
    {
        int id = int.Parse(parts[1]);
        TaskItem? done = store.Complete(id);
        return done is null ? $"no task #{id}" : $"completed #{done.Id} {done.Title}";
    }

    private static string Drop(TaskStore store, string[] parts)
    {
        int id = int.Parse(parts[1]);
        TaskItem? gone = store.Remove(id);
        return gone is null ? $"no task #{id}" : $"removed #{gone.Id} {gone.Title}";
    }
}
