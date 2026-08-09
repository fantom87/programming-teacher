// Command layer: one line of text in, one message out. It talks to the store;
// it never touches the Console.

static class CommandRunner
{
    // TODO Part 2 — public static string Run(TaskStore store, string line)
    //   string[] parts = line.Split(' ', 4);   // "add docs Low Write the README"
    //   switch on parts[0] with a switch EXPRESSION:
    //     "add"  -> store.Add(parts[3], parts[1], Enum.Parse<Priority>(parts[2]))
    //               "added #6 Write the README (docs/Low)"
    //     "done" -> store.Complete(int.Parse(parts[1]))
    //               "completed #3 Build the domain"   or   "no task #42"
    //     "drop" -> store.Remove(int.Parse(parts[1]))
    //               "removed #5 Polish the UX"        or   "no task #42"
    //     _      -> "unknown command: sync"
    //   Give each verb its own small private helper — Run stays four lines.
}
