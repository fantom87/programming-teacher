int[] rolls = { 4, 6, 1, 6, 3, 6, 2 };

Func<int, bool> isSix = n => n == 6;
Action<string> announce = message => Console.WriteLine($">> {message}");

announce("dice report");
Console.WriteLine($"sixes: {CountWhere(rolls, isSix)}");
Console.WriteLine($"evens: {CountWhere(rolls, n => n % 2 == 0)}");
announce("done");

int CountWhere(int[] values, Func<int, bool> keep)
{
    int count = 0;
    foreach (int v in values)
    {
        if (keep(v)) count++;
    }
    return count;
}
