// NuGet in one line: `dotnet add package <Id>` writes a PackageReference
// into your csproj, then restores it. Today you generate that XML from data.
List<Package> wanted = new List<Package>
{
    new Package("Humanizer", "2.14.1"),
    new Package("Spectre.Console", "0.49.1"),
};

// 1. Print the header:  == Adding packages to app.csproj ==
// 2. Print "  <ItemGroup>" (two leading spaces), one Reference(p) line
//    per package, then "  </ItemGroup>".
// 3. Print:  Packages: <count>   (computed from the list)

// 4. Write the helper — four leading spaces, quotes via \" escapes:
//    static string Reference(Package p)
//        returns:      <PackageReference Include="Id" Version="Version" />

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
