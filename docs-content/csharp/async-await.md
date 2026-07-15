# Async and await

Some operations spend most of their time *waiting* — for a web server, a database, a file. `async`/`await` lets your program do that waiting without freezing, and the code still reads top to bottom.

## The basic pattern

```csharp
using var client = new HttpClient();

string html = await client.GetStringAsync("https://example.com");
Console.WriteLine(html.Length);
```

`await` means: "start this, let the rest of the app keep breathing, and resume here when the result arrives." Top-level statements can use `await` directly — no wrapper needed.

## Writing your own async methods

An async method is marked `async` and returns a `Task` (no result) or `Task<T>` (a result of type T):

```csharp
async Task<int> CountWordsAsync(string url)
{
    using var client = new HttpClient();
    string text = await client.GetStringAsync(url);
    return text.Split(' ').Length;
}

int words = await CountWordsAsync("https://example.com");
Console.WriteLine($"{words} words");
```

Think of `Task<int>` as "a promise of an int, eventually." By convention, async method names end in `Async`.

## Common awaitable things

```csharp
string text = await File.ReadAllTextAsync("notes.txt");
await File.WriteAllTextAsync("out.txt", "saved!");
await Task.Delay(1000);   // pause 1 second WITHOUT freezing anything
```

Use `Task.Delay` in async code, never `Thread.Sleep` — sleep blocks the thread; delay politely steps aside.

## Waiting for several things at once

Sequential awaits run one at a time. Independent work can overlap:

```csharp
Task<string> pageA = client.GetStringAsync("https://example.com/a");
Task<string> pageB = client.GetStringAsync("https://example.com/b");

string[] pages = await Task.WhenAll(pageA, pageB);   // both in flight together
```

Starting the tasks *before* awaiting is the trick — both requests fly at once.

## Errors in async code

`try`/`catch` works exactly as normal around `await`:

```csharp
try
{
    string data = await client.GetStringAsync(url);
}
catch (HttpRequestException ex)
{
    Console.WriteLine($"Request failed: {ex.Message}");
}
```

## The rules of thumb

- If a method awaits, mark it `async` and return `Task`/`Task<T>`.
- Async spreads upward: callers of async methods usually become async too. Let it.
- Avoid `.Result` and `.Wait()` — they block and can deadlock. `await` all the way.
