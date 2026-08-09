using System.Text.Json;

Profile me = new Profile
{
    Name = "Bradley",
    Level = 12,
    Languages = new List<string> { "python", "csharp" },
};

Console.WriteLine(JsonSerializer.Serialize(me));

Console.WriteLine("-- profile.json --");
JsonSerializerOptions options = new JsonSerializerOptions { WriteIndented = true };
File.WriteAllText("profile.json", JsonSerializer.Serialize(me, options));
Console.WriteLine(File.ReadAllText("profile.json"));

Profile restored = JsonSerializer.Deserialize<Profile>(File.ReadAllText("profile.json"))!;
Console.WriteLine($"Restored: {restored.Name} (level {restored.Level}), {restored.Languages.Count} languages");

class Profile
{
    public string Name { get; set; } = "";
    public int Level { get; set; }
    public List<string> Languages { get; set; } = new List<string>();
}
