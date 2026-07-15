# NuGet basics

**NuGet** is the package manager for .NET — a giant public library of reusable code. Need to parse JSON, draw console tables, or talk to a database? Someone has published a package for it at [nuget.org](https://www.nuget.org).

If you know npm from the JavaScript world: NuGet is the same idea for C#.

## Installing a package

From your project folder:

```bash
dotnet add package Spectre.Console
```

This downloads the package and records it in your **.csproj** file:

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <ItemGroup>
    <PackageReference Include="Spectre.Console" Version="0.49.1" />
  </ItemGroup>
</Project>
```

The `.csproj` is the source of truth: anyone who clones your project just runs `dotnet run` (or `dotnet restore`) and the packages download automatically. There's no folder to commit — downloaded packages live in a shared cache on your machine.

## Using what you installed

Add a `using` for the package's namespace and go:

```csharp
using Spectre.Console;

AnsiConsole.MarkupLine("[bold green]It works![/]");
```

The package's page on nuget.org links to its documentation and shows the install command.

## Everyday commands

```bash
dotnet add package Newtonsoft.Json            # install latest stable
dotnet add package Serilog --version 3.1.1    # install a specific version
dotnet list package                           # what does this project use?
dotnet list package --outdated                # anything newer available?
dotnet remove package Serilog                 # uninstall
dotnet restore                                # re-download everything (usually automatic)
```

## Picking good packages

On nuget.org, glance at:

- **Downloads** — millions of downloads means many eyes on it
- **Last updated** — recently maintained is a good sign
- **The linked project site** — real docs suggest a serious project

## Versions in one minute

Package versions look like `8.0.3` (major.minor.patch). A **major** bump (8 → 9) may break your code; minor and patch updates are usually safe. When updating majors, check the package's release notes.

That's it: `dotnet add package` to get code, `using` to use it, `.csproj` remembers everything.
