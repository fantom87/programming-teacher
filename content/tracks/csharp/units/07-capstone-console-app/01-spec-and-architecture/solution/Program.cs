// TaskFlow — presentation layer. This file owns the Console; the domain doesn't.
TaskStore store = new TaskStore(SeedData.Tasks());

Console.WriteLine("== TaskFlow v0.1 ==");
Console.WriteLine($"{store.Count} tasks: {store.DoneCount} done, {store.OpenCount} open");

Console.WriteLine();
Console.WriteLine("-- Backlog --");
foreach (TaskItem t in store.All)
{
    Console.WriteLine(Render(t));
}

static string Render(TaskItem t) => $"[{(t.Done ? 'x' : ' ')}] {t.Id} {t.Title} ({t.Category}/{t.Priority})";
