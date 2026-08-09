// TaskFlow — presentation layer. This file owns the Console; the domain doesn't.
TaskStore store = new TaskStore(SeedData.Tasks());

Console.WriteLine("== TaskFlow v0.2 ==");
Console.WriteLine($"{store.Count} tasks: {store.DoneCount} done, {store.OpenCount} open");

string[] script =
{
    "done 3",
    "add docs Low Write the README",
    "drop 5",
    "done 42",
    "sync",
};

// TODO Part 3 — a blank line, "-- Session log --", then for each line in the
//   script: echo it as "> done 3", and print the message CommandRunner.Run
//   gives back, indented two spaces.

Console.WriteLine();
Console.WriteLine("-- Backlog --");
foreach (TaskItem t in store.All)
{
    Console.WriteLine(Render(t));
}

// TODO Part 4 — a blank line, then the counts line again, so the before and
//   after totals bracket the session.

static string Render(TaskItem t) => $"[{(t.Done ? 'x' : ' ')}] {t.Id} {t.Title} ({t.Category}/{t.Priority})";
