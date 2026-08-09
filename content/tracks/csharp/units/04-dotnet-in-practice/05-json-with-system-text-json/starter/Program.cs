// Your first save file: serialize an object to JSON, park it on disk,
// and prove the round trip by restoring it.
using System.Text.Json;

// The data: Name "Bradley", Level 12, Languages ["python", "csharp"].
// Build it as:  Profile me = new Profile { ... };

// 1. Print JsonSerializer.Serialize(me)   (compact, one line).
// 2. Print:  -- profile.json --
//    then save the WriteIndented version to profile.json and print the
//    file's contents with File.ReadAllText.
// 3. Deserialize the file text into `restored` and print — computed from
//    restored, NOT from me:
//      Restored: <Name> (level <Level>), <count> languages

class Profile
{
    // Three public { get; set; } properties: Name (string), Level (int),
    // Languages (List<string>). Give Name and Languages starting values
    // ("" and new List<string>()) so the compiler's null checks stay calm.
}
