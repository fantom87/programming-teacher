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

Console.WriteLine();
Console.WriteLine("-- Session log --");
foreach (string line in script)
{
    Console.WriteLine($"> {line}");
    Console.WriteLine($"  {CommandRunner.Run(store, line)}");
}

Console.WriteLine();
Console.WriteLine("-- Backlog --");
foreach (TaskItem t in store.All)
{
    Console.WriteLine(Render(t));
}

Console.WriteLine();
Console.WriteLine($"{store.Count} tasks: {store.DoneCount} done, {store.OpenCount} open");

static string Render(TaskItem t) => $"[{(t.Done ? 'x' : ' ')}] {t.Id} {t.Title} ({t.Category}/{t.Priority})";
