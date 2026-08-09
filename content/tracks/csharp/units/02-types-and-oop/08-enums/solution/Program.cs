Priority serverDown = Priority.High;
Priority slowSearch = Priority.Medium;
Priority typo = Priority.Low;

Console.WriteLine($"Server down: {serverDown} - respond {ResponseTime(serverDown)}");
Console.WriteLine($"Slow search: {slowSearch} - respond {ResponseTime(slowSearch)}");
Console.WriteLine($"Typo on homepage: {typo} - respond {ResponseTime(typo)}");

string ResponseTime(Priority p)
{
    return p switch
    {
        Priority.High => "within 1 hour",
        Priority.Medium => "within 1 day",
        Priority.Low => "within 1 week",
        _ => "someday",
    };
}

enum Priority
{
    Low,
    Medium,
    High,
}
