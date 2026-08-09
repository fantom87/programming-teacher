// You are running inside `dotnet run` right now — so your program can
// inspect the build footprint the CLI left in this very folder.

// 1. Print:  == Build footprint ==
// 2. Three live checks (never type "True" yourself):
//      app.csproj found: <File.Exists("app.csproj")>
//      bin exists: <Directory.Exists("bin")>
//      obj exists: <Directory.Exists("obj")>
// 3. Ask the program its own assembly name (using System.Reflection; at
//    the very top, then Assembly.GetEntryAssembly()?.GetName().Name):
//      Running as: <name>
