int[] temps = { 61, 54, 72, 66, 58 };

(int min, int max) = MinMax(temps);
Console.WriteLine($"low {min}, high {max}");
Console.WriteLine($"swing: {max - min}");

string first = "Ada";
string second = "Grace";
Console.WriteLine($"before: {first}, {second}");
(first, second) = (second, first);
Console.WriteLine($"after: {first}, {second}");

(int Min, int Max) MinMax(int[] values)
{
    int lowest = values[0];
    int highest = values[0];
    foreach (int v in values)
    {
        if (v < lowest) lowest = v;
        if (v > highest) highest = v;
    }
    return (lowest, highest);
}
