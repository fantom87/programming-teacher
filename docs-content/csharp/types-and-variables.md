# Types and variables

C# is **statically typed**: every variable has a type fixed at compile time, and the compiler refuses to run code that mixes them up. This catches whole categories of bugs before your program ever starts.

## Declaring variables

Type first, then name, then value:

```csharp
int age = 36;
string name = "Ada";
double price = 9.99;
bool isOpen = true;

age = "old";   // Compile error: cannot convert string to int
```

## var: let the compiler figure it out

When the type is obvious from the right-hand side, `var` saves typing. The variable is still strictly typed — you just didn't spell it out:

```csharp
var city = "Lisbon";     // a string, permanently
var count = 42;          // an int, permanently

city = 99;               // Compile error — var is not "any type"
```

## The types you'll use most

```csharp
int wholeNumber = 42;          // whole numbers
double measurement = 3.14;     // decimals (fast, approximate)
decimal money = 19.99m;        // decimals (exact — use for money; note the m)
bool flag = true;              // true or false
string text = "hello";        // text
char letter = 'A';             // exactly one character, single quotes
```

## Constants

```csharp
const int MaxPlayers = 4;   // fixed forever, known at compile time
```

## Converting between types

```csharp
int i = 42;
double d = i;                     // int → double: automatic (no data lost)
int back = (int)3.99;             // double → int: explicit cast, chops to 3

string input = "123";
int parsed = int.Parse(input);    // string → int (throws if not a number)

if (int.TryParse(input, out int safe))   // the no-crash version
{
    Console.WriteLine(safe + 1);
}

string s = 42.ToString();         // anything → string
```

## Nullable types: saying "maybe nothing"

By default, value types can't be `null`. Add `?` to allow it:

```csharp
int? maybeAge = null;
string? nickname = null;   // modern C# warns when a string might be null

if (maybeAge.HasValue)
{
    Console.WriteLine(maybeAge.Value);
}
```

Those compiler warnings about possible nulls are friends, not noise — each one is a potential crash the compiler found for you.
