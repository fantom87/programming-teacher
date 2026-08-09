Dictionary<string, string> book = new Dictionary<string, string>();
book["ada"] = "ada@algorithms.dev";
book["grace"] = "grace@navy.mil";

string[] names = { "ada", "linus", "grace" };

int found = 0;
foreach (string name in names)
{
    string? email = FindEmail(book, name);
    if (email is not null)
    {
        found++;
    }
    Console.WriteLine($"{name} -> {email ?? "no email on file"}");
}
Console.WriteLine($"Found {found} of {names.Length}");

static string? FindEmail(Dictionary<string, string> book, string name)
{
    if (book.TryGetValue(name, out string? email))
    {
        return email;
    }
    return null;
}
