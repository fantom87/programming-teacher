// This program CRASHES. Run it, read the stack trace, fix the bug at its
// source — then instrument the scan like production code:
//   * a [debug] line per comparison, via Console.Error.WriteLine
//   * a Stopwatch (using System.Diagnostics;) timing the scan,
//     reported to stderr — timings vary, so they stay off stdout.

int[] temps = { 61, 63, 66, 71, 68, 74, 79 };

Console.WriteLine($"Scanning {temps.Length} readings");

int biggestJump = 0;
for (int i = 0; i < temps.Length; i++)   // <- something here is off by one
{
    int jump = temps[i + 1] - temps[i];
    if (jump > biggestJump)
    {
        biggestJump = jump;
    }
}

Console.WriteLine($"Biggest jump: {biggestJump}");
Console.WriteLine($"Warmest day: {temps.Max()}");
