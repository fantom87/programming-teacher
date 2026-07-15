# Program structure

C# is a compiled language from Microsoft that runs on **.NET**. Modern C# programs can start astonishingly small.

## The smallest program

Since .NET 6, a file can use **top-level statements** — no ceremony, just code:

```csharp
// Program.cs
Console.WriteLine("Hello, world!");
```

That's a complete, runnable program. The compiler quietly wraps it in the traditional `Main` method for you. Older tutorials show the long form — it still works, but you don't need to write it:

```csharp
class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Hello, world!");
    }
}
```

## Creating and running a project

```bash
dotnet new console -n HelloApp
cd HelloApp
dotnet run
```

This scaffolds two important files:

- **Program.cs** — your code
- **HelloApp.csproj** — the project file: which .NET version, which packages

## Statements end with semicolons

Every statement in C# ends with `;`, and blocks live inside `{ }`:

```csharp
Console.WriteLine("First");
Console.WriteLine("Second");

if (2 + 2 == 4)
{
    Console.WriteLine("Math still works.");
}
```

## Reading input, writing output

```csharp
Console.Write("What's your name? ");     // Write: no newline
string? name = Console.ReadLine();       // reads one line of typed input
Console.WriteLine($"Nice to meet you, {name}!");
```

The `$"..."` form is an **interpolated string** — C#'s version of dropping variables into text.

## Namespaces and using

Code libraries are organized into **namespaces**. `using` directives at the top of a file let you use their short names:

```csharp
using System.Text;   // now StringBuilder works without the full System.Text.StringBuilder
```

Common ones like `System` are imported automatically in modern projects (called *implicit usings*), which is why `Console` just works.

## Comments

```csharp
// single line
/* multiple
   lines */
```

That's the shape of every C# program: a `.csproj` describing the project, `.cs` files full of statements, and `dotnet run` to bring it to life.
