# Interfaces

An **interface** is a contract: a list of things a type promises it can do, with no code for *how*. Any class that signs the contract (implements the interface) can be used wherever the contract is expected.

## Defining and implementing

```csharp
public interface INotifier
{
    void Send(string message);
}

public class EmailNotifier : INotifier
{
    public void Send(string message)
    {
        Console.WriteLine($"Emailing: {message}");
    }
}

public class SmsNotifier : INotifier
{
    public void Send(string message)
    {
        Console.WriteLine($"Texting: {message}");
    }
}
```

The `: INotifier` after the class name means "this class implements that contract." By convention, interface names start with `I`.

## Why this is powerful

Code can depend on the *contract* instead of a specific class:

```csharp
void Alert(INotifier notifier, string message)
{
    notifier.Send($"ALERT: {message}");
}

Alert(new EmailNotifier(), "Server down");   // Emailing: ALERT: Server down
Alert(new SmsNotifier(), "Server down");     // Texting: ALERT: Server down
```

`Alert` doesn't know or care which notifier it got — anything that fulfills `INotifier` works. Swapping implementations (real email in production, a fake one in tests) requires zero changes to `Alert`. This idea powers most large C# codebases.

## A class can implement several interfaces

```csharp
public interface IReadable  { string Read(); }
public interface IWritable  { void Write(string text); }

public class FileStore : IReadable, IWritable
{
    public string Read() => File.ReadAllText("data.txt");
    public void Write(string text) => File.AppendAllText("data.txt", text);
}
```

## Interfaces you already use

The standard library is built on them:

- `IEnumerable<T>` — "you can foreach over me" (arrays, lists, LINQ results)
- `IComparable<T>` — "I can be sorted"
- `IDisposable` — "clean me up when done" (used with `using` blocks)

```csharp
IEnumerable<int> numbers = new List<int> { 3, 1, 2 };   // a List "is an" IEnumerable
```

## Interface vs class, in one line

A class is *what something is*; an interface is *what something can do*. When two unrelated classes need to be treated the same way, that's your cue to extract an interface.
