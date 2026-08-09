string[] lines =
{
    "2026-04-01,coffee,4.50",
    "2026-04-02,books,23.00",
    "2026-04-03,rent,180.00",
    "2026-04-04,lunch,12.25",
    "2026-04-05,taxi,18.00",
};

const int Rounds = 2000;

// warm-up: JIT-compile both paths before anything is measured
SumWithSplit(lines);
SumWithSpans(lines);

long before = GC.GetAllocatedBytesForCurrentThread();
decimal splitTotal = 0m;
for (int i = 0; i < Rounds; i++)
{
    splitTotal = SumWithSplit(lines);
}
long splitBytes = GC.GetAllocatedBytesForCurrentThread() - before;

before = GC.GetAllocatedBytesForCurrentThread();
decimal spanTotal = 0m;
for (int i = 0; i < Rounds; i++)
{
    spanTotal = SumWithSpans(lines);
}
long spanBytes = GC.GetAllocatedBytesForCurrentThread() - before;

Console.WriteLine("== Allocation lab ==");
Console.WriteLine($"split total: {splitTotal:F2}");
Console.WriteLine($"span total: {spanTotal:F2}");
Console.WriteLine($"split allocated: {splitBytes > 0}");
Console.WriteLine($"span allocated less: {spanBytes < splitBytes}");

static decimal SumWithSplit(string[] lines)
{
    decimal total = 0m;
    foreach (string line in lines)
    {
        total += decimal.Parse(line.Split(',')[2]);   // array + strings, per line
    }
    return total;
}

static decimal SumWithSpans(string[] lines)
{
    decimal total = 0m;
    foreach (string line in lines)
    {
        ReadOnlySpan<char> span = line.AsSpan();
        ReadOnlySpan<char> amount = span[(span.LastIndexOf(',') + 1)..];
        total += decimal.Parse(amount);               // parsed in place, no copies
    }
    return total;
}
