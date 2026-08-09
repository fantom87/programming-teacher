// Domain layer: the data and the rules. No Console in this file — ever.

// TODO Part 1 — write class TaskStore here:
//   - a private readonly List<TaskItem> field, assigned by the constructor
//   - public IReadOnlyList<TaskItem> All  (callers may look, never mutate)
//   - public int Count, DoneCount, OpenCount — computed properties, not
//     stored fields that could drift out of date

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
