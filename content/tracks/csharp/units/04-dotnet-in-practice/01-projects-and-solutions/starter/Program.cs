// Your program is built by a project file sitting RIGHT HERE in this
// folder: app.csproj. Today you read it from inside the running program.

// 1. string[] lines = File.ReadAllLines("app.csproj");
// 2. Print the report:
//      == app.csproj ==
//      OutputType: <extracted>
//      TargetFramework: <extracted>
//      Nullable: <extracted>
//      ImplicitUsings: <extracted>
//    Every value must come from the helper below — none typed by hand.

// 3. Write the helper:
//    static string Prop(string[] lines, string name)
//    {
//        Find the line whose trimmed text starts with $"<{name}>" and
//        return what sits between <name> and </name>  (Replace works well).
//    }
