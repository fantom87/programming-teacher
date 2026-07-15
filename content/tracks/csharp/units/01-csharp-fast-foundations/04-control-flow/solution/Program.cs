int temperature = 35;
int day = 6; // 1 = Monday ... 7 = Sunday

if (temperature > 30)
{
    Console.WriteLine("Hot");
}
else if (temperature > 15)
{
    Console.WriteLine("Mild");
}
else
{
    Console.WriteLine("Cold");
}

string kind = day switch
{
    6 or 7 => "weekend",
    _ => "weekday",
};
Console.WriteLine(kind);
