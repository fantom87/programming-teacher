# Exceptions

When something goes wrong at runtime — a missing file, invalid input, division by zero — C# **throws an exception**. Unhandled, it crashes the program with a stack trace. Handled, it becomes a recoverable bump.

## try / catch

Wrap risky code in `try`; handle failures in `catch`:

```csharp
try
{
    string text = File.ReadAllText("scores.txt");
    int firstScore = int.Parse(text.Split(',')[0]);
    Console.WriteLine(firstScore);
}
catch (FileNotFoundException)
{
    Console.WriteLine("No scores file yet — starting fresh.");
}
catch (FormatException ex)
{
    Console.WriteLine($"Scores file is garbled: {ex.Message}");
}
```

Catches are checked top to bottom; the first matching type wins. Catch **specific** exception types so you only handle what you truly expect — a bare `catch (Exception)` that swallows everything hides bugs.

## finally: cleanup that always runs

```csharp
try
{
    // work that might throw
}
finally
{
    Console.WriteLine("Runs whether it worked or not.");
}
```

For things that need closing (files, connections), prefer a `using` declaration, which cleans up automatically:

```csharp
using var reader = new StreamReader("data.txt");
Console.WriteLine(reader.ReadLine());
// reader is closed here, even if an exception flew through
```

## Throwing your own

Signal bad input loudly instead of limping along with wrong data:

```csharp
public void Withdraw(decimal amount)
{
    if (amount <= 0)
        throw new ArgumentOutOfRangeException(nameof(amount), "Must be positive.");
    if (amount > Balance)
        throw new InvalidOperationException("Insufficient funds.");

    Balance -= amount;
}
```

## Exceptions you'll meet early

- `NullReferenceException` — used `.Something` on a null. Check for null first.
- `FormatException` — `int.Parse("abc")`. Prefer `int.TryParse` for user input.
- `IndexOutOfRangeException` / `ArgumentOutOfRangeException` — asked for position 10 in a list of 3.
- `DivideByZeroException` — integer division by zero.

## When NOT to use exceptions

Exceptions are for *exceptional* situations, not ordinary flow. "User typed a non-number" is expected — use `TryParse`:

```csharp
if (int.TryParse(input, out int value)) { /* use value */ }
else { Console.WriteLine("Please enter a number."); }
```

Rule of thumb: validate what you can predict; catch what you can't.
