// A journal that survives the program ending.

// 1. Directory.CreateDirectory("notes");
//    string path = Path.Combine("notes", "journal.txt");
// 2. WRITE the first entry (WriteAllText replaces the file — rerun-safe):
//      "Day 1: read the csproj\n"
//    APPEND the second (AppendAllText adds to the end):
//      "Day 2: tamed the CLI\n"
// 3. Read it back with File.ReadAllLines, print every entry, then:
//      <count> entries on disk
// 4. Print File.Exists(path).
