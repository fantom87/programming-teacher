List<Package> packages = new List<Package>
{
    new Package("Oslo", 25, true),
    new Package("Lisbon", 3, true),
    new Package("Prague", 40, false),
    new Package("local", 1, false),
    new Package("Madrid", 8, false),
};

foreach (Package p in packages)
{
    Console.WriteLine($"{p.Destination}: {Label(p)}");
}

if (packages[0] is { Express: true })
{
    Console.WriteLine("first flies tonight");
}

string Label(Package p) => p switch
{
    { Express: true, Kg: > 20 } => "express heavy",
    { Express: true } => "express",
    { Kg: > 20 } => "freight",
    { Destination: "local" } => "courier",
    _ => "standard",
};

record Package(string Destination, double Kg, bool Express);
