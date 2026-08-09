using System.Diagnostics;

int[] temps = { 61, 63, 66, 71, 68, 74, 79 };

Console.WriteLine($"Scanning {temps.Length} readings");

Stopwatch clock = Stopwatch.StartNew();
int biggestJump = 0;
for (int i = 0; i < temps.Length - 1; i++)
{
    int jump = temps[i + 1] - temps[i];
    Console.Error.WriteLine($"[debug] day {i} -> {i + 1}: jump {jump}");
    if (jump > biggestJump)
    {
        biggestJump = jump;
    }
}
clock.Stop();
Console.Error.WriteLine($"[debug] scan finished in {clock.ElapsedMilliseconds}ms");

Console.WriteLine($"Biggest jump: {biggestJump}");
Console.WriteLine($"Warmest day: {temps.Max()}");
