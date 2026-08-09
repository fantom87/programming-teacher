// Configuration, the .NET way: defaults in code, overridden by
// appsettings.json, overridden by environment variables.
using System.Text.Json;

// A real shell would export this before launching the app; the checker
// can't, so we plant it. Read it back with GetEnvironmentVariable below.
Environment.SetEnvironmentVariable("TEACHER_THEME", "solarized");

// 1. Print the header:  == Settings, layer by layer ==
//    then a fresh Settings() and:   Defaults: <Describe()>
// 2. If appsettings.json exists, Deserialize its text into settings,
//    then print:                    File: <Describe()>
// 3. string? theme = Environment.GetEnvironmentVariable("TEACHER_THEME");
//    apply it when not null, then:  Environment: <Describe()>

class Settings
{
    // Theme ("dark"), FontSize (12), AutoSave (true) — public { get; set; }
    // properties WITH initializers. These ARE the defaults layer.

    // Describe() returns:  Theme=<Theme> FontSize=<FontSize> AutoSave=<AutoSave>
}
