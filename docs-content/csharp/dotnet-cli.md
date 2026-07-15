# The dotnet CLI

The `dotnet` command is mission control for C# development: it creates projects, runs them, tests them, and builds them for release. Install the **.NET SDK** (version 8 or later) and check it works:

```bash
dotnet --version
```

## Creating a project

```bash
dotnet new console -n MyApp   # a console app in a new MyApp folder
cd MyApp
```

Other useful templates:

```bash
dotnet new web -n MyApi           # minimal web API
dotnet new classlib -n MyLibrary  # a reusable library
dotnet new xunit -n MyApp.Tests   # a test project
dotnet new list                   # see every available template
```

## The daily commands

```bash
dotnet run       # compile (if needed) and run the project in this folder
dotnet build     # compile only — great for checking for errors
dotnet test      # run the tests in a test project
```

`dotnet run` is the one you'll type most. If your code has compile errors, it lists each one with a file and line number — read the **first** error first; later ones are often echoes of it.

Pass arguments to your program after `--`:

```bash
dotnet run -- hello 42
```

## Hot reload while developing

```bash
dotnet watch
```

This reruns (or hot-reloads) your app every time you save a file — a tight feedback loop that's wonderful for learning.

## Managing packages

```bash
dotnet add package Spectre.Console   # add a NuGet package
dotnet list package                  # what's installed?
dotnet remove package Spectre.Console
```

## Solutions: grouping projects

Bigger apps hold several projects (app + library + tests) in a **solution**:

```bash
dotnet new sln -n MyApp
dotnet sln add MyApp/MyApp.csproj MyApp.Tests/MyApp.Tests.csproj
dotnet build          # builds everything in the solution
```

## Shipping

```bash
dotnet publish -c Release
```

This produces an optimized build in `bin/Release/` ready to deploy.

A comfortable rhythm to build: `dotnet new` once, `dotnet watch` while you work, `dotnet test` before you share.
