# Classes and objects

A **class** is a blueprint; an **object** is a thing built from it. The class `Car` describes what every car has (color, speed) and does (drive, brake); each actual car is an object, or *instance*.

## Defining a class

```csharp
public class Player
{
    // Properties: the data each Player carries
    public string Name { get; set; }
    public int Score { get; set; }

    // Constructor: how a Player gets built
    public Player(string name)
    {
        Name = name;
        Score = 0;
    }

    // Method: something a Player can do
    public void AddPoints(int points)
    {
        Score += points;
    }
}
```

## Creating and using objects

```csharp
var alice = new Player("Alice");
var bob = new Player("Bob");

alice.AddPoints(10);
alice.AddPoints(5);

Console.WriteLine($"{alice.Name}: {alice.Score}");   // Alice: 15
Console.WriteLine($"{bob.Name}: {bob.Score}");       // Bob: 0
```

Each object has its **own** copy of the data — Alice's points don't touch Bob's.

## Properties with rules

`{ get; set; }` is an auto-property. You can restrict it:

```csharp
public int Score { get; private set; }   // readable anywhere, changed only inside the class
```

Now outside code must go through `AddPoints`, and the class controls its own rules. That's **encapsulation** — the class guards its data.

## Object initializers

For simple classes, set properties at creation time:

```csharp
public class Book
{
    public string Title { get; set; } = "";
    public int Pages { get; set; }
}

var book = new Book { Title = "Dune", Pages = 412 };
```

## Records: classes for pure data

When a type is *just data*, a **record** writes the boilerplate for you — constructor, value-based equality, and a nice `ToString`:

```csharp
public record Point(double X, double Y);

var a = new Point(1, 2);
var b = new Point(1, 2);
Console.WriteLine(a == b);   // True — records compare by value
```

## static: belongs to the class, not an instance

```csharp
public class Counter
{
    public static int Total { get; private set; }
    public static void Increment() => Total++;
}

Counter.Increment();          // no "new" needed — called on the class itself
```

Start simple: data as properties, behavior as methods, constructors to guarantee objects begin life valid.
