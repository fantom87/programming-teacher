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

// TODO Part 4 — a blank line, "-- Saving --", then prove the round trip:
//     Storage.Save(StorePath, store);
//     "saved <Count> tasks to tasks.json"
//     TaskStore reloaded = Storage.Load(StorePath);
//     "loaded <Count> tasks (<DoneCount> done)"
//     "round trip: identical"  when reloaded.All.SequenceEqual(store.All),
//     "round trip: MISMATCH"   when it doesn't — records compare by value,
//                              so this really is a byte-level verdict.

// TODO Part 5 — a blank line, "-- First task on disk --", then the first 7
//   lines of the file (File.ReadLines(StorePath).Take(7)) so you can see the
//   shape the serializer chose.

Console.WriteLine();
Console.WriteLine("-- Backlog --");
foreach (TaskItem t in store.All)     // TODO Part 6 — print the RELOADED store
{
    Console.WriteLine(Render(t));
}

Console.WriteLine();
Console.WriteLine($"{store.Count} tasks: {store.DoneCount} done, {store.OpenCount} open");   // TODO Part 6 — reloaded, here too

static string Render(TaskItem t) => $"[{(t.Done ? 'x' : ' ')}] {t.Id} {t.Title} ({t.Category}/{t.Priority})";
