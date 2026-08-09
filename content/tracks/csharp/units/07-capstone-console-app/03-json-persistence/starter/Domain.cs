// Domain layer: the data and the rules. No Console in this file — ever.

class TaskStore
{
    private readonly List<TaskItem> tasks;
    private int nextId;

    public TaskStore(List<TaskItem> seed)
    {
        tasks = seed;
        nextId = tasks.Count == 0 ? 1 : tasks.Max(t => t.Id) + 1;
    }

    public IReadOnlyList<TaskItem> All => tasks;
    public int Count => tasks.Count;
    public int DoneCount => tasks.Count(t => t.Done);
    public int OpenCount => tasks.Count(t => !t.Done);

    public TaskItem Add(string title, string category, Priority priority)
    {
        TaskItem created = new TaskItem(nextId++, title, category, priority, false);
        tasks.Add(created);
        return created;
    }

    public TaskItem? Complete(int id)
    {
        int index = tasks.FindIndex(t => t.Id == id);
        if (index < 0) return null;
        tasks[index] = tasks[index] with { Done = true };
        return tasks[index];
    }

    public TaskItem? Remove(int id)
    {
        int index = tasks.FindIndex(t => t.Id == id);
        if (index < 0) return null;
        TaskItem removed = tasks[index];
        tasks.RemoveAt(index);
        return removed;
    }
}

static class SeedData
{
    // Deterministic seed — sessions 2-4 build on exactly this data.
    public static List<TaskItem> Tasks() => new()
    {
        new TaskItem(1, "Draft the spec",    "planning", Priority.High,   true),
        new TaskItem(2, "Sketch the layers", "planning", Priority.Medium, true),
        new TaskItem(3, "Build the domain",  "code",     Priority.High,   false),
        new TaskItem(4, "Wire persistence",  "code",     Priority.Medium, false),
        new TaskItem(5, "Polish the UX",     "code",     Priority.Low,    false),
    };
}

enum Priority { Low, Medium, High }

// TaskItem, not Task — that name already belongs to the async type.
record TaskItem(int Id, string Title, string Category, Priority Priority, bool Done);
