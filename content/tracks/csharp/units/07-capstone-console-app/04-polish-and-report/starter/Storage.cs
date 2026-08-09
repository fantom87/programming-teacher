// Persistence layer: the store to a file and back. Knows JSON, not the Console.
using System.Text.Json;
using System.Text.Json.Serialization;

static class Storage
{
    private static readonly JsonSerializerOptions Options = new()
    {
        WriteIndented = true,
        Converters = { new JsonStringEnumConverter() },
    };

    public static void Save(string path, TaskStore store)
    {
        string json = JsonSerializer.Serialize(store.All, Options);
        File.WriteAllText(path, json);
    }

    public static TaskStore Load(string path)
    {
        if (!File.Exists(path)) return new TaskStore(new List<TaskItem>());
        List<TaskItem> tasks = JsonSerializer.Deserialize<List<TaskItem>>(File.ReadAllText(path), Options)
            ?? new List<TaskItem>();
        return new TaskStore(tasks);
    }
}
