// TaskDeck — capstone session 1 of 4: spec and architecture.
//
// THE SPEC (the whole capstone):
//   * a task: id, title, category, priority, done flag
//   * session 1: domain layer (TaskStore) + board rendering
//   * session 2: mutations (add/complete/remove) behind tests
//   * session 3: JSON persistence with async file I/O
//   * session 4: command dispatcher, reports, final polish
//
// THE LAW: Domain.cs never touches Console; Program.cs never touches the
// task List directly — everything flows through TaskStore.
//
// TODO Part 2 — presentation: build the store from SeedData.Tasks(), then
// Render(store) — a STATIC local function (everything arrives via its
// parameter) that prints:
//   == TaskDeck ==
//   [x] #1 Draft the spec (planning, high)     <- one line per task
//   ...
//   5 tasks, 2 done, 3 open                    <- every number computed
// Marks: "x" when Done, " " otherwise. Priority prints lowercase via
// t.Priority.ToString().ToLowerInvariant().

Console.WriteLine("TaskDeck: not built yet");
