// A prime census over 1..100000, split into four ranges — one Task.Run each,
// so four cores can count at once. WhenAll keeps the results in range order.
Console.WriteLine("== Prime census ==");

(int From, int To)[] ranges =
{
    (1, 25000),
    (25001, 50000),
    (50001, 75000),
    (75001, 100000),
};

// 1. Build Task<int>[] jobs — one Task.Run(() => CountPrimes(from, to)) per
//    range. Copy the range into locals FIRST:
//      (int from, int to) = ranges[i];
//    A lambda capturing the loop variable i itself is the classic bug.
// 2. int[] counts = await Task.WhenAll(jobs); — argument order, guaranteed.
// 3. Print one line per range from ranges[i] + counts[i]:
//      $"{ranges[i].From}..{ranges[i].To}: {counts[i]} primes"
// 4. Print $"total: {counts.Sum()}" — computed, never typed.
// Do NOT make CountPrimes async, and no shared counter across tasks.
// Output:
//   == Prime census ==
//   1..25000: 2762 primes
//   25001..50000: 2371 primes
//   50001..75000: 2260 primes
//   75001..100000: 2199 primes
//   total: 9592

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
