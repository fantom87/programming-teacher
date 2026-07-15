# Control flow

Control flow is how your program decides what to do and how often to do it: branches and loops.

## if / else if / else

```csharp
int temperature = 28;

if (temperature > 30)
{
    Console.WriteLine("It's hot!");
}
else if (temperature > 20)
{
    Console.WriteLine("Nice and warm.");
}
else
{
    Console.WriteLine("Bring a jacket.");
}
```

Conditions must be genuine booleans — `if (1)` is a compile error in C#, which prevents a classic family of bugs.

Comparison and logic operators work as you'd expect:

```csharp
age >= 18            // greater than or equal
name == "Ada"        // equal
name != "Bob"        // not equal
a && b               // AND
a || b               // OR
!done                // NOT
```

## switch: many branches on one value

```csharp
string day = "Sat";

switch (day)
{
    case "Sat":
    case "Sun":
        Console.WriteLine("Weekend!");
        break;
    default:
        Console.WriteLine("Workday.");
        break;
}
```

Modern C# also has compact **switch expressions** that produce a value:

```csharp
string mood = day switch
{
    "Sat" or "Sun" => "Relaxed",
    "Mon"          => "Sleepy",
    _              => "Focused",   // _ is the catch-all
};
```

## Loops

```csharp
// for: counted repetition
for (int i = 0; i < 5; i++)
{
    Console.WriteLine($"Round {i}");
}

// foreach: visit every item in a collection — your everyday loop
var colors = new[] { "red", "green", "blue" };
foreach (string color in colors)
{
    Console.WriteLine(color);
}

// while: repeat until a condition changes
int health = 100;
while (health > 0)
{
    health -= 30;
}

// do-while: like while, but always runs at least once
string? answer;
do
{
    Console.Write("Type yes: ");
    answer = Console.ReadLine();
} while (answer != "yes");
```

## break and continue

```csharp
foreach (int n in new[] { 1, 5, 8, 3 })
{
    if (n == 8) break;       // exit the loop entirely
    if (n == 5) continue;    // skip to the next item
    Console.WriteLine(n);    // prints 1
}
```

Rule of thumb: `foreach` for collections, `for` when you need the index, `while` when the end depends on a condition.
