Console.WriteLine("== Prime census ==");

(int From, int To)[] ranges =
{
    (1, 25000),
    (25001, 50000),
    (50001, 75000),
    (75001, 100000),
};

Task<int>[] jobs = new Task<int>[ranges.Length];
for (int i = 0; i < ranges.Length; i++)
{
    (int from, int to) = ranges[i];               // copy before capturing
    jobs[i] = Task.Run(() => CountPrimes(from, to));
}

int[] counts = await Task.WhenAll(jobs);          // argument order, guaranteed

for (int i = 0; i < ranges.Length; i++)
{
    Console.WriteLine($"{ranges[i].From}..{ranges[i].To}: {counts[i]} primes");
}
Console.WriteLine($"total: {counts.Sum()}");

static int CountPrimes(int from, int to)
{
    int count = 0;
    for (int n = from; n <= to; n++)
    {
        if (IsPrime(n)) count++;
    }
    return count;
}

static bool IsPrime(int n)
{
    if (n < 2) return false;
    for (int d = 2; d * d <= n; d++)
    {
        if (n % d == 0) return false;
    }
    return true;
}
