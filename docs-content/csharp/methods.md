# Methods

A method is a named, reusable block of code — C#'s version of a function. It can take inputs (**parameters**) and give back an output (**return value**).

## Defining and calling

```csharp
int Add(int a, int b)
{
    return a + b;
}

int sum = Add(2, 3);   // 5
```

The signature reads: *return type* `Add(` *parameter types and names* `)`. If a method returns nothing, its return type is `void`:

```csharp
void Greet(string name)
{
    Console.WriteLine($"Hello, {name}!");
}

Greet("Ada");
```

With top-level statements, you can declare methods right in Program.cs below your main code.

## Expression-bodied methods

One-liners have a compact form with `=>`:

```csharp
int Square(int n) => n * n;
bool IsEven(int n) => n % 2 == 0;
```

## Optional and named arguments

```csharp
void Order(string item, int quantity = 1, bool giftWrap = false)
{
    Console.WriteLine($"{quantity} x {item}, wrapped: {giftWrap}");
}

Order("book");                          // uses both defaults
Order("book", 3);                       // quantity 3
Order("book", giftWrap: true);          // skip the middle one by name
```

Named arguments (`giftWrap: true`) also make call sites easier to read.

## Returning more than one thing: tuples

```csharp
(int Min, int Max) FindRange(int[] numbers)
{
    return (numbers.Min(), numbers.Max());
}

var range = FindRange(new[] { 4, 9, 1 });
Console.WriteLine($"{range.Min}–{range.Max}");   // 1–9

var (min, max) = FindRange(new[] { 4, 9, 1 });   // or unpack directly
```

## Overloading: same name, different inputs

```csharp
double Area(double radius) => Math.PI * radius * radius;
double Area(double width, double height) => width * height;
```

The compiler picks the right one from the arguments you pass.

## Naming and scope

Method names in C# use `PascalCase` (`CalculateTotal`, not `calculateTotal`). Variables declared inside a method exist only inside it — parameters included. Small methods with clear names are the single biggest readability win in any codebase: if you can't name it, it's probably doing too much.
