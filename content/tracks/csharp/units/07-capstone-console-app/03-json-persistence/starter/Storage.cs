// Persistence layer: the store to a file and back. Knows JSON, not the Console.
using System.Text.Json;
using System.Text.Json.Serialization;

static class Storage
{
    // TODO Part 1 — one shared, reusable options object:
    //   private static readonly JsonSerializerOptions Options = new()
    //   with WriteIndented = true and a JsonStringEnumConverter in Converters,
    //   so Priority lands in the file as "High" instead of 2.

    // TODO Part 2 — public static void Save(string path, TaskStore store)
    //   JsonSerializer.Serialize(store.All, Options) -> File.WriteAllText.

    // TODO Part 3 — public static TaskStore Load(string path)
    //   No file yet? Hand back an empty store — a first run is not an error.
    //   Otherwise Deserialize<List<TaskItem>> the text (?? an empty list, since
    //   Deserialize can return null) and wrap it in a new TaskStore.
}
