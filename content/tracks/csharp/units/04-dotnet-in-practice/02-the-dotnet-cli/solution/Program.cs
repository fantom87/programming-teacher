using System.Reflection;

Console.WriteLine("== Build footprint ==");
Console.WriteLine($"app.csproj found: {File.Exists("app.csproj")}");
Console.WriteLine($"bin exists: {Directory.Exists("bin")}");
Console.WriteLine($"obj exists: {Directory.Exists("obj")}");
Console.WriteLine($"Running as: {Assembly.GetEntryAssembly()?.GetName().Name}");
