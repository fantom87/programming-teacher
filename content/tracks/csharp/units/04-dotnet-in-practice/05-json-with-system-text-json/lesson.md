---
id: 05-json-with-system-text-json
title: JSON with System.Text.Json
language: csharp
runner: local
estMinutes: 18
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Round-trip a Profile object through JSON: print the compact form, save an indented profile.json, read it back, deserialize, and report from the restored object."
docs: [csharp/classes-and-objects, csharp/collections]
checks:
  - id: json-round-trip
    type: stdout
    entry: Program.cs
    match: exact
    value: "{\"Name\":\"Bradley\",\"Level\":12,\"Languages\":[\"python\",\"csharp\"]}\n-- profile.json --\n{\n  \"Name\": \"Bradley\",\n  \"Level\": 12,\n  \"Languages\": [\n    \"python\",\n    \"csharp\"\n  ]\n}\nRestored: Bradley (level 12), 2 languages\n"
  - id: real-round-trip
    type: ai-judge
    rubric: "Profile exposes Name, Level, and Languages as public get/set properties. The compact line is JsonSerializer.Serialize of the object; the indented version is produced with JsonSerializerOptions { WriteIndented = true }, written to profile.json, and the printed block comes from reading that file back (File.ReadAllText). The Restored line interpolates the DESERIALIZED object's Name, Level, and Languages.Count — not the original object's properties and not literal values."
hints:
  - "Object initializer: Profile me = new Profile { Name = \"Bradley\", Level = 12, Languages = new List<string> { \"python\", \"csharp\" } };"
  - "Pretty printing is an options object: new JsonSerializerOptions { WriteIndented = true }, passed as Serialize's second argument — write that string to profile.json."
  - "Profile restored = JsonSerializer.Deserialize<Profile>(File.ReadAllText(\"profile.json\"))!; then $\"Restored: {restored.Name} (level {restored.Level}), {restored.Languages.Count} languages\"."
---
## Objects on the wire

Sooner or later your objects need to leave the program — into a save file,
across a network, over to another language entirely. The universal courier
is **JSON**, and .NET ships the tool in the box: `System.Text.Json`. One
`using`, two verbs:

```csharp
using System.Text.Json;

string json = JsonSerializer.Serialize(me);                  // object -> text
Profile back = JsonSerializer.Deserialize<Profile>(json)!;   // text -> object
```

`Serialize` walks your object's **public `{ get; set; }` properties** and
writes each as a JSON key. That's the contract to remember: properties
travel; fields, private members, and methods don't. `Deserialize<Profile>`
runs the trip in reverse — builds a fresh `Profile`, fills its properties
from the text. Its return type is `Profile?`, because the input `"null"`
deserializes to nothing — so today we append `!` ("I know this one isn't
null"); lesson 7 tells that operator's full story.

Compact JSON is what programs exchange. For files humans will open, ask for
the pretty version:

```csharp
JsonSerializerOptions options = new JsonSerializerOptions { WriteIndented = true };
File.WriteAllText("profile.json", JsonSerializer.Serialize(me, options));
```

Pair that with yesterday's file tools and you have persistence — the exact
save-file pattern real desktop apps use (and the settings pattern; wait for
lesson 9).

One professional instinct to close on: the proof of a round trip is
computing from the object that came **back**. Your last line below must be
built from `restored`, never from `me` — if deserialization had dropped a
property, the output would betray it immediately.

### Your goal

Print exactly:

```
{"Name":"Bradley","Level":12,"Languages":["python","csharp"]}
-- profile.json --
{
  "Name": "Bradley",
  "Level": 12,
  "Languages": [
    "python",
    "csharp"
  ]
}
Restored: Bradley (level 12), 2 languages
```

1. Give `Profile` its three public `{ get; set; }` properties and build
   `me` with an object initializer.
2. Print the compact `Serialize(me)`.
3. Print `-- profile.json --`, save the indented version to
   `profile.json`, and print the file's contents (`File.ReadAllText`).
4. Deserialize the file text into `restored` and build the last line from
   *it*.
