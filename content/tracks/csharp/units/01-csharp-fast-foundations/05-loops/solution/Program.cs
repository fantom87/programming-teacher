for (int i = 1; i <= 3; i++)
{
    Console.WriteLine($"Lap {i}");
}

string[] planets = { "Mercury", "Venus", "Earth" };
foreach (string planet in planets)
{
    Console.WriteLine(planet);
}

int countdown = 3;
while (countdown > 0)
{
    Console.WriteLine(countdown);
    countdown--;
}
Console.WriteLine("Liftoff!");
