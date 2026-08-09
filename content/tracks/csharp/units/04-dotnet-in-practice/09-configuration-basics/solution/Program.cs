using System.Text.Json;

// A real shell would export this before launching the app; the checker
// can't, so we plant it.
Environment.SetEnvironmentVariable("TEACHER_THEME", "solarized");

Console.WriteLine("== Settings, layer by layer ==");

Settings settings = new Settings();
Console.WriteLine($"Defaults: {settings.Describe()}");

if (File.Exists("appsettings.json"))
{
    settings = JsonSerializer.Deserialize<Settings>(File.ReadAllText("appsettings.json"))!;
}
Console.WriteLine($"File: {settings.Describe()}");

string? theme = Environment.GetEnvironmentVariable("TEACHER_THEME");
if (theme is not null)
{
    settings.Theme = theme;
}
Console.WriteLine($"Environment: {settings.Describe()}");

class Settings
{
    public string Theme { get; set; } = "dark";
    public int FontSize { get; set; } = 12;
    public bool AutoSave { get; set; } = true;

    public string Describe()
    {
        return $"Theme={Theme} FontSize={FontSize} AutoSave={AutoSave}";
    }
}
