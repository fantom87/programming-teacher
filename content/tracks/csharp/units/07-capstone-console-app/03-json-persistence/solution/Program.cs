// TaskFlow — presentation layer. This file owns the Console; the domain doesn't.
const string StorePath = "tasks.json";

TaskStore store = new TaskStore(SeedData.Tasks());

Console.WriteLine("== TaskFlow v0.3 ==");
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
Console.WriteLine("-- Saving --");
Storage.Save(StorePath, store);
Console.WriteLine($"saved {store.Count} tasks to {StorePath}");
TaskStore reloaded = Storage.Load(StorePath);
Console.WriteLine($"loaded {reloaded.Count} tasks ({reloaded.DoneCount} done)");
Console.WriteLine($"round trip: {(reloaded.All.SequenceEqual(store.All) ? "identical" : "MISMATCH")}");

Console.WriteLine();
Console.WriteLine("-- First task on disk --");
foreach (string line in File.ReadLines(StorePath).Take(7))
{
    Console.WriteLine(line);
}

Console.WriteLine();
Console.WriteLine("-- Backlog --");
foreach (TaskItem t in reloaded.All)
{
    Console.WriteLine(Render(t));
}

Console.WriteLine();
Console.WriteLine($"{reloaded.Count} tasks: {reloaded.DoneCount} done, {reloaded.OpenCount} open");

static string Render(TaskItem t) => $"[{(t.Done ? 'x' : ' ')}] {t.Id} {t.Title} ({t.Category}/{t.Priority})";
