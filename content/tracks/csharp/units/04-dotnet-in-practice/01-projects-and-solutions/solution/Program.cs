string[] lines = File.ReadAllLines("app.csproj");

Console.WriteLine("== app.csproj ==");
Console.WriteLine($"OutputType: {Prop(lines, "OutputType")}");
Console.WriteLine($"TargetFramework: {Prop(lines, "TargetFramework")}");
Console.WriteLine($"Nullable: {Prop(lines, "Nullable")}");
Console.WriteLine($"ImplicitUsings: {Prop(lines, "ImplicitUsings")}");

static string Prop(string[] lines, string name)
{
    foreach (string line in lines)
    {
        string trimmed = line.Trim();
        if (trimmed.StartsWith($"<{name}>"))
        {
            return trimmed.Replace($"<{name}>", "").Replace($"</{name}>", "");
        }
    }
    return "(not found)";
}
