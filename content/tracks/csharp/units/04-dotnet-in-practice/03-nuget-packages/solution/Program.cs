List<Package> wanted = new List<Package>
{
    new Package("Humanizer", "2.14.1"),
    new Package("Spectre.Console", "0.49.1"),
};

Console.WriteLine("== Adding packages to app.csproj ==");
Console.WriteLine("  <ItemGroup>");
foreach (Package p in wanted)
{
    Console.WriteLine(Reference(p));
}
Console.WriteLine("  </ItemGroup>");
Console.WriteLine($"Packages: {wanted.Count}");

static string Reference(Package p)
{
    return $"    <PackageReference Include=\"{p.Id}\" Version=\"{p.Version}\" />";
}

class Package
{
    public string Id { get; }
    public string Version { get; }

    public Package(string id, string version)
    {
        Id = id;
        Version = version;
    }
}
