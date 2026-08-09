// The phone book knows two of the three names below.
Dictionary<string, string> book = new Dictionary<string, string>();
book["ada"] = "ada@algorithms.dev";
book["grace"] = "grace@navy.mil";

string[] names = { "ada", "linus", "grace" };

// 1. Write:  static string? FindEmail(Dictionary<string, string> book, string name)
//    TryGetValue; return the email when found, null when not.
//    (null means "not found" — the fallback TEXT belongs to the caller.)
// 2. foreach name, print:  <name> -> <email or "no email on file">   (use ??)
// 3. Count the hits with `is not null`, then print:  Found <hits> of <total>
// 4. The ! operator is banned today.
