---
id: 03-nuget-packages
title: NuGet Packages
language: csharp
runner: local
estMinutes: 15
timeoutMs: 90000
files:
  - path: Program.cs
    starter: starter/Program.cs
goal: "Model what dotnet add package really does: generate the ItemGroup of PackageReference lines for two packages with one interpolating helper method, then count them."
docs: [csharp/nuget-basics, csharp/dotnet-cli]
checks:
  - id: itemgroup-output
    type: stdout
    entry: Program.cs
    match: exact
    value: "== Adding packages to app.csproj ==\n  <ItemGroup>\n    <PackageReference Include=\"Humanizer\" Version=\"2.14.1\" />\n    <PackageReference Include=\"Spectre.Console\" Version=\"0.49.1\" />\n  </ItemGroup>\nPackages: 2\n"
  - id: generated-not-typed
    type: ai-judge
    rubric: "One method builds every PackageReference line by interpolating the package's Id and Version properties into the XML shape with escaped quotes; the program prints the lines by looping over the wanted list, and the final count uses wanted.Count (or Count()). No completed PackageReference output line exists as a literal — the strings Humanizer, Spectre.Console, and their versions appear only in the data list, never inside the printed XML template."
hints:
  - "The target shape, quotes included:  <PackageReference Include=\"Humanizer\" Version=\"2.14.1\" />  — inside an interpolated string, each quote is written \\\"."
  - "static string Reference(Package p) { return $\"    <PackageReference Include=\\\"{p.Id}\\\" Version=\\\"{p.Version}\\\" />\"; } — four leading spaces."
  - "Wrap the loop: print \"  <ItemGroup>\", then Reference(p) for each package, then \"  </ItemGroup>\", then $\"Packages: {wanted.Count}\"."
---
## The world's code, one line away

No language survives on its standard library alone. .NET's package registry
is **NuGet** (nuget.org): hundreds of thousands of libraries — Humanizer to
turn timestamps into "3 days ago", Spectre.Console for gorgeous terminal
UIs — each one command away:

```
dotnet add package Humanizer
```

That command does three things. It asks nuget.org for the newest stable
**version**; it writes one line into your csproj; and it **restores** —
downloads the package, plus anything *it* depends on, into a machine-wide
cache. The line it writes is the part worth knowing by heart:

```xml
<ItemGroup>
  <PackageReference Include="Humanizer" Version="2.14.1" />
</ItemGroup>
```

`<ItemGroup>` is the csproj's list section — properties go in
`<PropertyGroup>` (lesson 1), lists of things go here. Each
`PackageReference` names a package and a **semantic version**:
`major.minor.patch`, where a major bump warns of breaking changes. Notice
what this turns your csproj into: a complete dependency manifest. Teammates
never email each other DLLs — they clone the repo, restore reads the
manifest, and the build works anywhere.

The checker can't download packages mid-lesson, so today you'll generate
that XML yourself, from data — and pick up a string skill you'll use
constantly: putting literal quotes *inside* an interpolated string with the
`\"` escape:

```csharp
string line = $"Include=\"{id}\"";   // Include="Humanizer"
```

Afterwards, on your own machine, run the real command in any project folder
and watch the csproj change — the XML it writes should look exactly like
yours.

### Your goal

From the starter's `wanted` list, print exactly:

```
== Adding packages to app.csproj ==
  <ItemGroup>
    <PackageReference Include="Humanizer" Version="2.14.1" />
    <PackageReference Include="Spectre.Console" Version="0.49.1" />
  </ItemGroup>
Packages: 2
```

1. Write `Reference(Package p)` returning one `PackageReference` line
   (four leading spaces) by interpolating `p.Id` and `p.Version`.
2. Print the header, `  <ItemGroup>`, one `Reference(...)` line per
   package via a loop, then `  </ItemGroup>`.
3. Close with `Packages:` and the list's count — computed.
